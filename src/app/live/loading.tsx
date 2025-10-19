export default function Loading() {
  return (
    <main className='p-4 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Live Shows</h1>
          <p className='text-gray-600 dark:text-gray-400'>Catch us live at these upcoming shows</p>
        </div>

        {/* Loading State */}
        <div className='mb-8 text-center'>
          <div className='inline-flex items-center gap-2 text-gray-600'>
            <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              ></path>
            </svg>
            <span className='font-medium'>Loading live shows...</span>
          </div>
        </div>

        {/* Live Shows List Skeleton */}
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 animate-pulse'
            >
              <div className='flex flex-col sm:flex-row gap-6'>
                {/* Date Box Skeleton */}
                <div className='flex-shrink-0 bg-gray-300 dark:bg-gray-600 rounded-lg p-4 text-center w-24 h-24'></div>

                {/* Event Details Skeleton */}
                <div className='flex-1 space-y-3'>
                  <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
                  <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3'></div>
                </div>

                {/* Action Button Skeleton */}
                <div className='flex items-center'>
                  <div className='h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg'></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Videos Section */}
        <div className='mt-16 border-t border-gray-200 dark:border-gray-800 pt-12'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Video Skeleton 1 */}
            <div className='aspect-video w-full rounded-lg shadow-lg bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center'>
              <svg className='w-16 h-16 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' />
              </svg>
            </div>

            {/* Video Skeleton 2 */}
            <div className='aspect-video w-full rounded-lg shadow-lg bg-gray-300 dark:bg-gray-700 animate-pulse flex items-center justify-center'>
              <svg className='w-16 h-16 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
