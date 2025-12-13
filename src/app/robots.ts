import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/admin', '/_next/', '/private/'],
    },
    sitemap: 'https://zierfx.com/sitemap.xml',
  };
}
