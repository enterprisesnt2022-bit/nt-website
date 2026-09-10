'use client';
import { useState } from 'react';
import NTAssist from './NTAssist';
import QuoteForm from './QuoteForm';

const products = [
  ['Industrial Hardware', 'Components and material solutions for industrial requirements.'],
  ['Packaging Material', 'Packaging materials for operational and production needs.'],
  ['Flexographic Printing Machines', 'Solutions for flexographic printing operations.'],
  ['Doctor Blades', 'Doctor blade solutions for printing applications.'],
  ['Side Packing Foam', 'Foam solutions for packing requirements.'],
  ['Diaphragms', 'Diaphragm solutions for industrial applications.'],
  ['Ceramic Rollers', 'Roller solutions for relevant industrial processes.'],
  ['Woven Sack Technical Consultancy', 'Technical guidance for woven sack manufacturing.']
];
const industries = [
  ['Flexible Packaging', 'Relevant material and flexographic printing solutions.', 'Packaging Material · Doctor Blades'],
  ['Plastic & Polymer Manufacturing', 'Industrial materials for production-focused requirements.', 'Industrial Hardware · Diaphragms'],
  ['Printing Industry', 'Solutions supporting flexographic printing applications.', 'Flexographic Printing · Doctor Blades'],
  ['Woven Sack Manufacturing', 'Technical support for woven sack applications.', 'Technical Consultancy'],
  ['Industrial Manufacturing', 'Materials and components for specific industrial needs.', 'Hardware · Ceramic Rollers'],
  ['Packaging Industry', 'Practical materials for packaging operations.', 'Packaging Material · Side Packing Foam']
];

export default function Site() {
  const [assist, setAssist] = useState(false);
  const [prompt, setPrompt] = useState('');
  const ask = (text) => { setPrompt(text); setAssist(true); };
  const event = (name) => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('nt-event', { detail: name }));
  return <>
    <header className="nav"><a href="#top" className="brand">NT<span>.</span> ENTERPRISES</a><nav><a href="#solutions">Solutions</a><a href="#industries">Industries</a><a href="#resources">Resources</a><a href="#contact">Contact</a></nav><button className="nav-cta" onClick={() => { event('quote_started'); document.querySelector('#quote').scrollIntoView({behavior:'smooth'}); }}>Request a Quote</button></header>
    <main id="top">
      <section className="hero"><div className="hero-grid"></div><p className="eyebrow">INDUSTRIAL MATERIALS · TECHNICAL SOLUTIONS</p><h1>Built around<br/><em>the requirement.</em></h1><p className="hero-copy">NT Enterprises supplies industrial materials and practical technical solutions for businesses that need a dependable partner.</p><div className="hero-actions"><a className="button button-dark" href="#solutions">Explore solutions <b>→</b></a><button className="text-button" onClick={() => ask('I need help identifying an NT Enterprises solution for my application.')}>Talk to NT Assist <b>↗</b></button></div><div className="hero-foot"><span>01 / 04</span><span>Based in Nashik, Maharashtra</span></div></section>
      <section id="solutions" className="section"><div className="section-head"><div><p className="eyebrow">WHAT WE PROVIDE</p><h2>Solutions for<br/>industrial work.</h2></div><p>Explore our core supply and technical solution categories. Tell us about your requirement and we will help direct you to the right conversation.</p></div><div className="product-grid">{products.map(([name, desc], i) => <article className="product-card" key={name}><span className="product-number">0{i + 1}</span><div className="product-mark">{String(i + 1).padStart(2,'0')}</div><h3>{name}</h3><p>{desc}</p><button onClick={() => ask(`Tell me about ${name} and where it is commonly used according to NT Enterprises' product information.`)}>Ask NT Assist <b>↗</b></button></article>)}</div></section>
      <section id="industries" className="industries section"><div className="section-head"><div><p className="eyebrow">APPLICATION FOCUS</p><h2>Industries<br/>we serve.</h2></div><p>Industrial solutions across applications where reliability and technical understanding matter.</p></div><div className="industry-grid">{industries.map(([name, desc, tags]) => <article key={name}><h3>{name}</h3><p>{desc}</p><small>{tags}</small><button onClick={() => ask(`I work in ${name}. What NT Enterprises solutions may be relevant to my application?`)}>Ask NT Assist →</button></article>)}</div></section>
      <section className="approach section"><div className="section-head"><div><p className="eyebrow">OUR APPROACH</p><h2>Built for your<br/>application.</h2></div><p>NT Enterprises focuses on understanding customer requirements before recommending a solution.</p></div><div className="industry-grid"><article><h3>Quality</h3><p>Reliable industrial materials and solutions, sourced and supplied to specification.</p></article><article><h3>Reliability</h3><p>Focused on dependable products and consistent customer support after delivery.</p></article><article><h3>Technical Expertise</h3><p>Application-focused technical consultancy grounded in production requirements.</p></article></div></section>
      <section id="resources" className="resources section"><p className="eyebrow">KNOWLEDGE, WHEN YOU NEED IT</p><h2>Technical<br/>resources.</h2><div className="resource-list">{['Product Catalogue','Technical Information','Application Guide','Frequently Asked Questions'].map(x => <div key={x}><span>{x}</span><small>Coming soon</small></div>)}</div></section>
      <section className="assist-banner"><div><p className="eyebrow">NT ASSIST</p><h2>Start with the<br/><em>right question.</em></h2></div><div><p>Describe your application, material or machine requirement. NT Assist uses approved NT Enterprises information to help prepare the next step.</p><button className="button button-light" onClick={() => ask('I need help with an industrial requirement.')}>Open NT Assist <b>↗</b></button></div></section>
      <section className="process section"><p className="eyebrow">WORKING WITH US</p><h2>How we help.</h2><div className="steps"><article><small>01</small><h3>Understand</h3><p>Understand your requirement.</p></article><article><small>02</small><h3>Recommend</h3><p>Identify the appropriate solution.</p></article><article><small>03</small><h3>Supply</h3><p>Provide the required industrial material or product.</p></article><article><small>04</small><h3>Support</h3><p>Assist with application-specific requirements.</p></article></div></section>
      <section id="quote" className="quote section"><div><p className="eyebrow">REQUEST A QUOTE</p><h2>Let’s discuss<br/>your requirement.</h2><p>Not sure how to describe it? <button className="inline-link" onClick={() => ask('Help me structure my requirement for an NT Enterprises quotation.')}>NT Assist can help.</button></p></div><QuoteForm onAssist={() => ask('Help me structure my requirement for an NT Enterprises quotation.')} /></section>
      <section className="about"><div><p className="eyebrow">NT ENTERPRISES</p><h2>Where quality meets reliability, and innovation meets tradition.</h2></div><p>NT Enterprises supplies industrial materials, printing solutions and technical consultancy to manufacturers who depend on consistent quality. We work closely with each customer to understand their specific requirement before recommending a product, and stay involved through supply and application support.</p></section>
    </main>
    <footer id="contact"><div className="brand">NT<span>.</span> ENTERPRISES</div><div><p>B-403, Krishnadarshan Apartment,<br/>Kamathwada CIDCO, Nashik-422008,<br/>Maharashtra, India</p></div><div><a href="tel:+919998007280" onClick={() => event('contact_clicked')}>+91 9998007280</a><a href="mailto:enterprisesnt2022@gmail.com" onClick={() => event('contact_clicked')}>enterprisesnt2022@gmail.com</a><a target="_blank" rel="noreferrer" onClick={() => event('whatsapp_clicked')} href="https://wa.me/919998007280?text=Hello%20NT%20Enterprises%2C%20I%20would%20like%20to%20enquire%20about%20an%20industrial%20requirement.">WhatsApp ↗</a></div><small>GSTIN: 27DSTPS4361C1ZA</small></footer>
    <NTAssist open={assist} initialPrompt={prompt} onClose={() => setAssist(false)} />
  </>;
}
