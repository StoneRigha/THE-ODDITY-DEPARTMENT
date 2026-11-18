# The Oddity Department

A playful, share-first micro-experience: visitors consult a deliberately questionable oracle, receive an oddly specific prediction, export a designed omen card, and share a permanent public URL. The community wall surfaces recent omens.

## Stack

- Next.js 15 App Router + React 19 + TypeScript
- Tailwind CSS with shadcn/ui configuration (`components.json`)
- Supabase Postgres (anonymous read/insert, server-side reaction RPC)
- Optional OpenAI Chat Completions API for contextual prophecy generation
- Framer Motion, Lucide, Sonner, html-to-image
- Vercel deployment

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run the complete `supabase/schema.sql` (safe to rerun; it includes migrations for the added fields).
3. Copy the project URL and anon/public key from **Project Settings → API**.
4. Add them to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The app intentionally does not need user accounts. The public anon key is safe to expose when RLS is enabled and policies are constrained as in the schema. Never put the Supabase service-role key in a `NEXT_PUBLIC_` variable. The service-role key is not needed for this experience.

## Enable the AI Oracle (optional)

Add a server-only key to `.env.local`:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Restart the dev server. The Oracle API now generates a tailored, structured prophecy using the OpenAI API. If the key is absent or the API is unavailable, the app gracefully falls back to its curated local generator. The key is never sent to the browser.

## Features

- **Personal Oracle:** mood-aware prophecy for the visitor.
- **The Uncanny Match:** affectionate, fictional prophecy about a named friend, partner, sibling, colleague, ex or roommate.
- **Shareable omen pages:** each saved omen has a unique `/omen/[slug]` page with social metadata.
- **Card export:** share, copy or save the designed prophecy card as PNG.
- **Community wall:** recent public prophecies with reactions.
- **Department statistics:** live archive totals, today's submissions, reactions and most common moods (refreshes every 30 seconds).
- **Demo mode:** the generator works without Supabase; permanent URLs, community data and live statistics require Supabase.

## API

- `POST /api/omens` — generate and optionally persist an omen.
- `GET /api/omens` — returns the six most recent public omens.
- `POST /api/omens/:slug/react` — increments reactions using a Postgres RPC.
- `GET /api/stats` — returns aggregate archive statistics.
- `/omen/:slug` — public, metadata-rich share page for a persisted omen.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in Project Settings → Environment Variables. Set the site URL to the production domain.
4. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` to enable AI generation.
5. Deploy. Vercel detects Next.js automatically. Redeploy after changing environment variables.

## Production hardening before a public launch

- Add per-IP rate limiting (e.g. Upstash Redis) to generation and reaction endpoints.
- Add a CAPTCHA and spam moderation if automated submissions become a problem.
- Add a reaction ledger keyed by authenticated user or privacy-preserving browser token to prevent repeat reactions.
- Review Supabase RLS policies before adding private user data. Current policies intentionally allow anonymous public reads and inserts for this no-account experiment.
- Consider retention and moderation controls for names submitted in friend mode. Names are optional public-record metadata; do not submit sensitive personal information.
# THE-ODDITY-DEPARTMENT
