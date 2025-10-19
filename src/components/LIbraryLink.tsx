'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LibraryLink() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const filter = searchParams.get('filter') ?? 'artist';

  const backHref = `/library?search=${encodeURIComponent(search)}&filter=${filter}`;

  return (
    <Link
      href={backHref}
      className='inline-flex items-center space-x-2 px-4 py-2 bg-white/60 hover:bg-white/80 backdrop-blur-sm rounded-xl border border-white/40 shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-blue-600 group'
    >
      <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200' />
      <span className='font-medium'>Back to Search</span>
    </Link>
  );
}
