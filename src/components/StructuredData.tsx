import { Album, Artist, Track } from '@prisma/client';

interface StructuredDataProps {
  type: 'Person' | 'MusicGroup' | 'MusicAlbum' | 'MusicRecording' | 'Event';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'Person':
        return {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Zierfx',
          alternateName: 'Dustyn Zierman-Felix',
          description: 'Musician and recording artist',
          url: 'https://zierfx.com',
          jobTitle: 'Musician/Producer',
          worksFor: {
            '@type': 'Organization',
            name: 'Yeebob Records',
          },
        };

      case 'MusicGroup':
        return {
          '@context': 'https://schema.org',
          '@type': 'MusicGroup',
          name: 'Zierfx',
          description: 'Musical artist and performer',
          url: 'https://zierfx.com',
          genre: ['Alternative', 'Indie', 'Rock'],
        };

      case 'MusicAlbum':
        return {
          '@context': 'https://schema.org',
          '@type': 'MusicAlbum',
          name: data.name,
          byArtist: data.artist
            ? {
                '@type': 'Person',
                name: data.artist.name,
              }
            : {
                '@type': 'Person',
                name: 'Zierfx',
              },
          datePublished: data.releaseDate,
          description: data.artist ? `Album by ${data.artist.name}` : 'Album by Zierfx',
          url: data.artist
            ? `https://zierfx.com/albums/${data.artist.slug}/${data.slug}`
            : `https://zierfx.com/albums/zierman-felix/${data.slug}`,
          image: data.artworkUrl ? `https://zierfx.com${data.artworkUrl}` : undefined,
          numTracks: data.tracks?.length || 0,
          albumReleaseType: 'AlbumRelease',
        };

      case 'MusicRecording':
        return {
          '@context': 'https://schema.org',
          '@type': 'MusicRecording',
          name: data.name,
          byArtist: data.artist
            ? {
                '@type': 'Person',
                name: data.artist.name,
              }
            : {
                '@type': 'Person',
                name: 'Zierfx',
              },
          inAlbum: data.album
            ? {
                '@type': 'MusicAlbum',
                name: data.album.name,
              }
            : {
                '@type': 'MusicAlbum',
                name: data.name,
              },
          duration: data.length ? `PT${Math.floor(data.length / 60)}M${data.length % 60}S` : undefined,
          url:
            data.artist && data.album
              ? `https://zierfx.com/albums/${data.artist.slug}/${data.album.slug}`
              : `https://zierfx.com/music`,
          audio: data.audioUrl ? `https://zierfx.com${data.audioUrl}` : undefined,
        };

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />;
}
