import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { AppProvider } from '@/context/AppContext';
import { seo } from '@/data/portfolio';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Site's decorative display font — applied to headings via globals.css.
const andromeda = localFont({
  src: '../../public/fonts/Andromeda-eR2n.ttf',
  variable: '--font-andromeda',
  weight: '400',
  display: 'swap',
});

// Default body face, also available via the `font-ballega` utility or the
// `.ballega-regular` class.
const ballega = localFont({
  src: '../../public/fonts/Ballega-BL9EB.otf',
  variable: '--font-ballega',
  weight: '400',
  display: 'swap',
});

// SEO copy lives in content/portfolio.yaml (seo:) — edit it there.
// metadataBase makes the relative /preview.png resolve to an absolute URL,
// which Twitter/WhatsApp require for link-preview images.
export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.author, url: seo.url }],
  creator: seo.author,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: seo.url,
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    images: [
      { url: '/preview.png', width: 1131, height: 637, alt: seo.title },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    creator: seo.twitterHandle,
    images: ['/preview.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${andromeda.variable} ${ballega.variable} antialiased bg-black text-white`}
      >
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
