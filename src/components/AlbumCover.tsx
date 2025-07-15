'use client';

import React, { useState } from 'react';

interface AlbumCoverProps {
  src?: string | null;
  alt?: string;
  dim?: number;
}

const AlbumCover: React.FC<AlbumCoverProps> = ({ src, alt = '', dim = 300 }) => {
  const [hasError, setHasError] = useState(false);
  const commonClasses = 'aspect-square object-cover bg-gray-200';

  const artworkStyle = {
    width: `${dim}px`,
    height: `${dim}px`,
  };

  if (!src || hasError) {
    return <div className={commonClasses} style={artworkStyle} />;
  }

  if (!src || hasError) {
    return <div className={commonClasses} style={artworkStyle} />;
  }

  return <img src={src} alt={alt} onError={() => setHasError(true)} className={commonClasses} style={artworkStyle} />;
};

export default AlbumCover;
