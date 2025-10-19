'use client';

import { TourDate } from '@prisma/client';

interface TourDateCardProps {
  tourDate: TourDate;
}

export default function TourDateCard({ tourDate }: TourDateCardProps) {
  const dateObj = new Date(tourDate.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className='border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex-1'>
          <div className='flex items-start gap-4'>
            <div className='text-center min-w-[60px]'>
              <div className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{dateObj.getDate()}</div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
              </div>
            </div>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold mb-1 text-gray-900 dark:text-gray-100'>{tourDate.venue}</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                {tourDate.city}
                {tourDate.state && `, ${tourDate.state}`}
                {tourDate.country && ` • ${tourDate.country}`}
              </p>
              {tourDate.description && (
                <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>{tourDate.description}</p>
              )}
              <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>{formattedTime}</p>
            </div>
          </div>
        </div>
        {tourDate.ticketUrl && (
          <div className='sm:ml-4'>
            <a
              href={tourDate.ticketUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block bg-black hover:bg-gray-800 text-white font-bold px-6 py-2 rounded-lg transition-colors'
            >
              Get Tickets
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
