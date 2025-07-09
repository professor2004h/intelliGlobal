import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://intelliglobalconferences.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/debug/',
        '/test/',
        '/_next/',
        '/admin/',
        '/studio/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
