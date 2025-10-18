'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MenuBar() {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Check authentication status
    fetch('/api/auth/check')
      .then((res) => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsAuthenticated(false);
    setOpen(false);
    router.push('/');
  };

  return (
    <div className='flex justify-end'>
      <div className='relative' ref={dropdownRef}>
        <button onClick={() => setOpen((prev) => !prev)} className='std-link border-gray-800 px-3 py-1 rounded'>
          Menu
        </button>

        {open && (
          <div className='absolute right-0 mt-2 border shadow rounded z-10 w-40 bg-white dark:bg-gray-800'>
            <Link
              href='/'
              className='std-link block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              href='/library'
              className='std-link block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={() => setOpen(false)}
            >
              Library
            </Link>
            <Link
              href='/tour'
              className='std-link block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700'
              onClick={() => setOpen(false)}
            >
              Tour
            </Link>

            {isAuthenticated && (
              <>
                <div className='border-t border-gray-200 dark:border-gray-600 my-1' />
                <Link
                  href='/upload'
                  className='std-link block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700'
                  onClick={() => setOpen(false)}
                >
                  Upload
                </Link>
                <button
                  onClick={handleLogout}
                  className='std-link block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600'
                >
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <div className='border-t border-gray-200 dark:border-gray-600 my-1' />
                <Link
                  href='/login'
                  className='std-link block px-4 py-2 text-left w-full hover:bg-gray-100 dark:hover:bg-gray-700'
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
