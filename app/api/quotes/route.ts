import { NextRequest, NextResponse } from 'next/server'
import {
  DEFAULT_BASE_URL,
  mapToPublicQuote,
  resolveQuotes,
  MAX_QUOTES_PER_REQUEST,
  QuoteQuery,
} from '@/app/helpers/quotes'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const cacheHeaders = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
}

const parseBoolean = (value: string | null, fallback: boolean) => {
  if (value === null) return fallback
  return value === 'true'
}

const parseNumber = (value: string | null) => {
  if (!value) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const languageParam = searchParams.get('language')
  const language = languageParam === 'en' ? 'en' : 'tr'
  const query: QuoteQuery = {
    quoteId: searchParams.get('quoteId'),
    eventId: parseNumber(searchParams.get('eventId')),
    date: searchParams.get('date'),
    random: parseBoolean(searchParams.get('random'), true),
    count: parseNumber(searchParams.get('count')) ?? undefined,
  }

  const baseUrl = searchParams.get('baseUrl') || DEFAULT_BASE_URL

  const quotes = resolveQuotes(language, query)
  const mapped = quotes.map((quote) => mapToPublicQuote(quote, language, baseUrl))

  return NextResponse.json(
    {
      quotes: mapped,
      meta: {
        language,
        returned: mapped.length,
        maxPerRequest: MAX_QUOTES_PER_REQUEST,
      },
    },
    {
      headers: {
        ...corsHeaders,
        ...cacheHeaders,
      },
    }
  )
}
