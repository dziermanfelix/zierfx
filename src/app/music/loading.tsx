export default function Loading() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-8 py-8'>
        {/* Hero Header */}
        <div className='mb-12 text-center'>
          <div className='inline-block'>
            <h1 className='text-5xl sm:text-6xl font-bold text-black mb-3'>Music</h1>
            <div className='h-1 bg-gradient-to-r from-black via-gray-700 to-gray-500 rounded-full'></div>
          </div>
          <p className='mt-4 text-gray-700 text-lg font-medium'>All the ZF music in one place.</p>
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
            <span className='font-medium'>Loading your library...</span>
          </div>
        </div>

        {/* Search/Filter Skeleton */}
        <div className='mb-8 space-y-4'>
          <div className='flex flex-col sm:flex-row gap-4'>
            {/* Search Bar Skeleton */}
            <div className='flex-1 h-12 bg-white/60 rounded-xl animate-pulse'></div>
            {/* Filter Dropdown Skeleton */}
            <div className='w-full sm:w-48 h-12 bg-white/60 rounded-xl animate-pulse'></div>
          </div>
        </div>

        {/* Album Grid Skeleton */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className='block bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse'
            >
              <div className='p-4'>
                {/* Album Cover Skeleton */}
                <div className='relative overflow-hidden rounded-xl mb-4 aspect-square bg-gray-300'></div>

                {/* Album Info Skeleton */}
                <div className='space-y-2'>
                  {/* Album Title */}
                  <div className='h-5 bg-gray-300 rounded w-3/4'></div>
                  {/* Artist Name */}
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                  {/* Tags */}
                  <div className='flex items-center gap-2 pt-1'>
                    <div className='h-6 w-20 bg-gray-200 rounded-full'></div>
                    <div className='h-6 w-16 bg-gray-200 rounded-full'></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
