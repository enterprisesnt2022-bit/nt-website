const base = 'https://generativelanguage.googleapis.com/v1beta/models';
function configured() { return Boolean(process.env.GEMINI_API_KEY); }
async function request(model, body) {
  if (!configured()) throw new Error('Gemini is not configured');
  const response = await fetch(`${base}/${model}?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  return response.json();
}
export async function generateEmbedding(text) {
  const data = await request('text-embedding-004:embedContent', { content: { parts: [{ text }] } });
  return data.embedding?.values;
}
export async function answerWithGemini(question, context, history = []) {
  const instruction = `You are NT Assist, the AI industrial solutions assistant for NT Enterprises. Answer only using the supplied approved knowledge context. Never invent specifications, prices, delivery timelines, certifications or suitability. If the context does not establish an answer, say you do not have verified information and offer a quote. Be concise, professional and technical.\n\nAPPROVED KNOWLEDGE:\n${context}`;
  const contents = [...history.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{text: m.content}] })), { role:'user', parts:[{text: question}] }];
  const data = await request('gemini-1.5-flash:generateContent', { systemInstruction:{parts:[{text:instruction}]}, contents, generationConfig:{temperature:0.15,maxOutputTokens:450} });
  return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('')?.trim();
}
export async function summarizeEnquiry(enquiry) {
  const safe = JSON.stringify(enquiry);
  const data = await request('gemini-1.5-flash:generateContent', { contents:[{role:'user',parts:[{text:`Create a short factual enquiry summary using only this submitted data. Do not add missing specifications. Format as plain labeled lines. Data: ${safe}` }]}], generationConfig:{temperature:0,maxOutputTokens:220} });
  return data.candidates?.[0]?.content?.parts?.map(p=>p.text).join('').trim() || null;
}
