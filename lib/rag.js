import { generateEmbedding } from './gemini';
import { rpc } from './supabase';
export async function retrieveRelevantKnowledge(query) {
  const embedding = await generateEmbedding(query);
  if (!embedding) throw new Error('Embedding failed');
  return rpc('match_knowledge_chunks', { query_embedding: embedding, match_threshold: 0.55, match_count: 6 });
}
