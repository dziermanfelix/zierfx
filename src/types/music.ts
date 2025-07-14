import { Artist, Album, Track } from '@prisma/client';

export type TrackUi = {
  id: number;
  number: number;
  name: string;
  audioUrl: string;
  length: number;
};

export type AlbumUi = {
  id: number;
  name: string;
  releaseDate: Date;
  artworkUrl: string | null;
  tracks: TrackUi[];
};

export type ArtistFull = Artist & { albums: (Album & { tracks: Track[] })[] };
