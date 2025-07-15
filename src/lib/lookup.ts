import { db } from '@/lib/prisma';

export async function getAlbumAndArtistFromSlugs(artistSlug: string, albumSlug: string) {
  const artist = await db.artist.findFirst({ where: { slug: artistSlug } });
  const album = await db.album.findFirst({
    where: {
      slug: albumSlug,
      artistId: artist?.id,
    },
    include: {
      tracks: true,
    },
  });

  return { artist, album };
}
