import { NextRequest, NextResponse } from 'next/server'
import { wc } from '@/lib/woocommerce'

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const product = await wc.getProduct(Number(id))
    return NextResponse.json(product)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { id } = await params
    const product = await wc.updateProduct(Number(id), body)
    return NextResponse.json(product)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const product = await wc.deleteProduct(Number(id))
    return NextResponse.json(product)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}