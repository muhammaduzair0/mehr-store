import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const variations = await wc.getProductVariations(Number(id), { per_page: '100' })
    return NextResponse.json(variations)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
