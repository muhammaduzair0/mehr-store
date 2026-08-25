import { NextResponse } from 'next/server'
import { wp } from '@/lib/wordpress'

export async function GET() {
  try {
    const banners = await wp.getHeroBanners()
    return NextResponse.json(banners)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
