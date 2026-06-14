export async function sendNegotiationEmail({
  to,
  customerName,
  productName,
  quantityKg,
  status,
  finalAgreedPriceUSD,
  adminReply
}) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Farm Origin <onboarding@resend.dev>'

  if (!apiKey) {
    return {
      sent: false,
      reason: 'RESEND_API_KEY is not configured.'
    }
  }

  if (!to || !adminReply) {
    return {
      sent: false,
      reason: 'Customer email or admin response is missing.'
    }
  }

  const statusText = String(status || 'pending').replaceAll('_', ' ')

  const subject = `Farm Origin bulk price request update - ${productName}`

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;color:#12372a;padding:24px;border:1px solid #dfeee5;border-radius:16px;">
      <h2 style="margin:0 0 12px;color:#0f3d2e;">Farm Origin Bulk Price Request Update</h2>
      <p style="font-size:15px;line-height:1.6;">Hello ${customerName || 'Customer'},</p>
      <p style="font-size:15px;line-height:1.6;">The store owner has reviewed your bulk price request.</p>

      <div style="background:#f0fbf4;border-radius:14px;padding:16px;margin:18px 0;">
        <p style="margin:6px 0;"><strong>Product:</strong> ${productName || '-'}</p>
        <p style="margin:6px 0;"><strong>Quantity:</strong> ${quantityKg || '-'} kg</p>
        <p style="margin:6px 0;"><strong>Status:</strong> ${statusText}</p>
        ${
          finalAgreedPriceUSD !== null && finalAgreedPriceUSD !== undefined && finalAgreedPriceUSD !== ''
            ? `<p style="margin:6px 0;"><strong>Store owner price:</strong> $${Number(finalAgreedPriceUSD).toFixed(2)}</p>`
            : ''
        }
      </div>

      <div style="background:#fff8e6;border-radius:14px;padding:16px;margin:18px 0;">
        <p style="margin:0 0 8px;"><strong>Message from store owner:</strong></p>
        <p style="font-size:15px;line-height:1.6;margin:0;">${adminReply}</p>
      </div>

      <p style="font-size:14px;line-height:1.6;color:#496b5c;">
        Please reply to this email or contact Farm Origin directly to continue the order discussion.
      </p>

      <p style="font-size:14px;line-height:1.6;color:#496b5c;margin-top:24px;">
        Thank you,<br/>
        Farm Origin Team
      </p>
    </div>
  `

  const text = `
Farm Origin Bulk Price Request Update

Hello ${customerName || 'Customer'},

The store owner has reviewed your bulk price request.

Product: ${productName || '-'}
Quantity: ${quantityKg || '-'} kg
Status: ${statusText}
${finalAgreedPriceUSD !== null && finalAgreedPriceUSD !== undefined && finalAgreedPriceUSD !== '' ? `Store owner price: $${Number(finalAgreedPriceUSD).toFixed(2)}` : ''}

Message from store owner:
${adminReply}

Please reply to this email or contact Farm Origin directly to continue the order discussion.

Thank you,
Farm Origin Team
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      subject,
      html,
      text
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    return {
      sent: false,
      reason: data?.message || data?.error || 'Email provider rejected the email.'
    }
  }

  return {
    sent: true,
    id: data?.id || null
  }
}
