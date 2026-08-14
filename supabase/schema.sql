-- Maktaba schema
-- Paste this into YOUR institute's Supabase SQL editor (Dashboard → SQL).
-- Do not use another organization's project. There is no bundled admin account.

create extension if not exists "pgcrypto";

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'pending' check (role in ('admin', 'librarian', 'pending')),
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  library_name text not null default 'Maktaba',
  max_books_per_student int not null default 3 check (max_books_per_student >= 1),
  max_borrow_days int not null default 14 check (max_borrow_days >= 1),
  fine_per_day numeric(10, 2) not null default 5 check (fine_per_day >= 0),
  lost_book_fine numeric(10, 2) not null default 500 check (lost_book_fine >= 0),
  currency_symbol text not null default '₹'
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  isbn text,
  category text not null,
  publisher text,
  publication_year int,
  total_copies int not null check (total_copies >= 0),
  available_copies int not null check (available_copies >= 0),
  description text,
  created_at timestamptz not null default now(),
  constraint books_copies_ok check (available_copies <= total_copies)
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  roll_number text not null,
  grade text not null default '',
  father_name text not null default '',
  contact_number text not null default '',
  address text,
  borrowed_books int not null default 0 check (borrowed_books >= 0),
  fines_due numeric(10, 2) not null default 0 check (fines_due >= 0),
  created_at timestamptz not null default now(),
  constraint students_roll_unique unique (roll_number)
);

create table if not exists public.borrowings (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books (id),
  student_id uuid not null references public.students (id),
  book_title text not null,
  student_name text not null,
  borrow_date date not null default current_date,
  due_date date not null,
  return_date date,
  status text not null default 'Borrowed' check (status in ('Borrowed', 'Returned', 'Lost')),
  fine_amount numeric(10, 2) not null default 0 check (fine_amount >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  month text not null,
  year int not null,
  language text not null,
  description text not null default '',
  booklet_url text,
  audio_url text,
  thumbnail_url text,
  download_count int not null default 0 check (download_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists books_title_idx on public.books (title);
create index if not exists books_author_idx on public.books (author);
create index if not exists books_category_idx on public.books (category);
create index if not exists students_name_idx on public.students (name);
create index if not exists students_roll_idx on public.students (roll_number);
create index if not exists borrowings_status_idx on public.borrowings (status);
create index if not exists borrowings_student_idx on public.borrowings (student_id);
create index if not exists borrowings_book_idx on public.borrowings (book_id);
create index if not exists borrowings_due_idx on public.borrowings (due_date);
create index if not exists publications_year_idx on public.publications (year, month);

-- ---------------------------------------------------------------------------
-- Privileged helpers (private schema)
-- ---------------------------------------------------------------------------

create or replace function private.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'librarian')
  );
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- First signup becomes admin. Later signups stay pending until an admin promotes them.
-- Role is assigned here, never from user-editable user_metadata.
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  staff_count int;
  assigned_role text;
begin
  select count(*) into staff_count
  from public.profiles
  where role in ('admin', 'librarian');

  if staff_count = 0 then
    assigned_role := 'admin';
  else
    assigned_role := 'pending';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), split_part(coalesce(new.email, 'staff'), '@', 1)),
    assigned_role
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

create or replace function private.issue_book(p_book_id uuid, p_student_id uuid, p_duration_days int)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_book public.books%rowtype;
  v_student public.students%rowtype;
  v_settings public.settings%rowtype;
  v_id uuid;
begin
  if not private.is_staff() then
    raise exception 'Not allowed';
  end if;

  if p_duration_days is null or p_duration_days < 1 then
    raise exception 'Duration must be at least 1 day';
  end if;

  select * into v_settings from public.settings where id = 1;
  if not found then
    raise exception 'Library settings are missing';
  end if;

  select * into v_book from public.books where id = p_book_id for update;
  if not found then
    raise exception 'Book not found';
  end if;
  if v_book.available_copies < 1 then
    raise exception 'No copies available';
  end if;

  select * into v_student from public.students where id = p_student_id for update;
  if not found then
    raise exception 'Student not found';
  end if;
  if v_student.borrowed_books >= v_settings.max_books_per_student then
    raise exception 'Student has reached the borrow limit';
  end if;

  insert into public.borrowings (
    book_id, student_id, book_title, student_name, borrow_date, due_date, status
  ) values (
    v_book.id,
    v_student.id,
    v_book.title,
    v_student.name,
    current_date,
    current_date + p_duration_days,
    'Borrowed'
  ) returning id into v_id;

  update public.books
  set available_copies = available_copies - 1
  where id = v_book.id;

  update public.students
  set borrowed_books = borrowed_books + 1
  where id = v_student.id;

  return v_id;
end;
$$;

create or replace function private.return_book(p_borrowing_id uuid)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_loan public.borrowings%rowtype;
  v_settings public.settings%rowtype;
  v_days int;
  v_fine numeric(10, 2);
begin
  if not private.is_staff() then
    raise exception 'Not allowed';
  end if;

  select * into v_loan from public.borrowings where id = p_borrowing_id for update;
  if not found then
    raise exception 'Borrowing not found';
  end if;
  if v_loan.status in ('Returned', 'Lost') then
    raise exception 'This loan is already closed';
  end if;

  select * into v_settings from public.settings where id = 1;

  v_days := greatest(0, (current_date - v_loan.due_date));
  v_fine := v_days * coalesce(v_settings.fine_per_day, 0);

  update public.borrowings
  set status = 'Returned',
      return_date = current_date,
      fine_amount = v_fine
  where id = v_loan.id;

  update public.books
  set available_copies = least(total_copies, available_copies + 1)
  where id = v_loan.book_id;

  update public.students
  set borrowed_books = greatest(0, borrowed_books - 1),
      fines_due = fines_due + v_fine
  where id = v_loan.student_id;

  return v_fine;
end;
$$;

create or replace function private.mark_book_lost(p_borrowing_id uuid)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_loan public.borrowings%rowtype;
  v_settings public.settings%rowtype;
  v_fine numeric(10, 2);
begin
  if not private.is_staff() then
    raise exception 'Not allowed';
  end if;

  select * into v_loan from public.borrowings where id = p_borrowing_id for update;
  if not found then
    raise exception 'Borrowing not found';
  end if;
  if v_loan.status in ('Returned', 'Lost') then
    raise exception 'This loan is already closed';
  end if;

  select * into v_settings from public.settings where id = 1;
  v_fine := coalesce(v_settings.lost_book_fine, 0);

  update public.borrowings
  set status = 'Lost',
      return_date = current_date,
      fine_amount = v_fine
  where id = v_loan.id;

  update public.books
  set total_copies = greatest(0, total_copies - 1)
  where id = v_loan.book_id;

  update public.students
  set borrowed_books = greatest(0, borrowed_books - 1),
      fines_due = fines_due + v_fine
  where id = v_loan.student_id;

  return v_fine;
end;
$$;

create or replace function private.pay_student_fine(p_student_id uuid, p_amount numeric)
returns numeric
language plpgsql
security definer
set search_path = public
as $$
declare
  v_remaining numeric(10, 2);
begin
  if not private.is_staff() then
    raise exception 'Not allowed';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Payment must be greater than 0';
  end if;

  update public.students
  set fines_due = greatest(0, fines_due - p_amount)
  where id = p_student_id
  returning fines_due into v_remaining;

  if not found then
    raise exception 'Student not found';
  end if;

  return v_remaining;
end;
$$;

create or replace function private.increment_download(p_publication_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.publications
  set download_count = download_count + 1
  where id = p_publication_id;
end;
$$;

-- Public RPC wrappers (PostgREST)
create or replace function public.issue_book(p_book_id uuid, p_student_id uuid, p_duration_days int)
returns uuid
language sql
security invoker
as $$ select private.issue_book(p_book_id, p_student_id, p_duration_days); $$;

create or replace function public.return_book(p_borrowing_id uuid)
returns numeric
language sql
security invoker
as $$ select private.return_book(p_borrowing_id); $$;

create or replace function public.mark_book_lost(p_borrowing_id uuid)
returns numeric
language sql
security invoker
as $$ select private.mark_book_lost(p_borrowing_id); $$;

create or replace function public.pay_student_fine(p_student_id uuid, p_amount numeric)
returns numeric
language sql
security invoker
as $$ select private.pay_student_fine(p_student_id, p_amount); $$;

create or replace function public.increment_download(p_publication_id uuid)
returns void
language plpgsql
security invoker
as $$
begin
  perform private.increment_download(p_publication_id);
end;
$$;

grant usage on schema private to authenticated, anon;
grant execute on function private.is_staff() to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.issue_book(uuid, uuid, int) to authenticated;
grant execute on function private.return_book(uuid) to authenticated;
grant execute on function private.mark_book_lost(uuid) to authenticated;
grant execute on function private.pay_student_fine(uuid, numeric) to authenticated;
grant execute on function private.increment_download(uuid) to anon, authenticated;

grant execute on function public.issue_book(uuid, uuid, int) to authenticated;
grant execute on function public.return_book(uuid) to authenticated;
grant execute on function public.mark_book_lost(uuid) to authenticated;
grant execute on function public.pay_student_fine(uuid, numeric) to authenticated;
grant execute on function public.increment_download(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.books enable row level security;
alter table public.students enable row level security;
alter table public.borrowings enable row level security;
alter table public.publications enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or private.is_staff());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists settings_public_read on public.settings;
create policy settings_public_read on public.settings
  for select to anon, authenticated
  using (true);

drop policy if exists settings_admin_update on public.settings;
create policy settings_admin_update on public.settings
  for update to authenticated
  using (private.is_admin())
  with check (private.is_admin());

drop policy if exists books_staff_all on public.books;
create policy books_staff_all on public.books
  for all to authenticated
  using (private.is_staff())
  with check (private.is_staff());

drop policy if exists students_staff_all on public.students;
create policy students_staff_all on public.students
  for all to authenticated
  using (private.is_staff())
  with check (private.is_staff());

drop policy if exists borrowings_staff_all on public.borrowings;
create policy borrowings_staff_all on public.borrowings
  for all to authenticated
  using (private.is_staff())
  with check (private.is_staff());

drop policy if exists publications_public_read on public.publications;
create policy publications_public_read on public.publications
  for select to anon, authenticated
  using (true);

drop policy if exists publications_staff_write on public.publications;
create policy publications_staff_write on public.publications
  for all to authenticated
  using (private.is_staff())
  with check (private.is_staff());

-- ---------------------------------------------------------------------------
-- Storage: publications bucket (PDF / audio / thumbnails)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('publications', 'publications', true)
on conflict (id) do nothing;

drop policy if exists publications_storage_public_read on storage.objects;
create policy publications_storage_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'publications');

drop policy if exists publications_storage_staff_insert on storage.objects;
create policy publications_storage_staff_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'publications' and private.is_staff());

drop policy if exists publications_storage_staff_update on storage.objects;
create policy publications_storage_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'publications' and private.is_staff())
  with check (bucket_id = 'publications' and private.is_staff());

drop policy if exists publications_storage_staff_delete on storage.objects;
create policy publications_storage_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'publications' and private.is_staff());
