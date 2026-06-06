import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});


export const metadata: Metadata = {
  title: {
    template: '%s | BlogForge AI',
    default: 'BlogForge AI',
  },
  description: 'AI-powered content ecosystem that writes, ranks, and scales your blog autonomously.',
  openGraph: {
    siteName: 'BlogForge AI',
    type: 'website',
    url: 'https://blogforge.org',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(){
              try {
                var t = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(t);
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            })();
            `,
          }}
        />
        <meta name="theme-color" content="#050507" />
        <meta name="color-scheme" content="dark" />
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BlogForge AI',
              url: 'https://blogforge.org',
              logo: 'https://blogforge.org/logo.png',
              description: 'Autonomous AI-powered content platform that writes, ranks, and scales your blog.',
              sameAs: [
                'https://twitter.com/blogforgeai',
                'https://github.com/blogforge-ai',
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: 'var(--bg-page)',
          color: 'var(--ink-primary)',
          fontFamily: 'var(--font-brand)',
        }}
        suppressHydrationWarning
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
