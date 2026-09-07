import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import NotFoundContent from '@/components/NotFoundContent';
import './globals.css';

/**
 * Global 404 — a full document (the route groups each own a root layout, so
 * there's no shared layout for a plain not-found to render in). With the
 * static export this becomes out/404.html, which GitHub Pages serves for
 * every unknown URL.
 */

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const andromeda = localFont({
  src: '../public/fonts/Andromeda-eR2n.ttf',
  variable: '--font-andromeda',
  weight: '400',
  display: 'swap',
});

const ballega = localFont({
  src: '../public/fonts/Ballega-BL9EB.otf',
  variable: '--font-ballega',
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '404 — Page not found',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${andromeda.variable} ${ballega.variable} antialiased bg-black text-white`}
      >
        <NotFoundContent />
      </body>
    </html>
  );
}
