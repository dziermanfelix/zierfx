import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/upload', '/admin', '/_next/', '/private/'],
    },
    sitemap: 'https://ziermanfelix.com/sitemap.xml',
  };
}
