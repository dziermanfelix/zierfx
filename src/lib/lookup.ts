import { db } from '@/lib/prisma';
import { deslugify } from '@/utils/slugify';

export async function getAlbumAndArtistFromSlugs(artistSlug: string, albumSlug: string) {
  const artistName = deslugify(artistSlug);
  const albumName = deslugify(albumSlug);

  const artist = await db.artist.findFirst({
    where: {
      name: {
        equals: artistName,
        mode: 'insensitive',
      },
    },
  });

  if (!artist) return { artist: null, album: null };

  const album = await db.album.findFirst({
    where: {
      name: {
        equals: albumName,
        mode: 'insensitive',
      },
      artistId: artist.id,
    },
    include: {
      tracks: true,
    },
  });

  return { artist, album };
}
