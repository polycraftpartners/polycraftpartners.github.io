// Vercel serverless function - POST /api/notify-admin
// Notifies PolyCraft of every new submission immediately, including
// full scoring detail and the open response, so hot prospects can be
// followed up within 24 hours.

interface SubmissionNotification {
  name: string
  company: string
  email: string
  country: string
  industry: string
  growth_objective: string
  source: string
  open_response: string
  growth_score: number
  classification: string
  prospect_tag: string
  score_opportunity: number
  score_consistency: number
  score_independence: number
  score_visibility: number
  score_readiness: number
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let payload: SubmissionNotification
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL

  if (!apiKey || !fromEmail || !adminEmail) {
    // eslint-disable-next-line no-console
    console.error('Resend or admin notification env vars not configured')
    return new Response('Email service not configured', { status: 500 })
  }

  const {
    name,
    company,
    email,
    country,
    industry,
    growth_objective,
    source,
    open_response,
    growth_score,
    classification,
    prospect_tag,
    score_opportunity,
    score_consistency,
    score_independence,
    score_visibility,
    score_readiness
  } = payload

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #080E14; color: #F5F7FA; padding: 32px 24px;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 20px; font-weight: 700; color: #F4A623; margin-bottom: 16px;">
          New submission &mdash; ${prospect_tag}
        </h1>
        <table style="width: 100%; font-size: 14px; color: #9AA7B8; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Name</td><td style="padding: 4px 0; color: #F5F7FA;">${name}</td></tr>
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Company</td><td style="padding: 4px 0; color: #F5F7FA;">${company}</td></tr>
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Email</td><td style="padding: 4px 0; color: #F5F7FA;">${email}</td></tr>
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Country</td><td style="padding: 4px 0; color: #F5F7FA;">${country}</td></tr>
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Industry</td><td style="padding: 4px 0; color: #F5F7FA;">${industry}</td></tr>
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Growth objective</td><td style="padding: 4px 0; color: #F5F7FA;">${growth_objective}</td></tr>
          <tr><td style="padding: 4px 0; color: #5C6B7D;">Source</td><td style="padding: 4px 0; color: #F5F7FA;">${source}</td></tr>
        </table>

        <h2 style="font-size: 16px; font-weight: 700; color: #F5F7FA; margin-top: 24px;">
          Score: ${growth_score}/100 &mdash; ${classification}
        </h2>
        <table style="width: 100%; font-size: 13px; color: #9AA7B8; border-collapse: collapse; margin-top: 8px;">
          <tr><td style="padding: 3px 0;">Opportunity Generation</td><td style="padding: 3px 0; color: #F5F7FA;">${score_opportunity}/12</td></tr>
          <tr><td style="padding: 3px 0;">Sales Consistency</td><td style="padding: 3px 0; color: #F5F7FA;">${score_consistency}/12</td></tr>
          <tr><td style="padding: 3px 0;">Commercial Independence</td><td style="padding: 3px 0; color: #F5F7FA;">${score_independence}/12</td></tr>
          <tr><td style="padding: 3px 0;">Revenue Visibility</td><td style="padding: 3px 0; color: #F5F7FA;">${score_visibility}/12</td></tr>
          <tr><td style="padding: 3px 0;">Growth Readiness</td><td style="padding: 3px 0; color: #F5F7FA;">${score_readiness}/12</td></tr>
        </table>

        ${
          open_response
            ? `<h2 style="font-size: 16px; font-weight: 700; color: #F5F7FA; margin-top: 24px;">Open response</h2>
               <p style="font-size: 14px; line-height: 1.6; color: #9AA7B8; font-style: italic;">"${open_response}"</p>`
            : ''
        }
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: adminEmail,
      subject: `New Assessment Submission - ${name}, ${company} - ${classification} - ${prospect_tag}`,
      html
    })
  })

  if (!res.ok) {
    const errorText = await res.text()
    // eslint-disable-next-line no-console
    console.error('Resend admin notification email failed', errorText)
    return new Response('Failed to send email', { status: 502 })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
