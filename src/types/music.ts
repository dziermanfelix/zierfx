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

export type ArtistWithAlbumAndTracks = Artist & { albums: (Album & { tracks: Track[] })[] };

export type AlbumWithTracks = Album & { tracks: Track[] };

export type TrackWithAlbumAndArtist = Track & {
  album: Album;
  artist: Artist;
};

export function makeTrackWithAlbumAndArtist(track: Track, album: Album, artist: Artist) {
  return {
    ...track,
    album,
    artist,
  };
}
