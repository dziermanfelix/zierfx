'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { routes } from '@/utils/routes';
import { ToastProvider, useToast } from '@/components/ToastContainer';
import FormSection from '@/components/FormSection';
import FormInput from '@/components/FormInput';
import { Show } from '@prisma/client';

interface ShowFormData {
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  country: string;
  ticketUrl: string;
  description: string;
}

function AdminShowsContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shows, setShows] = useState<Show[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ShowFormData>({
    date: '',
    time: '20:00',
    venue: '',
    city: '',
    state: '',
    country: 'USA',
    ticketUrl: '',
    description: '',
  });

  const loadShows = async () => {
    try {
      const res = await fetch('/api/admin/shows');
      if (res.ok) {
        const data = await res.json();
        setShows(data);
      } else {
        if (res.status === 401) {
          router.push('/login');
        } else {
          showToast('Failed to load shows', 'error');
        }
      }
    } catch (error) {
      console.error('Error loading shows:', error);
      showToast('Error loading shows', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.venue || !formData.city || !formData.country) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/shows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast('Show added successfully!', 'success');
        setFormData({
          date: '',
          time: '20:00',
          venue: '',
          city: '',
          state: '',
          country: 'USA',
          ticketUrl: '',
          description: '',
        });
        setShowForm(false);
        await loadShows();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to add show', 'error');
      }
    } catch (error) {
      console.error('Error creating show:', error);
      showToast('An error occurred', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (showId: number, venue: string) => {
    if (!confirm(`Are you sure you want to delete the show at ${venue}? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/shows', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showId }),
      });

      if (res.ok) {
        showToast('Show deleted successfully', 'success');
        await loadShows();
      } else {
        const error = await res.json();
        showToast(error.error || 'Failed to delete show', 'error');
      }
    } catch (error) {
      console.error('Error deleting show:', error);
      showToast('Error deleting show', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(routes.HOME);
    } catch (error) {
      showToast('Error logging out', 'error');
    }
  };

  const formatShowDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='p-8 min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-pulse text-gray-600 text-lg'>Loading shows...</div>
        </div>
      </div>
    );
  }

  return (
    <main className='p-8 min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <FormSection>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Manage Shows</h1>
              <p className='text-sm text-gray-500 mt-1'>Add and manage live performance dates</p>
            </div>
            <div className='flex space-x-3'>
              <a href='/admin' className='text-sm text-blue-600 hover:text-blue-800 underline'>
                Admin Dashboard
              </a>
              <a href='/live' className='text-sm text-blue-600 hover:text-blue-800 underline'>
                View Public Page
              </a>
              <button onClick={handleLogout} className='text-sm text-gray-600 hover:text-gray-800 underline'>
                Logout
              </button>
            </div>
          </div>
        </FormSection>

        {/* Add New Show Button */}
        <div className='mt-6'>
          <button
            onClick={() => setShowForm(!showForm)}
            className='px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold'
          >
            {showForm ? 'Cancel' : '+ Add New Show'}
          </button>
        </div>

        {/* Add Show Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className='mt-6 space-y-6'>
            <FormSection title='Show Details'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FormInput
                  label='Date *'
                  type='date'
                  value={formData.date}
                  onChange={(val) => setFormData({ ...formData, date: val })}
                  required
                  disabled={submitting}
                />

                <FormInput
                  label='Time *'
                  type='time'
                  value={formData.time}
                  onChange={(val) => setFormData({ ...formData, time: val })}
                  required
                  disabled={submitting}
                />

                <FormInput
                  label='Venue *'
                  type='text'
                  value={formData.venue}
                  onChange={(val) => setFormData({ ...formData, venue: val })}
                  placeholder='The Fillmore'
                  required
                  disabled={submitting}
                />

                <FormInput
                  label='City *'
                  type='text'
                  value={formData.city}
                  onChange={(val) => setFormData({ ...formData, city: val })}
                  placeholder='San Francisco'
                  required
                  disabled={submitting}
                />

                <FormInput
                  label='State/Province'
                  type='text'
                  value={formData.state}
                  onChange={(val) => setFormData({ ...formData, state: val })}
                  placeholder='CA (optional)'
                  disabled={submitting}
                />

                <FormInput
                  label='Country *'
                  type='text'
                  value={formData.country}
                  onChange={(val) => setFormData({ ...formData, country: val })}
                  placeholder='USA'
                  required
                  disabled={submitting}
                />
              </div>

              <div className='mt-4'>
                <FormInput
                  label='Ticket URL'
                  type='url'
                  value={formData.ticketUrl}
                  onChange={(val) => setFormData({ ...formData, ticketUrl: val })}
                  placeholder='https://tickets.com/event/... (optional)'
                  disabled={submitting}
                />
              </div>

              <div className='mt-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Additional show details (optional)...'
                  rows={3}
                  disabled={submitting}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
                />
              </div>
            </FormSection>

            <FormSection>
              <button
                type='submit'
                disabled={submitting}
                className='w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold'
              >
                {submitting ? 'Adding Show...' : 'Add Show'}
              </button>
            </FormSection>
          </form>
        )}

        {/* Shows List */}
        <div className='mt-8'>
          <FormSection title={`All Shows (${shows.length})`}>
            {shows.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <p>No shows scheduled yet.</p>
                <p className='text-sm mt-2'>Click "Add New Show" to create one.</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date & Time
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Venue
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Location
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Ticket URL
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {shows.map((show) => (
                      <tr key={show.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {formatShowDate(show.date)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {show.venue}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {show.city}
                          {show.state && `, ${show.state}`}
                          <br />
                          <span className='text-xs'>{show.country}</span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {show.ticketUrl ? (
                            <a
                              href={show.ticketUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 hover:text-blue-800 underline'
                            >
                              View
                            </a>
                          ) : (
                            <span className='text-gray-400'>No link</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                          <button
                            onClick={() => handleDelete(show.id, show.venue)}
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
            )}
          </FormSection>
        </div>
      </div>
    </main>
  );
}

export default function AdminShowsPage() {
  return (
    <ToastProvider>
      <AdminShowsContent />
    </ToastProvider>
  );
}

