'use client';

import React from 'react';

interface AlbumActionsProps {
  albumId: number;
}

const AlbumActions: React.FC<AlbumActionsProps> = ({ albumId }) => {
  const handleDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete this album?');
    if (!confirmed) return;

    const res = await fetch(`/api/album/${albumId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      window.location.href = '/';
    } else {
      alert('Failed to delete album.');
    }
  };

  return (
    <div className='flex space-x-4 mt-4'>
      <button onClick={handleDelete} className='bg-red-600 text-white px-4 py-2 rounded'>
        Delete Album
      </button>
    </div>
  );
};

export default AlbumActions;
