import { NextResponse } from 'next/server';
import { insert } from '@/lib/supabase';
import { summarizeEnquiry } from '@/lib/gemini';
import { emailConfigured, sendEnquiryEmail } from '@/lib/email';
const clean = value => typeof value==='string' ? value.trim().replace(/[<>]/g,'').slice(0,2000) : '';
export async function POST(request) {
	try {
		const raw = await request.json();
		const enquiry = Object.fromEntries(['name','company','email','phone','product','quantity','application','requirement'].map(key => [key, clean(raw[key])]));
		if (!enquiry.name || !enquiry.email || !enquiry.phone || !enquiry.product || !enquiry.application || !/^\S+@\S+\.\S+$/.test(enquiry.email)) return NextResponse.json({ error: 'Please complete the required contact and requirement fields.' }, { status: 400 });
		let summary = null;
		try { summary = await summarizeEnquiry(enquiry); } catch (error) { console.error('Enquiry summary error', error.message); }
		const reference = `NT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
		const record = { ...enquiry, ai_summary: summary, status: 'New', reference };
		await insert('enquiries', record);
		let emailed = false;
		if (emailConfigured()) {
			try { await sendEnquiryEmail(record, reference); emailed = true; } catch (error) { console.error('Optional email notification failed', error.message); }
		}
		return NextResponse.json({ reference, emailed });
	} catch (error) {
		console.error('Quote error', error.message);
		const message = error instanceof Error ? error.message : '';
		if (message.includes('PGRST205') || message.includes("Could not find the table 'public.enquiries'")) return NextResponse.json({ error: 'The enquiries database table is not ready. Run supabase/schema.sql in Supabase, then try again.' }, { status: 503 });
		return NextResponse.json({ error: 'Unable to submit the enquiry right now.' }, { status: 503 });
	}
}
