import { NextRequest, NextResponse } from 'next/server'
import { jwtAuth } from '@/lib/auth-session'
import { wp } from '@/lib/woocommerce'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body?.name || '').trim()
    const email = (body?.email || '').trim().toLowerCase()
    const password = body?.password || ''

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const [first_name, ...rest] = name.split(' ').filter(Boolean)
    const last_name = rest.join(' ')

    const result = await jwtAuth.register({ email, password, user_login: email, first_name, last_name })
    if (!result?.success) {
      return NextResponse.json({ error: result?.data?.message || 'Could not create an account.' }, { status: 400 })
    }

    // New WP users default to "subscriber" — promote to "customer" so this
    // account is actually visible to wc.getCustomers() (order name lookup,
    // /api/auth/profile) instead of silently failing later. Non-fatal: the
    // account was already created, so a promotion hiccup shouldn't fail signup.
    try {
      const user = await wp.findUserByEmail(email)
      if (user) await wp.setUserRole(user.id, 'customer')
    } catch (err) {
      console.error('Could not promote new user to customer role:', err)
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    const msg = error?.response?.data?.data?.message || error?.response?.data?.message || error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
