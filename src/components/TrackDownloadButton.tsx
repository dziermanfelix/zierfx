'use client';

import { useState } from 'react';
import { Download, Loader } from 'lucide-react';
import { Track } from '@prisma/client';

interface Props {
  track: Track;
}

export default function TrackDownloadButton({ track }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent, url?: string) => {
    e.preventDefault();
    if (!url) return;

    try {
      setDownloading(true);
      const filename = url.split('/').pop() || 'track.wav';
      const link = document.createElement('a');
      link.href = `/api/download?url=${encodeURIComponent(url)}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setTimeout(() => {
        setDownloading(false);
      }, 1000);
    }
  };

  return (
    <button
      disabled={downloading}
      onClick={(e) => {
        e.stopPropagation();
        handleDownload(e, track.audioUrl || undefined);
      }}
      className={`hidden ${
        downloading ? 'cursor-auto' : 'hover:text-gray-600'
      } group-hover:inline-flex items-center text-sm rounded  transition`}
    >
      {downloading ? <Loader className='animate-spin w-4 h-4' /> : <Download />}
    </button>
  );
}
