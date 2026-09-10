# NT Enterprises

## Local setup
1. Install Node.js 18.17+ (the current workspace does not have Node/npm available), then run `npm install` and copy `.env.example` to `.env.local`.
2. Create a Supabase project and run `supabase/schema.sql`, then `supabase/seed.sql` in its SQL editor.
3. Set the four environment variables in `.env.local` and run `npm run dev`.

## Knowledge ingestion
Seed rows are deliberately conservative. After applying the SQL and loading the environment variables, run `npm run ingest:knowledge`. It embeds the approved entries in `supabase/knowledge-source.json` and inserts them into `knowledge_chunks`. Add only approved product, FAQ or document content to that file before repeating ingestion. The chat route returns a safe non-fabrication fallback if retrieval finds no matching chunk.

## Deployment
Deploy to Vercel (or another Node-compatible Next.js host), set the same environment variables in the host dashboard, and run the SQL once in the production Supabase project. Service-role credentials remain server-side.
