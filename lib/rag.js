import { generateEmbedding } from './gemini';
import { rpc } from './supabase';
import source from '../supabase/knowledge-source.json';

const localKnowledge = source.map(item => ({ content: item.content, metadata: { title: item.title, source_type: item.source_type } }));

export async function retrieveRelevantKnowledge(query) {
  const embedding = await generateEmbedding(query);
  if (!embedding) throw new Error('Embedding failed');
  try {
    return await rpc('match_knowledge_chunks', { query_embedding: embedding, match_threshold: 0.55, match_count: 6 });
  } catch (error) {
    if (error instanceof Error && /PGRST202|PGRST205|schema cache|not found/i.test(error.message)) return localKnowledge;
    throw error;
  }
}
