'use client';

import React, { useState } from 'react';
import { useToast } from './ToastContainer';
import { useRouter } from 'next/navigation';
import { routes } from '@/utils/routes';
import ConfirmDialog from './ConfirmDialog';

interface AlbumActionsProps {
  albumId: number;
}

const AlbumActions: React.FC<AlbumActionsProps> = ({ albumId }) => {
  const { showToast } = useToast();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleDeleteClick = () => {
    setShowDialog(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/album/${albumId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Album deleted successfully', 'success');
        setTimeout(() => {
          router.push(routes.HOME);
        }, 1500);
      } else {
        const error = await res.json();
        showToast(error.message || 'Failed to delete album.', 'error');
        setDeleting(false);
        setShowDialog(false);
      }
    } catch (error) {
      console.error('Delete error:', error);
      showToast('An error occurred while deleting the album.', 'error');
      setDeleting(false);
      setShowDialog(false);
    }
  };

  const handleCloseDialog = () => {
    if (!deleting) {
      setShowDialog(false);
    }
  };

  return (
    <>
      <div className='flex space-x-4'>
        <button
          onClick={handleDeleteClick}
          disabled={deleting}
          className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
        >
          Delete Album
        </button>
      </div>

      <ConfirmDialog
        isOpen={showDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        title='Delete Album'
        message='Are you sure you want to delete this album? This action cannot be undone and will permanently delete all tracks associated with this album.'
        confirmText='Delete Album'
        cancelText='Cancel'
        variant='danger'
        isLoading={deleting}
      />
    </>
  );
};

export default AlbumActions;
