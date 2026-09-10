import { readFile } from 'node:fs/promises';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;
if (!url || !serviceKey || !geminiKey) throw new Error('Set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and GEMINI_API_KEY before ingesting knowledge.');
const source = JSON.parse(await readFile(new URL('../supabase/knowledge-source.json', import.meta.url), 'utf8'));
const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' };
for (const item of source) {
  const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({content:{parts:[{text:item.content}]}}) });
  if (!embeddingResponse.ok) throw new Error(`Gemini embedding failed for ${item.title}`);
  const embedding = (await embeddingResponse.json()).embedding.values;
  const inserted = await fetch(`${url}/rest/v1/knowledge_chunks`, { method:'POST', headers:{...headers, Prefer:'return=minimal'}, body:JSON.stringify({source_type:item.source_type,content:item.content,embedding,metadata:{title:item.title}}) });
  if (!inserted.ok) throw new Error(`Supabase insert failed for ${item.title}: ${await inserted.text()}`);
  console.log(`Ingested: ${item.title}`);
}
