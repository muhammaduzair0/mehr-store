import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await wc.getProduct(Number(id))
    return NextResponse.json(product)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
