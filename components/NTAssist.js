'use client';
import { useEffect, useRef, useState } from 'react';
const actions = [{label:'Find a Product', message:"Tell me what you're manufacturing or what application you're working with, and I'll help identify the relevant NT Enterprises solution."},{label:'Application Help',message:'What application are you trying to solve? Include the material, machine or process if known.'},{label:'Technical Question',message:'What technical detail would you like help with?'},{label:'Request a Quote',message:'I can help prepare your requirement for an NT Enterprises quotation. Please provide the product or application, quantity and any technical details you have.'}];
export default function NTAssist({open, initialPrompt, onClose}) {
 const [messages,setMessages]=useState([]), [input,setInput]=useState(''), [busy,setBusy]=useState(false); const end=useRef(), lastPrompt=useRef('');
 useEffect(() => {
  if (open && initialPrompt && initialPrompt !== lastPrompt.current) {
   lastPrompt.current = initialPrompt;
   void send(initialPrompt);
  }
 }, [open, initialPrompt]);
 useEffect(() => {
  end.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages, busy]);
 async function send(text=input){ const value=text.trim(); if(!value||busy)return; const next=[...messages,{role:'user',content:value}]; setMessages(next); setInput(''); setBusy(true); window.dispatchEvent(new CustomEvent('nt-event',{detail:'ai_message_sent'})); try {const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:value,history:messages.slice(-10)})});const data=await res.json();setMessages(m=>[...m,{role:'assistant',content:data.answer || 'NT Assist is temporarily unavailable. You can still send your requirement to the NT Enterprises team.',error:!res.ok}]);}catch{setMessages(m=>[...m,{role:'assistant',content:'NT Assist is temporarily unavailable. You can still send your requirement to the NT Enterprises team.',error:true}]);}finally{setBusy(false)} }
 return <aside className={'assist '+(open?'open':'')} aria-hidden={!open}><div className="assist-head"><div><span className="status"></span><b>NT ASSIST</b><small>Industrial solutions assistant</small></div><button aria-label="Close NT Assist" onClick={onClose}>×</button></div><div className="chat">{messages.length===0&&<div className="welcome"><p>Tell me about your application or requirement. I’ll use verified NT Enterprises information to help guide the next step.</p><div className="quick-actions">{actions.map(a=><button key={a.label} onClick={()=>send(a.message)}>{a.label} <b>→</b></button>)}<label className="upload"><input type="file" accept="application/pdf,image/png,image/jpeg" disabled/>Upload Requirement <small>Coming soon</small></label></div></div>}{messages.map((m,i)=><div className={'message '+m.role} key={i}>{m.content}</div>)}{busy&&<div className="message assistant loading">Checking approved information<span>...</span></div>}<div ref={end}/></div><form className="chat-form" onSubmit={e=>{e.preventDefault();send()}}><input value={input} onChange={e=>setInput(e.target.value)} maxLength="1200" placeholder="Describe your requirement..."/><button disabled={busy||!input.trim()} aria-label="Send message">↑</button></form><a className="assist-quote" href="#quote" onClick={onClose}>Request a Quote →</a></aside>;
}
