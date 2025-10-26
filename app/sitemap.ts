import { MetadataRoute } from 'next'

export default  function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ataturk-kronolojisi.org'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
