# Newsletter Email Database Setup

Use this setup to save emails from the homepage email box, so you can send news and blog updates later.

## 1. Create the database table

In Supabase, open SQL Editor and run:

```sql
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'website',
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "Anyone can subscribe to newsletter" on public.newsletter_subscribers;

create policy "Anyone can subscribe to newsletter"
on public.newsletter_subscribers
for insert
to anon
with check (
  email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);
```

The same SQL is also saved in `supabase/newsletter_subscribers.sql`.

## 2. Add the website keys

Create a `.env` file and add:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

You can find these values in Supabase under Project Settings, then API.

## 3. Restart the website

After adding `.env`, restart the local website server.

New emails will appear in Supabase inside the `newsletter_subscribers` table.
