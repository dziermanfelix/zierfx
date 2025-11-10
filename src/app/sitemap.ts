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

  // Get all shows
  const shows = await db.show.findMany();

  // Generate album pages
  const albumPages = albums.map((album) => ({
    url: `${baseUrl}/albums/${album.artist.slug}/${album.slug}`,
    lastModified: album.releaseDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Update the /live page's lastModified based on the most recent show
  if (shows.length > 0) {
    const livePageIndex = staticPages.findIndex((page) => page.url === `${baseUrl}/live`);
    const mostRecentShow = shows.reduce(
      (latest, show) => (show.updatedAt > latest ? show.updatedAt : latest),
      shows[0].updatedAt
    );
    if (livePageIndex !== -1) {
      staticPages[livePageIndex].lastModified = mostRecentShow;
    }
  }

  return [...staticPages, ...albumPages];
}
