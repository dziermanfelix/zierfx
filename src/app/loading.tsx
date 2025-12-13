export default function Loading() {
  return (
    <main className='min-h-screen'>
      {/* Hero Section - Static */}
      <section className='relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-24 px-4 sm:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='text-center space-y-6'>
            <h1 className='text-5xl sm:text-7xl font-bold tracking-tight'>Zierfx</h1>
            <p className='text-xl sm:text-2xl font-light text-gray-300'>Yeebob Records</p>
            <p className='text-lg sm:text-xl max-w-2xl mx-auto text-gray-200'>The music of Dustyn Zierman-Felix.</p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-6'>
              <div className='bg-white/20 px-8 py-3 rounded-full animate-pulse'></div>
              <div className='bg-white/10 px-8 py-3 rounded-full animate-pulse'></div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Releases Section */}
      <section className='py-16 px-4 sm:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-center mb-8'>
            <h2 className='text-3xl sm:text-4xl font-bold'>Recent Releases</h2>
            <div className='h-6 w-24 bg-gray-200 rounded animate-pulse'></div>
          </div>

          {/* Loading State */}
          <div className='mb-6 text-center'>
            <div className='inline-flex items-center gap-2 text-gray-600'>
              <svg className='animate-spin h-5 w-5' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                ></path>
              </svg>
              <span className='font-medium'>Loading recent releases...</span>
            </div>
          </div>

          {/* Album Grid Skeleton */}
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className='space-y-3 animate-pulse'>
                <div className='aspect-square relative overflow-hidden rounded-lg shadow-lg bg-gray-300'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                  <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className='py-16 px-4 sm:px-8 bg-gray-50 dark:bg-gray-900/50'>
        <div className='max-w-4xl mx-auto'>
          <h2 className='text-3xl sm:text-4xl font-bold text-center mb-8'>Featured Video</h2>
          <div className='aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-gray-300 animate-pulse flex items-center justify-center'>
            <svg className='w-20 h-20 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z' />
            </svg>
          </div>
        </div>
      </section>

      {/* Connect Section - Static */}
      <section className='py-16 px-4 sm:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-8'>Connect</h2>
          <div className='flex flex-wrap justify-center gap-6'>
            <div className='w-40 h-40 rounded-xl bg-gray-300 animate-pulse'></div>
            <div className='w-40 h-40 rounded-xl bg-gray-300 animate-pulse'></div>
            <div className='w-40 h-40 rounded-xl bg-gray-300 animate-pulse'></div>
          </div>
        </div>
      </section>
    </main>
  );
}
