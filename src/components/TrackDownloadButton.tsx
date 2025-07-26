'use client';

import { Download } from 'lucide-react';
import { Track } from '@prisma/client';

interface Props {
  track: Track;
}

export default function TrackDownloadButton({ track }: Props) {
  const handleDownload = async (e: React.MouseEvent, url?: string) => {
    e.preventDefault();
    if (!url) return;

    const filename = url.split('/').pop() || 'track.wav';

    const link = document.createElement('a');
    link.href = `/api/download?url=${encodeURIComponent(url)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDownload(e, track.audioUrl || undefined);
      }}
      className='hidden group-hover:inline-flex items-center text-sm rounded hover:text-blue-300 transition'
    >
      <Download />
    </button>
  );
}
