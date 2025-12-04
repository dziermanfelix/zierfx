import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import PlayerLayout from '@/components/PlayerLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Zierman Felix - Music',
    template: '%s | Zierman Felix',
  },
  description:
    'Official website of Zierman Felix, featuring original music, live shows, and latest releases. Discover the music of Dustyn Zierman-Felix on Yeebob Records.',
  keywords: [
    'Zierman Felix',
    'Zierfx',
    'Dustyn Zierman-Felix',
    'Yeebob Records',
    'music',
    'live shows',
    'concerts',
    'original music',
  ],
  authors: [{ name: 'Zierman Felix' }],
  creator: 'Zierman Felix',
  publisher: 'Yeebob Records',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ziermanfelix.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ziermanfelix.com',
    siteName: 'Zierman Felix',
    title: 'Zierman Felix - Music',
    description:
      'Official website of Zierman Felix, featuring original music, live shows, and latest releases. Discover the music of Dustyn Zierman-Felix on Yeebob Records.',
    images: [
      {
        url: '/Logo_BlackTransparent.png',
        width: 1200,
        height: 630,
        alt: 'Zierman Felix - Yeebob Records',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zierman Felix - Music & Live Shows | Yeebob Records',
    description: 'Official website of Zierman Felix, featuring original music, live shows, and latest releases.',
    images: ['/Logo_BlackTransparent.png'],
    creator: '@ziermanfelix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PlayerLayout>{children}</PlayerLayout>
      </body>
    </html>
  );
}
