import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// GET all products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    let query = supabaseServer.from("products").select(`
               *,
               categories(
               id,
               name,
               slug
               ) 
                `);

    if (category) query = query.eq("category_id", category);
    if (featured) query = query.eq("featured", true);
    if (search) query = query.ilike("name", `%${search}%`);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create new product (admin only)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabaseServer
      .from("products")
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        sale_price: body.sale_price,
        stock: body.stock,
        category_id: body.category_id,
        images: body.images,
        featured: body.featured,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
