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
    default: 'Zierfx',
    template: '%s | Zierfx',
  },
  description:
    'Official website of Zierman Felix, featuring original music, live shows, and latest releases. Discover the music of Dustyn Zierman-Felix on Yeebob Records.',
  keywords: [
    'Zierfx',
    'Dustyn Zierman-Felix',
    'Yeebob Records',
    'music',
    'live shows',
    'concerts',
    'original music',
  ],
  authors: [{ name: 'Zierfx' }],
  creator: 'Zierfx',
  publisher: 'Yeebob Records',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zierfx.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zierfx.com',
    siteName: 'Zierfx',
    title: 'Zierfx',
    description:
      'Official website of Zierman Felix, featuring original music, live shows, and latest releases. Discover the music of Dustyn Zierman-Felix on Yeebob Records.',
    images: [
      {
        url: '/Logo_BlackTransparent.png',
        width: 1200,
        height: 630,
        alt: 'Zierfx - Yeebob Records',
      },
    ],
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
