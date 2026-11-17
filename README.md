# MekWeb

Premium web agency website built with React, Vite, Tailwind CSS, and Supabase newsletter capture.

## Local setup

```bash
npm ci
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
npm run typecheck
npm run test
npm run build
```

## Domain launch notes

- Add the same Supabase variables in your hosting dashboard.
- Point the domain DNS to your hosting provider.
- Current public email is `mekwebagency@gmail.com`; update it later if you create a domain email.

## Redesign preview

The premium editorial redesign is local to `design/premium-editorial`. Run `npm run dev` to preview it; no deployment is required. Existing package prices, FAQ answers, contact details, and portfolio data are retained. The portfolio now uses six generated visual concepts matched to the existing business categories. Each is labeled “Concept visuel”; these illustrations do not establish delivered client projects. The original project titles and descriptions remain.

The contact form prepares a WhatsApp message after validation. It does not send or store a request. The visitor opens WhatsApp and confirms delivery there; entered fields remain available. The Supabase newsletter helper is preserved but is not mounted as a newsletter form.

## Vercel

`vercel.json` specifies Vite, `npm run build`, `dist`, and the SPA fallback documented by Vercel. Existing static files take precedence. This supports the React Router catch-all; unknown paths show the French 404 screen. A deployed SPA fallback normally responds with HTTP 200, so strict HTTP 404 status handling would require a different hosting approach.

The public preferred hostname is `www.mekwebagency.com`, matching the observed live redirect. No dashboard settings or production environment variables are changed by local development. Use public client credentials only for any `VITE_` variables.
