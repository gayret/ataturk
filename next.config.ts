import type { NextConfig } from 'next'

type SecurityHeaderOptions = {
  allowEmbedding?: boolean
}

const baseSecurityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload', // force HTTPS
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff', // prevent MIME sniffing
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin', // safer referrer info
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()', // block FLoC & unneeded APIs
  },
]

const createContentSecurityPolicy = (options?: SecurityHeaderOptions) => {
  const directives = [
    "default-src 'self';",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;",
    "style-src 'self' 'unsafe-inline' https:;",
    "img-src 'self' data: https:;",
    "font-src 'self' https:;",
    "connect-src 'self' https:;",
    "frame-src 'self' https://www.linkedin.com https://www.youtube.com https://platform.twitter.com;",
  ]

  if (!options?.allowEmbedding) {
    directives.push("frame-ancestors 'self';")
  }

  return directives.join(' ').replace(/\s{2,}/g, ' ').trim()
}

const createSecurityHeaders = (options?: SecurityHeaderOptions) => {
  const headers = [...baseSecurityHeaders]

  if (!options?.allowEmbedding) {
    headers.splice(2, 0, {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN', // prevent clickjacking
    })
  }

  headers.push({
    key: 'Content-Security-Policy',
    value: createContentSecurityPolicy(options),
  })

  return headers
}

const defaultSecurityHeaders = createSecurityHeaders()
const embeddableSecurityHeaders = createSecurityHeaders({ allowEmbedding: true })

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ataturk-kronolojisi.org',
      },
    ],
  },
  poweredByHeader: false, // hide X-Powered-By
  compress: true, // gzip/brotli
  trailingSlash: false, // SEO-friendly URLs
  async headers() {
    return [
      {
        source: '/widget/:path*',
        headers: embeddableSecurityHeaders,
      },
      {
        source: '/((?!widget\\/).*)', // apply everywhere except /widget/*
        headers: defaultSecurityHeaders,
      },
      {
        source: '/data/worldBorder.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=315360000, immutable',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/',
        permanent: true, // canonical root
      },
    ]
  },
}

export default nextConfig
