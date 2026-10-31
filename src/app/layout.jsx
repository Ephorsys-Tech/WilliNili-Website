import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
  title: {
    template: '%s | Willy Nilly Horticulture & Agro Tourism',
    default: 'Willy Nilly | Horticulture & Agro Tourism Destination',
  },
  description:
    'Discover Willy Nilly: tranquil Guest House stays, open-air Farm House celebrations, curated horticulture plant nursery, and upcoming luxury eco-resort.',
  keywords: [
    'Willy Nilly',
    'Agro Tourism',
    'Horticulture',
    'Guest House',
    'Farm House Events',
    'Eco Resort',
    'Plant Nursery',
    'Sarat Kumar Singh',
  ],
  authors: [{ name: 'Willy Nilly' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
      { url: 'https://res.cloudinary.com/aibkshp5/image/upload/v1793430544/logo.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico', '/logo.png'],
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
      { url: 'https://res.cloudinary.com/aibkshp5/image/upload/v1793430544/logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport = {
  themeColor: '#0e3d2b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="willy-nilly" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="antialiased min-h-screen bg-bg text-content-main flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
