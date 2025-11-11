import { db } from '@/lib/prisma';
import { getAlbumFilterForUser } from '@/utils/album-filters';

export async function getAlbumAndArtistFromSlugs(artistSlug: string, albumSlug: string) {
  const albumFilter = await getAlbumFilterForUser();
  const artist = await db.artist.findFirst({ where: { slug: artistSlug } });
  const album = await db.album.findFirst({
    where: {
      slug: albumSlug,
      artistId: artist?.id,
      ...albumFilter,
    },
    include: {
      tracks: true,
    },
  });

  return { artist, album };
}
