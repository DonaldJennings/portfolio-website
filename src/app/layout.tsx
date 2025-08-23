import ScrollProgressBar from '@/components/atoms/ScrollProgressBar';
import type { Metadata } from 'next';
import './globals.css';

import NavBar from '@/components/organisms/NavBar';
import { ThemeProvider } from '@/components/context/ThemeContext';
import '../styles/mdx.css';

import { Inter, JetBrains_Mono } from 'next/font/google';

import MatrixRainGlobal from '@/components/organisms/MatrixRainGlobal';
import RadialGradientOverlay from '@/components/atoms/RadialGradientOverlay';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Donald Jennings - Portfolio',
  description: 'Portfolio website',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased site-bg relative`}
        style={{
          background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 60%, #0a192f 100%)',
        }}
      >
        <ScrollProgressBar />
        <RadialGradientOverlay />
        <MatrixRainGlobal />
        {/* Main Content */}
        <div className="relative z-20">
          <ThemeProvider>
            <NavBar />
            {children}
            <Analytics />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
