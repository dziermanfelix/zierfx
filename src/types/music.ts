import { Artist, Album, Track } from '@prisma/client';

export type ArtistWithAlbumsAndTracks = Artist & { albums: (Album & { tracks: Track[] })[] };
