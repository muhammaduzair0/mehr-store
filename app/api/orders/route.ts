import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'
import { sendMail } from '@/lib/mailer'
import { orderConfirmationEmail } from '@/lib/emails'
import { getSession } from '@/lib/auth-session'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Pakistani mobile numbers only — this store ships within Pakistan (see
// billing.country handling below) and the delivery rider calls this number
// directly, so it has to actually be dialable. Accepts local (03XXXXXXXXX)
// or country-code (+923XXXXXXXX / 923XXXXXXXX) format, tolerant of spaces
// and dashes a customer might type.
const PHONE_RE = /^(\+?92|0)3\d{9}$/

export async function GET(req: NextRequest) {
  try {
    // Scoped to the signed-in session's own email — not a client-supplied
    // param — so order history can no longer be read by guessing someone
    // else's email address.
    const session = await getSession(req)
    if (!session) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    const email = session.email

    // WooCommerce's own `search` is a fuzzy substring match across billing
    // fields, so it's used only to narrow the candidate set — the exact
    // match below is what actually decides what leaves this API.
    const candidates = await wc.getOrders({ search: email, per_page: '50' })
    const orders = (Array.isArray(candidates) ? candidates : []).filter(
      (o: any) => o.billing?.email?.toLowerCase() === email.toLowerCase()
    )
    return NextResponse.json(orders)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    body = await req.json()

    if (!Array.isArray(body?.line_items) || body.line_items.length === 0) {
      return NextResponse.json({ error: 'line_items is required' }, { status: 400 })
    }
    if (!body?.billing?.email || !EMAIL_RE.test(body.billing.email)) {
      return NextResponse.json({ error: 'A valid billing email is required' }, { status: 400 })
    }
    const phoneDigits = String(body?.billing?.phone || '').replace(/[\s\-()]/g, '')
    if (!PHONE_RE.test(phoneDigits)) {
      return NextResponse.json({ error: 'A valid Pakistani mobile number is required' }, { status: 400 })
    }
    body.billing.phone = phoneDigits

    const order = await wc.createOrder(body)

    // The order is already placed in WooCommerce at this point — an email
    // failure shouldn't turn a successful order into an error response.
    sendMail({
      to: order.billing.email,
      ...orderConfirmationEmail(order),
    }).catch((err) => console.error('Order confirmation email failed:', err))

    return NextResponse.json(order)
  } catch (error: any) {
    // axios's own error.message is a generic "Request failed with status
    // code 400" — the actual reason WooCommerce rejected the order (invalid
    // coupon, out-of-stock item, bad variation_id, etc.) lives in the
    // response body instead. Without reading that, an order failure was
    // completely undiagnosable after the fact — nothing here or in the
    // Coolify logs ever recorded why.
    const wcMessage = error.response?.data?.message
    console.error('Order creation failed:', {
      wcMessage,
      wcCode: error.response?.data?.code,
      status: error.response?.status,
      line_items: body?.line_items,
      coupon_lines: body?.coupon_lines,
    })
    return NextResponse.json({ error: wcMessage || error.message }, { status: 500 })
  }
}
