'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Track } from '@prisma/client';

interface Props {
  track: Track;
}

export default function TrackDownloadButton({ track }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent, url?: string) => {
    e.preventDefault();

    setDownloading(true);

    if (!url) return;

    const filename = url.split('/').pop() || 'track.wav';

    const link = document.createElement('a');
    link.href = `/api/download?url=${encodeURIComponent(url)}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
  };

  return (
    <button
      disabled={downloading}
      onClick={(e) => {
        e.stopPropagation();
        handleDownload(e, track.audioUrl || undefined);
      }}
      className={`hidden ${
        downloading ? 'cursor-auto' : 'hover:text-blue-300'
      } group-hover:inline-flex items-center text-sm rounded  transition`}
    >
      {downloading ? '...' : <Download />}
    </button>
  );
}
