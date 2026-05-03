# MekWeb

Premium web agency website built with React, Vite, Tailwind CSS, and Supabase newsletter capture.

## Local setup

```bash
npm install
npm run dev
```

## Required environment variables

Create a `.env` file before deploying:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

## Checks

```bash
npm run lint
npm run test
npm run build
```

## Domain launch notes

- Add the same Supabase variables in your hosting dashboard.
- Point the domain DNS to your hosting provider.
- Update `contact@mekweb.ma` if your final domain email is different.
