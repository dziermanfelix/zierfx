import { Artist, Album, Track } from '@prisma/client';

export type TrackSlim = {
  id: number;
  number: number;
  name: string;
};

export type AlbumSlim = {
  id: number;
  name: string;
  releaseDate: Date;
  artworkUrl: string | null;
  tracks: TrackSlim[];
};

export type ArtistWithAlbumsAndTracks = Artist & { albums: (Album & { tracks: Track[] })[] };
