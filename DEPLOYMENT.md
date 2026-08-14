# Maktaba — Deployment

Use **your own** Supabase project. This app is not linked to any shared backend.

## 1. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com) (or self-host).
2. Create a new project.
3. Authentication → Email: enable email/password.
4. SQL editor: run the full contents of `supabase/schema.sql`.
5. Settings → API: copy the project URL and the **anon / publishable** key.

Do not create a default admin user in SQL. The first person who registers in the app becomes admin.

## 2. Environment variables

Local `.env.local` and your host (Vercel, etc.):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 3. Vercel

1. Import the repo.
2. Add the two environment variables above.
3. Deploy.

## Troubleshooting

- “Not allowed” on issue/return: the logged-in profile is still `pending`. An admin must open **Staff** and set the role to librarian.
- Uploads fail: confirm `schema.sql` created the `publications` storage bucket.
- Login fails: confirm Email auth is enabled and you are using this project’s keys.
