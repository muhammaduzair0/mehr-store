import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// GET all categories
export async function GET() {
    try {
        const {data, error} = await supabaseServer
        .from('categories')
        .select('*')
        .order('name', {ascending: true})

    if (error) throw error

    return NextResponse.json(data)

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}

// POST create category (admin only)
export async function POST(req: Request){
    try {
        const body = await req.json()

        const { data, error } = await supabaseServer
        .from('categories')
        .insert({
            name: body.name,
            slug: body.slug,
            description: body.description,
            image: body.image
        })
        .select()
        .single()

        if (error) throw error

        return NextResponse.json(data)

    } catch (error: any){
        return NextResponse.json({error: error.message}, {status: 500})
    }
}