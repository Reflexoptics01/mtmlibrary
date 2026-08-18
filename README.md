# Maktaba

Open-source library management for Muslim institutes, schools, and madrasas.

Each institute hosts **their own** [Supabase](https://supabase.com) project. This repository does not include an admin account, API keys, a Firebase project, or any shared backend.

Do not look for or reuse an old Firebase app — Maktaba talks only to the Supabase URL and anon key you put in `.env.local`.

## Features

- Book catalog with copy counts
- Student / talib records
- Atomic issue, return, and renewal (fines calculated in the database)
- Admin-configurable library rules: name, borrow limits, fine rates, currency
- Publications (PDF + optional audio)
- First signup on a new project becomes admin; later signups stay pending until approved
- Row Level Security on every table

## Setup

1. Create a **new** Supabase project for your institute.
2. Enable Email auth (Authentication → Providers → Email).
3. In the SQL editor, paste and run [`supabase/schema.sql`](supabase/schema.sql).
4. Copy `.env.example` to `.env.local` and add **your** project URL and anon key only:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Never put the `service_role` key in this app.

5. Install and run:

```bash
npm install
npm run dev
```

6. Open the site, go to **Create staff account**, and register the first user. That person becomes admin. Later staff must be approved under **Staff**.

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md).

## License

MIT. See [LICENSE](LICENSE).
