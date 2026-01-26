'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Music', href: '/music' },
    { name: 'Live', href: '/live' },
  ];

  return (
    <nav className='bg-gradient-to-r from-black via-gray-900 to-gray-800 shadow-lg sticky top-0 z-50 backdrop-blur-sm'>
      <div className='flex items-center h-16 max-w-7xl mr-auto pr-4 sm:pr-6 lg:pr-8'>
        {/* Logo Circle */}
        <Link
          href='/'
          className='flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white transition-all duration-200 hover:scale-110 shadow-md ml-2 mr-4 overflow-hidden'
        >
          <Image
            src='/Logo_BlackTransparent.png'
            alt='Zierfx Logo'
            width={48}
            height={48}
            className='object-contain p-1'
          />
        </Link>

        {/* Navigation Links */}
        <div className='flex items-center space-x-1 sm:space-x-2 ml-auto'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-md backdrop-blur-sm'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Social Links */}
          <div className='flex items-center gap-2 ml-2 pl-2 border-l border-white/20'>
            <a
              href='https://instagram.com/ziermanfelix'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-110'
              aria-label='Instagram'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
              </svg>
            </a>
            <a
              href='https://youtube.com/@ziermanfelix'
              target='_blank'
              rel='noopener noreferrer'
              className='p-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-all duration-200 hover:scale-110'
              aria-label='YouTube'
            >
              <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
