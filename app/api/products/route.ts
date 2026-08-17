import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const params: Record<string, string> = {}

    if (searchParams.get('category')) params.category = searchParams.get('category')!
    if (searchParams.get('search'))   params.search   = searchParams.get('search')!
    if (searchParams.get('per_page')) params.per_page = searchParams.get('per_page')!
    if (searchParams.get('page'))     params.page     = searchParams.get('page')!
    if (searchParams.get('featured')) params.featured = searchParams.get('featured')!

    const products = await wc.getProducts(params)
    return NextResponse.json(products)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const product = await wc.createProduct(body)
    return NextResponse.json(product)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}