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
};

export const viewport = {
  themeColor: '#0e3d2b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="willy-nilly" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-bg text-content-main flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
