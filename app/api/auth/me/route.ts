import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-session'

export async function GET(req: NextRequest) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  return NextResponse.json({ name: session.name, email: session.email })
}
