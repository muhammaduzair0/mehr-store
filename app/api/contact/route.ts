import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mailer'
import { contactNotificationEmail } from '@/lib/emails'
import { CONTACT_EMAIL } from '@/lib/contact'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body?.name || '').trim()
    const email = (body?.email || '').trim()
    const message = (body?.message || '').trim()

    if (!name || !EMAIL_RE.test(email) || !message) {
      return NextResponse.json({ error: 'Please fill in your name, a valid email, and a message.' }, { status: 400 })
    }

    await sendMail({
      to: CONTACT_EMAIL,
      replyTo: email,
      ...contactNotificationEmail({ name, email, message }),
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
