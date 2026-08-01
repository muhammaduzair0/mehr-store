import {NextRequest, NextResponse} from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// GET single product
export async function GET (
    _: NextRequest,
    {params}: {params: {id: string}}
) {
    try {
        const { data, error } = await supabaseServer
        .from("products")
        .select(`*, categories(id, name, slug)`)
        .eq('id', params.id)
        .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}

// PUT update product (admin only)
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string }}
) {
    try {
        const body = await req.json()

        const {data, error} = await supabaseServer
            .from("products")
            .update(body)
            .eq('id', params.id)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}

// DELETE product (admin only)
export async function DELETE(
    _: NextRequest,
    { params }: { params: { id: string }}
) {
    try {
        const {error} = await supabaseServer
            .from("products")
            .delete()
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ message: true })
    } catch (error: any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}