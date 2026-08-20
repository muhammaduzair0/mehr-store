import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

// WooCommerce review objects include reviewer_email — never forward that to
// the client, the homepage/PDP only ever render these public fields.
function publicReview(r: any) {
  return {
    id: r.id,
    reviewer: r.reviewer,
    review: r.review,
    rating: r.rating,
    date_created: r.date_created,
    product_name: r.product_name,
    status: r.status,
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('product_id')
    const perPage   = searchParams.get('per_page') || '50'

    const params: Record<string, string> = {
      status: 'approved',
      per_page: perPage,
      orderby: 'date',
      order: 'desc',
    }
    // Omitting product_id returns approved reviews site-wide — used by the
    // homepage testimonials, which otherwise has no per-product context.
    if (productId) params.product = productId

    const reviews = await wc.getProductReviews(params)
    return NextResponse.json((Array.isArray(reviews) ? reviews : []).map(publicReview))

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_id, reviewer, reviewer_email, review, rating } = body

    if (!product_id || !reviewer?.trim() || !reviewer_email?.trim() || !review?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const ratingNum = Number(rating)
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const created = await wc.createProductReview({
      product_id: Number(product_id),
      reviewer: reviewer.trim(),
      reviewer_email: reviewer_email.trim(),
      review: review.trim(),
      rating: ratingNum,
    })
    return NextResponse.json(publicReview(created))

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
