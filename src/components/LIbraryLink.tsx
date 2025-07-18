'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LibraryLink() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const filter = searchParams.get('filter') ?? 'artist';

  const backHref = `/?search=${encodeURIComponent(search)}&filter=${filter}`;

  return (
    <Link href={backHref} className='rounded hover:text-blue-300 px-1 py-1'>
      <ArrowLeft />
    </Link>
  );
}
