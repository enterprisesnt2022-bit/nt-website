const base = 'https://generativelanguage.googleapis.com/v1beta/models';
const generationModel = 'gemini-3.6-flash';
const embeddingModel = 'gemini-embedding-001';
function configured() { return Boolean(process.env.GEMINI_API_KEY); }
async function request(model, body) {
  if (!configured()) throw new Error('Gemini is not configured');
  const response = await fetch(`${base}/${model}?key=${process.env.GEMINI_API_KEY}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed: ${response.status}${detail ? ` - ${detail.slice(0, 300)}` : ''}`);
  }
  return response.json();
}
export async function generateEmbedding(text) {
  const data = await request(`${embeddingModel}:embedContent`, { content: { parts: [{ text }] }, taskType: 'RETRIEVAL_QUERY', outputDimensionality: 768 });
  return data.embedding?.values;
}
export async function answerWithGemini(question, context, history = []) {
  const instruction = `You are NT Assist, the helpful industrial solutions assistant for NT Enterprises. Sound warm, confident and professional, like an experienced member of the NT team. Answer only using the supplied approved knowledge context. Never invent specifications, prices, delivery timelines, certifications, stock status or suitability. If the context does not establish an answer, say that the NT team should confirm it and offer to help start a quote.

When introducing the product range, use this structure:
Hello, and welcome to NT Enterprises. I can help you find the right industrial solution.

PRODUCTS AND MATERIALS
- Industrial Hardware
- Packaging Material and Side Packing Foam
- Flexographic Printing Machines and Doctor Blades
- Diaphragms
- Ceramic Rollers

TECHNICAL SUPPORT
- Woven Sack Technical Consultancy

Close with one helpful question, such as: What product, application, quantity or technical requirement would you like to discuss?

Use plain text only. Do not use Markdown bold markers, tables, emojis or exaggerated claims. Keep the answer easy to scan and concise.

APPROVED KNOWLEDGE:\n${context}`;
  const contents = [...history.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{text: m.content}] })), { role:'user', parts:[{text: question}] }];
  const data = await request(`${generationModel}:generateContent`, { systemInstruction:{parts:[{text:instruction}]}, contents, generationConfig:{temperature:0.15,maxOutputTokens:450} });
  return data.candidates?.[0]?.content?.parts?.map(p => p.text).join('')?.trim();
}
export async function summarizeEnquiry(enquiry) {
  const safe = JSON.stringify(enquiry);
  const data = await request(`${generationModel}:generateContent`, { contents:[{role:'user',parts:[{text:`Create a short factual enquiry summary using only this submitted data. Do not add missing specifications. Format as plain labeled lines. Data: ${safe}` }]}], generationConfig:{temperature:0,maxOutputTokens:220} });
  return data.candidates?.[0]?.content?.parts?.map(p=>p.text).join('').trim() || null;
}
