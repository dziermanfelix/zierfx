'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/utils/routes';
import { ToastProvider, useToast } from '@/components/ToastContainer';

interface DashboardStats {
  totalAlbums: number;
  totalTracks: number;
  totalArtists: number;
  recentAlbums: Array<{
    id: number;
    name: string;
    artist: { name: string; slug: string };
    releaseDate: string;
    trackCount: number;
    adminOnly: boolean;
  }>;
}

interface Artist {
  id: number;
  name: string;
  slug: string;
  albumCount: number;
  trackCount: number;
}

function AdminDashboardContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(routes.HOME);
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  const handleDeleteArtist = (artist: Artist) => {
    setArtistToDelete(artist);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteArtist = async () => {
    if (!artistToDelete) return;

    try {
      const response = await fetch('/api/admin/artists', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ artistId: artistToDelete.id }),
      });

      if (response.ok) {
        const result = await response.json();
        showToast(result.message, 'success');

        // Refresh data
        await loadDashboard();
      } else {
        const error = await response.json();
        console.error('Delete artist error:', error);
        showToast(error.error || 'Failed to delete artist', 'error');
      }
    } catch (error) {
      console.error('Delete artist error:', error);
      showToast('Error deleting artist', 'error');
    } finally {
      setShowDeleteConfirm(false);
      setArtistToDelete(null);
    }
  };

  const cancelDeleteArtist = () => {
    setShowDeleteConfirm(false);
    setArtistToDelete(null);
  };

  const loadDashboard = async () => {
    try {
      // Check if user is authenticated
      const authResponse = await fetch('/api/auth/check');
      if (!authResponse.ok) {
        router.push('/login');
        return;
      }

      const authData = await authResponse.json();
      setUser(authData.user);

      // Load dashboard stats
      const statsResponse = await fetch('/api/admin/dashboard');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load artists
      const artistsResponse = await fetch('/api/admin/artists');
      if (artistsResponse.ok) {
        const artistsData = await artistsResponse.json();
        setArtists(artistsData);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [router, showToast]);

  if (loading) {
    return (
      <div className='p-8 min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-pulse text-gray-600 text-lg'>Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='p-8 min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-500'>Access denied. Please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='p-8 min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Admin Dashboard</h1>
              <p className='text-gray-600 mt-2'>Welcome back, {user.username}</p>
            </div>
            <div className='flex gap-4'>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Albums</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.totalAlbums}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h6'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Tracks</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.totalTracks}</p>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Artists</p>
                  <p className='text-2xl font-bold text-gray-900'>{stats.totalArtists}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <a
              href='/admin/upload'
              className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='p-2 bg-blue-100 rounded-lg mr-4'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>Upload New Album</h3>
                <p className='text-sm text-gray-600'>Add a new album with tracks</p>
              </div>
            </a>

            <a
              href='/music'
              className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='p-2 bg-green-100 rounded-lg mr-4'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>Browse Library</h3>
                <p className='text-sm text-gray-600'>View and manage existing albums</p>
              </div>
            </a>

            <a
              href='/admin/shows'
              className='flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='p-2 bg-purple-100 rounded-lg mr-4'>
                <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <div>
                <h3 className='font-medium text-gray-900'>Manage Shows</h3>
                <p className='text-sm text-gray-600'>Add and manage live performance dates</p>
              </div>
            </a>
          </div>
        </div>

        {/* Recent Albums */}
        {stats && stats.recentAlbums.length > 0 && (
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Recent Albums</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Album
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Artist
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Release Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tracks
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {stats.recentAlbums.map((album) => (
                    <tr key={album.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        <div className='flex items-center gap-2'>
                          {album.name}
                          {album.adminOnly && (
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800'>
                              Admin Only
                            </span>
                          )}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{album.artist.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(album.releaseDate).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{album.trackCount}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <a
                          href={`/albums/${album.artist.slug}/${album.name.toLowerCase().replace(/\s+/g, '-')}/edit`}
                          className='text-blue-600 hover:text-blue-900 font-medium'
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Artist Management */}
        {artists.length > 0 && (
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-4'>Artist Management</h2>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Artist
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Albums
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Tracks
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {artists.map((artist) => (
                    <tr key={artist.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{artist.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{artist.albumCount}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{artist.trackCount}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        <button
                          onClick={() => handleDeleteArtist(artist)}
                          className='text-red-600 hover:text-red-900 font-medium'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && artistToDelete && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Delete Artist</h3>
              <p className='text-gray-600 mb-6'>
                Are you sure you want to delete <strong>{artistToDelete.name}</strong>? This will permanently delete:
              </p>
              <ul className='text-sm text-gray-600 mb-6 ml-4'>
                <li>• {artistToDelete.albumCount} album(s)</li>
                <li>• {artistToDelete.trackCount} track(s)</li>
                <li>• All associated files and artwork</li>
              </ul>
              <p className='text-red-600 text-sm mb-6'>
                <strong>This action cannot be undone.</strong>
              </p>
              <div className='flex gap-3 justify-end'>
                <button
                  onClick={cancelDeleteArtist}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteArtist}
                  className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
                >
                  Delete Artist
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  );
}
