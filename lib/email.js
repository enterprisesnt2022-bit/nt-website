const resendUrl = 'https://api.resend.com/emails';
const recipient = process.env.NOTIFICATION_EMAIL || 'enterprisesnt2022@gmail.com';

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.startsWith('re_') && process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('your-domain.com'));
}

export async function sendEnquiryEmail(enquiry, reference) {
  if (!emailConfigured()) throw new Error('Email notifications are not configured');
  const fields = [
    ['Reference', reference], ['Name', enquiry.name], ['Company', enquiry.company],
    ['Email', enquiry.email], ['Phone', enquiry.phone], ['Product / Requirement', enquiry.product],
    ['Quantity', enquiry.quantity], ['Application / Use Case', enquiry.application],
    ['Technical Requirements', enquiry.requirement], ['AI Summary', enquiry.ai_summary]
  ];
  const rows = fields.map(([label, value]) => `<tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #ddd">${escapeHtml(value) || 'Not provided'}</td></tr>`).join('');
  const response = await fetch(resendUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [recipient],
      reply_to: enquiry.email,
      subject: `New NT Enterprises enquiry ${reference}`,
      html: `<div style="font-family:Arial,sans-serif;color:#15171b"><h2>New NT Enterprises enquiry</h2><p>Reference: <strong>${escapeHtml(reference)}</strong></p><table style="border-collapse:collapse;width:100%;max-width:680px">${rows}</table></div>`
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Email delivery failed: ${response.status}${detail ? ` - ${detail.slice(0, 300)}` : ''}`);
  }
  return response.json();
}

export async function sendChatQueryEmail(message, answer) {
  if (!emailConfigured()) throw new Error('Email notifications are not configured');
  const response = await fetch(resendUrl, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [recipient],
      subject: 'New NT Assist chat query',
      html: `<div style="font-family:Arial,sans-serif;color:#15171b"><h2>New NT Assist chat query</h2><p><strong>Visitor question</strong></p><p>${escapeHtml(message)}</p><p><strong>NT Assist response</strong></p><p>${escapeHtml(answer)}</p></div>`
    })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Chat email delivery failed: ${response.status}${detail ? ` - ${detail.slice(0, 300)}` : ''}`);
  }
  return response.json();
}