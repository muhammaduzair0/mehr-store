import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const params: Record<string, string> = {}
    if (searchParams.get('customer')) params.customer = searchParams.get('customer')!
    if (searchParams.get('status'))   params.status   = searchParams.get('status')!
    const orders = await wc.getOrders(params)
    return NextResponse.json(orders)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const order = await wc.createOrder(body)
    return NextResponse.json(order)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}