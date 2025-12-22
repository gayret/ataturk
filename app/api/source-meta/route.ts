import { NextRequest, NextResponse } from 'next/server'

const isValidHttpUrl = (raw: string | null) => {
  if (!raw) return null
  try {
    const url = new URL(raw)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url
    }
    return null
  } catch {
    return null
  }
}

const extractTitle = (html: string) => {
  const ogMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
  if (ogMatch?.[1]) return ogMatch[1].trim()

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  if (titleMatch?.[1]) return titleMatch[1].trim()

  return null
}

const extractFavicon = (html: string, base: URL) => {
  const linkMatch = html.match(
    /<link[^>]+rel=["'](?:shortcut icon|icon|alternate icon)["'][^>]+href=["']([^"']+)["']/i
  )
  if (linkMatch?.[1]) {
    try {
      return new URL(linkMatch[1], base).toString()
    } catch {
      return null
    }
  }

  try {
    return new URL('/favicon.ico', base).toString()
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const urlParam = searchParams.get('url')
  const targetUrl = isValidHttpUrl(urlParam)

  if (!targetUrl) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const res = await fetch(targetUrl.toString(), {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({ title: null, favicon: null }, { status: 200 })
    }

    const html = await res.text()
    const title = extractTitle(html)
    const favicon = extractFavicon(html, targetUrl)

    return NextResponse.json({ title, favicon }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ title: null, favicon: null }, { status: 200 })
  }
}
