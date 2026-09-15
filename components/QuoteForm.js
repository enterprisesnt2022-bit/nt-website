'use client';
import { useState } from 'react';
const fields=[['name','Name *'],['company','Company'],['email','Email *'],['phone','Phone *'],['product','Product / Requirement *'],['quantity','Quantity'],['application','Application / Use Case *'],['requirement','Technical Requirements (optional)']];
export default function QuoteForm({onAssist}) {
  const [form,setForm]=useState({});
  const [state,setState]=useState({status:'idle',message:''});
  const updateField=(key,value)=>{setForm(current=>({...current,[key]:value}));if(state.status==='error')setState({status:'idle',message:''});};
  async function submit(e){
    e.preventDefault();
    setState({status:'sending',message:''});
    try{
      const response=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||'Unable to submit the enquiry right now.');
      window.dispatchEvent(new CustomEvent('nt-event',{detail:'quote_submitted'}));
      setState({status:'received',message:data.reference});
    }catch(error){
      setState({status:'error',message:error instanceof Error?error.message:'Unable to submit the enquiry right now.'});
    }
  }
  return <form className="quote-form" onSubmit={submit}>{fields.map(([key,label])=><label key={key}>{label}{key==='requirement'?<textarea value={form[key]||''} onChange={e=>updateField(key,e.target.value)}/>:<input type={key==='email'?'email':'text'} required={['name','email','phone','product','application'].includes(key)} value={form[key]||''} onChange={e=>updateField(key,e.target.value)}/>}</label>)}<div className="form-actions"><button type="button" className="inline-link" onClick={onAssist}>Help me describe it ↗</button><button className="button button-dark" disabled={state.status==='sending'}>{state.status==='sending'?'Sending…':'Send requirement →'}</button></div>{state.status==='received'&&<p className="success" role="status">Your requirement has been received. Reference: {state.message}</p>}{state.status==='error'&&<p className="error" role="alert">{state.message}</p>}</form>;
}
