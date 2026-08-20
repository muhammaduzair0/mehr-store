import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'
import { jwtAuth, setSessionCookie } from '@/lib/auth-session'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body?.email || '').trim().toLowerCase()
    const password = body?.password || ''
    if (!EMAIL_RE.test(email) || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    let loginResult
    try {
      loginResult = await jwtAuth.login(email, password)
    } catch (err: any) {
      const msg = err?.response?.data?.data?.message || err?.response?.data?.message
      return NextResponse.json({ error: msg || 'Invalid email or password' }, { status: 401 })
    }
    if (!loginResult?.success || !loginResult?.data?.jwt) {
      return NextResponse.json({ error: loginResult?.data?.message || 'Invalid email or password' }, { status: 401 })
    }

    // Prefer the real name on file in WooCommerce over whatever's in the JWT.
    let name = email
    try {
      const customers = await wc.getCustomers({ email, per_page: '1' })
      const c = Array.isArray(customers) ? customers[0] : null
      if (c && (c.first_name || c.last_name)) name = `${c.first_name} ${c.last_name}`.trim()
    } catch {}

    const res = NextResponse.json({ name, email })
    setSessionCookie(res, { jwt: loginResult.data.jwt, name, email })
    return res
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
