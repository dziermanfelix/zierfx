'use client';

import React, { useState } from 'react';

interface AlbumCoverProps {
  src?: string | null;
  alt?: string;
}

const artworkClassName = 'w-85 h-85 aspect-square object-cover p-2 bg-gray-200';

const AlbumCover: React.FC<AlbumCoverProps> = ({ src, alt = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <div className={artworkClassName} />;
  }

  return <img src={src} alt={alt} onError={() => setHasError(true)} className={artworkClassName} />;
};

export default AlbumCover;
