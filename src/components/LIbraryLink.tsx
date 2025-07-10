'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LibraryLink() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const filter = searchParams.get('filter') ?? 'artist';

  const backHref = `/?search=${encodeURIComponent(search)}&filter=${filter}`;

  return (
    <Link href={backHref} className='text-blue-600 underline'>
      Library
    </Link>
  );
}
