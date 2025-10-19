export default function Loading() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
        {/* Back Link Skeleton */}
        <div className='mb-6'>
          <div className='h-6 w-32 bg-gray-300 rounded animate-pulse'></div>
        </div>

        {/* Album Info Skeleton */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200'>
          <div className='grid md:grid-cols-2 gap-8 p-6 sm:p-8'>
            {/* Album Cover Skeleton */}
            <div className='flex justify-center items-center'>
              <div className='w-full max-w-md aspect-square bg-gray-300 rounded-xl animate-pulse'></div>
            </div>

            {/* Album Details Skeleton */}
            <div className='flex flex-col justify-center space-y-6'>
              {/* Album Name */}
              <div className='space-y-3'>
                <div className='h-8 w-3/4 bg-gray-300 rounded animate-pulse'></div>
                <div className='h-6 w-1/2 bg-gray-200 rounded animate-pulse'></div>
              </div>

              {/* Release Date */}
              <div className='h-5 w-40 bg-gray-200 rounded animate-pulse'></div>

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <div className='h-12 w-32 bg-gray-300 rounded-lg animate-pulse'></div>
                <div className='h-12 w-32 bg-gray-300 rounded-lg animate-pulse'></div>
              </div>
            </div>
          </div>

          {/* Track List Skeleton */}
          <div className='border-t border-gray-200'>
            <div className='p-6 sm:p-8 space-y-3'>
              {/* Loading text */}
              <div className='text-center py-4'>
                <div className='inline-flex items-center gap-2 text-gray-600'>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  <span className='font-medium'>Loading album...</span>
                </div>
              </div>

              {/* Track Skeletons */}
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='flex items-center gap-4 p-3 bg-gray-50 rounded-lg animate-pulse'>
                  <div className='h-5 w-8 bg-gray-300 rounded'></div>
                  <div className='flex-1 h-5 bg-gray-300 rounded'></div>
                  <div className='h-5 w-16 bg-gray-300 rounded'></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
