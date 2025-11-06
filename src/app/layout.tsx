import type { Metadata, Viewport } from 'next';
import { DM_Sans, Poppins } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ProtecaoRota } from '@/components/ProtecaoRota';
import ToastContainer from '@/components/ToastContainer';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sec Course',
  description: 'Sistema de gestão de cursos para administradors e usuários',
  keywords: 'course, curso, gestão, videos',
  authors: [{ name: 'Renato Saldanha' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Course',
  },
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
    <html lang="en">
      <body className={`${dmSans.variable} ${poppins.variable} `}>
        <ProtecaoRota>
          <div
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/background.jpg)' }}
          >
            {children}
          </div>
          <ToastContainer />
        </ProtecaoRota>
      </body>
    </html>
  );
}
