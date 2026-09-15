# NT Enterprises

## Local setup
1. Install Node.js 18.17+ and pnpm, then run `pnpm install`.
2. Create a Supabase project and run `supabase/schema.sql`, then `supabase/seed.sql` in its SQL editor. This creates the `enquiries` table and the `match_knowledge_chunks` RPC used by the site.
3. Set `GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and `EMAIL_FROM` in `.env` or `.env.local`, then run `pnpm dev`. `NOTIFICATION_EMAIL` defaults to `enterprisesnt2022@gmail.com`.

## Knowledge ingestion
Seed rows are deliberately conservative. After applying the SQL and loading the environment variables, run `pnpm ingest:knowledge`. It embeds the approved entries in `supabase/knowledge-source.json` with Gemini's 768-dimensional embedding model and inserts them into `knowledge_chunks`. Add only approved product, FAQ or document content to that file before repeating ingestion. The chat route returns a safe non-fabrication fallback if retrieval finds no matching chunk.

Use `GET /api/health` after setup. It verifies the required environment variables, database tables, and vector retrieval function before the site is used in production.

## Email notifications
Quote submissions are stored in Supabase and sent to `NOTIFICATION_EMAIL` through Resend. Verify the sender domain in Resend and set `EMAIL_FROM` to an address on that domain. The sample `onboarding@resend.dev` sender is suitable only for Resend's limited testing flow.

## Deployment
Deploy to Vercel (or another Node-compatible Next.js host), set the same environment variables in the host dashboard, and run the SQL and ingestion steps once in the production Supabase project. Service-role credentials remain server-side.
