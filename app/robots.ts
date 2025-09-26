import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://ataturk-kronolojisi.org/sitemap.xml',
    host: 'https://ataturk-kronolojisi.org',
  }
}
