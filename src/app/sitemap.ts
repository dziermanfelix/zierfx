import { MetadataRoute } from 'next';
import { db } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ziermanfelix.com';

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
      url: `${baseUrl}/live`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Get all albums with their artists
  const albums = await db.album.findMany({
    include: {
      artist: true,
    },
  });

  // Get all live dates
  const liveDates = await db.liveDate.findMany();

  // Generate album pages
  const albumPages = albums.map((album) => ({
    url: `${baseUrl}/albums/${album.artist.slug}/${album.slug}`,
    lastModified: album.releaseDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Generate live date pages (if you have individual pages for them)
  const liveDatePages = liveDates.map((liveDate) => ({
    url: `${baseUrl}/live/${liveDate.id}`, // Adjust this URL structure as needed
    lastModified: liveDate.updatedAt || liveDate.createdAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...albumPages, ...liveDatePages];
}
