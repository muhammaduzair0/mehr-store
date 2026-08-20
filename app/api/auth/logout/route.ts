import { NextRequest, NextResponse } from 'next/server'
import { jwtAuth, clearSessionCookie, SESSION_COOKIE } from '@/lib/auth-session'

export async function POST(req: NextRequest) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value
  if (raw) {
    try {
      const { jwt } = JSON.parse(raw)
      if (jwt) await jwtAuth.revoke(jwt)
    } catch {}
  }
  const res = NextResponse.json({ ok: true })
  clearSessionCookie(res)
  return res
}
