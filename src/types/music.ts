import { Artist, Album, Track } from '@prisma/client';

export type TrackUi = {
  id: number;
  number: number;
  name: string;
  audioUrl: string | null;
  length: number | null;
};

export type AlbumUi = {
  id: number;
  name: string;
  releaseDate: Date;
  artworkUrl: string | null;
  tracks: TrackUi[];
};

export type ArtistFull = Artist & { albums: (Album & { tracks: Track[] })[] };
