import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')?.trim()
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    // WooCommerce's coupons endpoint has no exact-code filter, so search then match exactly.
    const coupons = await wc.getCoupons({ search: code, per_page: '20' })
    const match = coupons.find((c: { code: string }) => c.code.toLowerCase() === code.toLowerCase())

    if (!match) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 })
    return NextResponse.json(match)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
