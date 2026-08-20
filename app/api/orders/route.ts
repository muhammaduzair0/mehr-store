import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'
import { sendMail } from '@/lib/mailer'
import { orderConfirmationEmail } from '@/lib/emails'
import { getSession } from '@/lib/auth-session'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
  try {
    const body = await req.json()

    if (!Array.isArray(body?.line_items) || body.line_items.length === 0) {
      return NextResponse.json({ error: 'line_items is required' }, { status: 400 })
    }
    if (!body?.billing?.email || !EMAIL_RE.test(body.billing.email)) {
      return NextResponse.json({ error: 'A valid billing email is required' }, { status: 400 })
    }

    const order = await wc.createOrder(body)

    // The order is already placed in WooCommerce at this point — an email
    // failure shouldn't turn a successful order into an error response.
    sendMail({
      to: order.billing.email,
      ...orderConfirmationEmail(order),
    }).catch((err) => console.error('Order confirmation email failed:', err))

    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
