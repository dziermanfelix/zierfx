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
  title: 'Zierman Felix',
  description: 'Yeebob Records',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: [
      { url: '/Logo_WhiteTransparent.png?v=' + Date.now(), sizes: 'any' },
      { url: '/Logo_WhiteTransparent.png?v=' + Date.now(), sizes: '32x32', type: 'image/png' },
      { url: '/Logo_WhiteTransparent.png?v=' + Date.now(), sizes: '16x16', type: 'image/png' },
    ],
    apple: '/Logo_WhiteTransparent.png?v=' + Date.now(),
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
