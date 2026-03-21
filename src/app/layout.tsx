import ScrollProgressBar from '@/components/atoms/ScrollProgressBar';
import type { Metadata } from 'next';
import './globals.css';

import NavBar from '@/components/organisms/NavBar';
import { ThemeProvider } from '@/components/context/ThemeContext';
import '../styles/mdx.css';

import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

import ActiveBackdrop from '@/components/organisms/ActiveBackdrop';
import RadialGradientOverlay from '@/components/atoms/RadialGradientOverlay';
import { Analytics } from '@vercel/analytics/next';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
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

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <html lang="en" data-color-scheme="cobalt" data-mode="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased site-bg relative`}>
        <ThemeProvider>
          <ScrollProgressBar />
          <RadialGradientOverlay />
          <ActiveBackdrop />
          {/* Main Content */}
          <div className="relative z-20">
            <NavBar />
            {children}
            <Analytics />
          </div>
        </ThemeProvider>
        {/* Parallel route modal slot — renders project overlay when intercepted */}
        {modal}
      </body>
    </html>
  );
}
