// Vercel serverless function - POST /api/send-confirmation
// Sends the immediate confirmation email to a participant after submission.
// Uses Resend. Requires RESEND_API_KEY, RESEND_FROM_EMAIL env vars set in Vercel.

interface ConfirmationPayload {
  name: string
  company: string
  email: string
}

const TARGET_PARTICIPANTS = 50

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let payload: ConfirmationPayload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { name, email } = payload

  if (!email || !name) {
    return new Response('Missing required fields', { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    // eslint-disable-next-line no-console
    console.error('Resend env vars not configured')
    return new Response('Email service not configured', { status: 500 })
  }

  const assessmentUrl = process.env.ASSESSMENT_URL ?? 'https://founder-growth-benchmark.vercel.app'

  const firstName = name.split(' ')[0]

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; background-color: #080E14; color: #F5F7FA; padding: 40px 24px;">
      <div style="max-width: 560px; margin: 0 auto;">
        <p style="font-size: 14px; letter-spacing: 0.05em; color: #F4A623; font-weight: 700; margin-bottom: 24px;">
          POLYCRAFT CONSULTING
        </p>
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 24px; color: #F5F7FA;">
          You are in &mdash; Founder Growth Benchmark 2026
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #9AA7B8;">
          ${firstName},
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #9AA7B8;">
          Your assessment has been received.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #9AA7B8;">
          Here is what happens next.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #9AA7B8;">
          We are building a benchmark from founder-led B2B businesses across multiple industries
          and markets. Once we reach our participation threshold, every participant receives a
          personalised report showing how their commercial infrastructure compares to peers.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #F5F7FA; font-weight: 500; margin-top: 24px;">
          What you will receive:
        </p>
        <ul style="font-size: 15px; line-height: 1.8; color: #9AA7B8; padding-left: 20px;">
          <li>Your Founder Growth Score across five dimensions</li>
          <li>A comparison against participating founders of similar size and industry</li>
          <li>The aggregate findings from all submissions</li>
          <li>A plain-English read of your biggest commercial risk</li>
        </ul>
        <p style="font-size: 15px; line-height: 1.6; color: #9AA7B8;">
          We are targeting ${TARGET_PARTICIPANTS} participants. You will be among the first to
          receive the report once we get there.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #9AA7B8;">
          If you know another founder this would be useful for, share this link:
          <br />
          <a href="${assessmentUrl}" style="color: #5B8AF4;">${assessmentUrl}</a>
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #F5F7FA; margin-top: 32px;">
          Dany Kanzari<br />
          PolyCraft Consulting
        </p>
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
      to: email,
      subject: 'You are in - Founder Growth Benchmark 2026',
      html
    })
  })

  if (!res.ok) {
    const errorText = await res.text()
    // eslint-disable-next-line no-console
    console.error('Resend confirmation email failed', errorText)
    return new Response('Failed to send email', { status: 502 })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
