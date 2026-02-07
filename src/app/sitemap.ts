import { MetadataRoute } from 'next';
import { db } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zierfx.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/music`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Get all non-admin-only albums with their artists (only public albums appear in sitemap)
  const albums = await db.album.findMany({
    where: {
      adminOnly: false,
    },
    include: {
      artist: true,
    },
  });

  // Generate album pages
  const albumPages = albums.map((album) => ({
    url: `${baseUrl}/albums/${album.artist.slug}/${album.slug}`,
    lastModified: album.releaseDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...albumPages];
}
