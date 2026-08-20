import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const params: Record<string, string> = {}

    // WooCommerce's REST API filters products by category ID, not slug —
    // resolve the slug callers pass (e.g. "for-her") to its numeric ID first.
    const categorySlug = searchParams.get('category')
    if (categorySlug) {
      if (/^\d+$/.test(categorySlug)) {
        params.category = categorySlug
      } else {
        const categories = await wc.getCategories()
        const match = categories.find((c: { slug: string; id: number }) => c.slug === categorySlug)
        if (match) params.category = String(match.id)
      }
    }
    if (searchParams.get('search'))   params.search   = searchParams.get('search')!
    if (searchParams.get('per_page')) params.per_page = searchParams.get('per_page')!
    if (searchParams.get('page'))     params.page     = searchParams.get('page')!
    if (searchParams.get('featured')) params.featured = searchParams.get('featured')!
    if (searchParams.get('orderby'))  params.orderby  = searchParams.get('orderby')!
    if (searchParams.get('order'))    params.order    = searchParams.get('order')!

    const products = await wc.getProducts(params)
    return NextResponse.json(products)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
