import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://wheresalphi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Where's Alphi - Treasure Hunt Adventure",
  description: "A gamified real-world treasure hunt experience that meets teenagers where they are—digitally engaged yet craving authentic, in-person connections. Explore Alpha through an interactive adventure with friends.",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://wheresalphi.vercel.app',
    siteName: "Where's Alphi",
    title: "Where's Alphi - Treasure Hunt Adventure",
    description: "A gamified real-world treasure hunt experience. Explore Alpha through an interactive adventure combining digital technology with real-world exploration to create meaningful memories and genuine connection.",
    images: [
      {
        url: 'https://wheresalphi.vercel.app/og-whatsapp.jpg',
        width: 1200,
        height: 630,
        alt: "Where's Alphi - Find Alphi on your adventure",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Where's Alphi - Treasure Hunt Adventure",
    description: "A gamified real-world treasure hunt experience. Join the adventure to explore Alpha with friends through an interactive mobile experience.",
    images: ['https://wheresalphi.vercel.app/og-whatsapp.jpg'],
  },
  keywords: ['treasure hunt', 'Alpha', 'adventure', 'gamification', 'faith exploration', 'youth engagement', 'real-world experience'],
};

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="mobile-container mx-auto max-w-[480px] min-h-screen">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
