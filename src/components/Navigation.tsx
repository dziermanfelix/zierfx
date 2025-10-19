'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Library', href: '/library' },
    { name: 'Tour', href: '/tour' },
  ];

  return (
    <nav className='bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg sticky top-0 z-50 backdrop-blur-sm'>
      <div className='flex items-center h-16 max-w-7xl mr-auto pr-4 sm:pr-6 lg:pr-8'>
        {/* Logo Circle */}
        <Link
          href='/'
          className='flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white transition-all duration-200 hover:scale-110 shadow-md ml-2 mr-4 overflow-hidden'
        >
          <Image
            src='/Logo_BlackTransparent.png'
            alt='Zierman Felix Logo'
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
        </div>
      </div>
    </nav>
  );
}
