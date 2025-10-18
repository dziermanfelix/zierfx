import { Prisma } from '@prisma/client';

// Let Prisma generate the types based on actual query shapes
const artistWithAlbumsAndTracks = Prisma.validator<Prisma.ArtistDefaultArgs>()({
  include: {
    albums: {
      include: {
        tracks: true,
      },
    },
  },
});

const albumWithTracks = Prisma.validator<Prisma.AlbumDefaultArgs>()({
  include: {
    tracks: true,
  },
});

const trackWithAlbumAndArtist = Prisma.validator<Prisma.TrackDefaultArgs>()({
  include: {
    album: {
      include: {
        artist: true,
      },
    },
  },
});

// Export the auto-generated types
export type ArtistWithAlbumAndTracks = Prisma.ArtistGetPayload<typeof artistWithAlbumsAndTracks>;
export type AlbumWithTracks = Prisma.AlbumGetPayload<typeof albumWithTracks>;
export type TrackWithAlbumAndArtist = Prisma.TrackGetPayload<typeof trackWithAlbumAndArtist>;
