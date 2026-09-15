const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
function config() { if (!url || !key) throw new Error('Supabase is not configured'); return {headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'}}; }
async function assertOk(response, operation) { if (response.ok) return; const detail = await response.text(); throw new Error(`Supabase ${operation} failed: ${response.status}${detail ? ` - ${detail.slice(0, 300)}` : ''}`); }
export async function rpc(name, args) { const res=await fetch(`${url}/rest/v1/rpc/${name}`,{method:'POST',...config(),body:JSON.stringify(args)}); await assertOk(res, 'retrieval'); return res.json(); }
export async function insert(table, row) { const res=await fetch(`${url}/rest/v1/${table}`,{method:'POST',...config(),headers:{...config().headers,Prefer:'return=representation'},body:JSON.stringify(row)}); await assertOk(res, 'insert'); return res.json(); }
export async function select(table) { const res=await fetch(`${url}/rest/v1/${table}?select=*&limit=1`,{method:'GET',...config()}); await assertOk(res, 'table check'); return res.json(); }
