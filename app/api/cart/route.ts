import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getServerSession } from 'next-auth'

// GET cart items
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseServer
      .from('cart')
      .select(`
        *,
        products (
          id,
          name,
          price,
          sale_price,
          images,
          stock
        )
      `)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json(data)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST add to cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { product_id, quantity } = await req.json()

    // Check if already in cart
    const { data: existing } = await supabaseServer
      .from('cart')
      .select('id, quantity')
      .eq('user_id', session.user.id)
      .eq('product_id', product_id)
      .single()

    if (existing) {
      // Update quantity
      const { data, error } = await supabaseServer
        .from('cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    // Add new item
    const { data, error } = await supabaseServer
      .from('cart')
      .insert({
        user_id:    session.user.id,
        product_id,
        quantity,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE remove from cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await req.json()

    const { error } = await supabaseServer
      .from('cart')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}