'use client';

import { Show } from '@prisma/client';

interface ShowCardProps {
  show: Show;
}

// Build a Google Maps search URL from show details
function buildMapsUrl(show: Show): string {
  if (show.mapsUrl) {
    return show.mapsUrl;
  }

  // Build address string from components
  const parts = [show.venue];
  if (show.address) parts.push(show.address);
  parts.push(show.city);
  if (show.state) parts.push(show.state);
  if (show.zipCode) parts.push(show.zipCode);
  parts.push(show.country);

  const query = parts.join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function ShowCard({ show }: ShowCardProps) {
  const dateObj = new Date(show.date);
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  // Format time range if end time exists
  let timeDisplay = formattedTime;
  if (show.endTime) {
    const endDateObj = new Date(show.endTime);
    const formattedEndTime = endDateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    timeDisplay = `${formattedTime} - ${formattedEndTime}`;
  }

  const mapsUrl = buildMapsUrl(show);

  // Build location string
  const locationParts = [show.city];
  if (show.state) locationParts.push(show.state);
  const location = locationParts.join(', ');
  const fullLocation = `${location} • ${show.country}`;

  return (
    <div className='border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex flex-col md:flex-row gap-6'>
        {/* Date Badge */}
        <div className='flex-shrink-0'>
          <div className='bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-4 text-center min-w-[100px] shadow-lg'>
            <div className='text-sm font-medium uppercase tracking-wide'>
              {dateObj.toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className='text-4xl font-bold my-1'>{dateObj.getDate()}</div>
            <div className='text-xs opacity-90'>
              {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
          </div>
        </div>

        {/* Show Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4'>
            <div className='flex-1 min-w-0'>
              <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1'>{show.venue}</h3>
              <div className='flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-2'>
                <svg
                  className='w-5 h-5 flex-shrink-0 mt-0.5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
                <span className='font-medium'>{timeDisplay}</span>
              </div>
              {show.description && (
                <p className='text-gray-600 dark:text-gray-400 text-sm mb-3'>{show.description}</p>
              )}
            </div>

            {/* Tickets or Free Badge */}
            {show.isFree ? (
              <div className='flex-shrink-0 inline-flex items-center justify-center gap-2 bg-green-600 text-white font-bold px-6 py-3 rounded-lg shadow-md'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>No Ticket Required</span>
              </div>
            ) : (
              show.ticketUrl && (
                <a
                  href={show.ticketUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-shrink-0 inline-flex items-center justify-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-bold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg'
                >
                  <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z' />
                  </svg>
                  <span>Get Tickets</span>
                </a>
              )
            )}
          </div>

          {/* Location Section */}
          <div className='bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between gap-4'>
              <div className='flex items-center gap-3 flex-1 min-w-0'>
                <div className='flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-blue-600 dark:text-blue-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div className='flex-1 min-w-0'>
                  <h4 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5'>
                    Location
                  </h4>
                  <p className='text-gray-900 dark:text-gray-100 font-semibold'>{show.venue}</p>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>{fullLocation}</p>
                </div>
              </div>

              {/* Get Directions Button */}
              <a
                href={mapsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow'
              >
                <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='hidden sm:inline'>Directions</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

