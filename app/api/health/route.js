import { NextResponse } from 'next/server';
import { rpc, select } from '@/lib/supabase';
import { emailConfigured } from '@/lib/email';

export async function GET() {
  const checks = { gemini: Boolean(process.env.GEMINI_API_KEY), supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY), email: emailConfigured(), tables: false, retrieval: false };
  const errors = [];
  if (!checks.gemini) errors.push('GEMINI_API_KEY is missing.');
  if (!checks.supabase) errors.push('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.');
  if (!checks.email) errors.push('RESEND_API_KEY or EMAIL_FROM is missing.');

  if (checks.supabase) {
    try {
      await Promise.all([select('enquiries'), select('knowledge_chunks'), select('products')]);
      checks.tables = true;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Supabase tables are unavailable.');
    }
    try {
      await rpc('match_knowledge_chunks', { query_embedding: Array(768).fill(0), match_threshold: 0, match_count: 1 });
      checks.retrieval = true;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'The knowledge retrieval function is unavailable.');
    }
  }

  const healthy = checks.gemini && checks.supabase && checks.tables && checks.retrieval;
  return NextResponse.json({ ok: healthy, checks, errors, next: healthy ? 'Core integrations are ready. Email notifications are optional.' : 'Run supabase/schema.sql in the Supabase SQL editor, then run pnpm ingest:knowledge.' }, { status: healthy ? 200 : 503 });
}