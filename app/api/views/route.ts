import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { pageId } = await req.json()
  const res = await fetch(
    `https://visit-counter.vercel.app/counter?page=ataturk-kronolojisi.org/?id=${pageId}&format=json`
  )
  const data = await res.json()
  return NextResponse.json({ count: data })
}
