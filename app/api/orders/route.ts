import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { getServerSession } from 'next-auth'

// GET user orders
export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseServer
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name,
            images
          )
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST place order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const body = await req.json()

    // Create order
    const { data: order, error: orderError } = await supabaseServer
      .from('orders')
      .insert({
        user_id:    session?.user?.id ?? null,
        status:     'pending',
        total:      body.total,
        first_name: body.first_name,
        last_name:  body.last_name,
        email:      body.email,
        phone:      body.phone,
        address:    body.address,
        city:       body.city,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const items = body.items.map((item: any) => ({
      order_id:   order.id,
      product_id: item.product_id,
      quantity:   item.quantity,
      price:      item.price,
    }))

    const { error: itemsError } = await supabaseServer
      .from('order_items')
      .insert(items)

    if (itemsError) throw itemsError

    // Clear cart if user is logged in
    if (session?.user?.id) {
      await supabaseServer
        .from('cart')
        .delete()
        .eq('user_id', session.user.id)
    }

    return NextResponse.json({ success: true, order_id: order.id })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}