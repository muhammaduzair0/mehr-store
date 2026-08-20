import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'
import { getSession } from '@/lib/auth-session'

export async function PUT(req: NextRequest) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

  try {
    const body = await req.json()
    const name = (body?.name || '').trim()
    const password = (body?.password || '').trim()
    if (password && password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const customers = await wc.getCustomers({ email: session.email, per_page: '1' })
    const customer = Array.isArray(customers) ? customers[0] : null
    if (!customer) return NextResponse.json({ error: 'Account not found' }, { status: 404 })

    const [first_name, ...rest] = name.split(' ').filter(Boolean)
    const last_name = rest.join(' ')

    await wc.updateCustomer(customer.id, {
      ...(name ? { first_name, last_name } : {}),
      ...(password ? { password } : {}),
    })

    return NextResponse.json({ name: name || session.name, email: session.email })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
