import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET() {
  try {
    const categories = await wc.getCategories()
    return NextResponse.json(categories)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const category = await wc.createCategory(body)
    return NextResponse.json(category)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}