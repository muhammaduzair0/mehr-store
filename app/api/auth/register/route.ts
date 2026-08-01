import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, first_name, last_name, phone } = await req.json();

    // Check if user already exists
    const { data: existing } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const { data, error } = await supabaseServer
      .from("users")
      .insert({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      user: { id: data.id, email: data.email },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 },
    );
  }
}
