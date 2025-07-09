import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "./components/HeaderWrapper";
import { getSiteSettingsSSR, getSiteSettingsFresh, getImageUrl } from './getSiteSettings';
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// Import client-side components
import {
  AutoRefresh,
  FaviconManager,
  CacheBuster,
  ClientErrorBoundary,
  PerformanceMonitor,
  ConnectionStatus,
  PerformanceInit
} from "./components/ClientComponents";
import { NavigationLoadingProvider } from "./components/NavigationLoadingProvider";
import { testSanityConnectionWithRetry } from './sanity/client';

// Optimized font loading with display swap for better performance
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = process.env.NODE_ENV === 'development'
    ? await getSiteSettingsFresh()
    : await getSiteSettingsSSR();

  const siteName = "Intelli Global Conferences";
  const siteDescription = siteSettings?.siteDescription ||
    "Join leading experts, researchers, and professionals at Intelli Global Conferences. Discover cutting-edge research, network with peers, and advance your career through our international conferences and events.";

  const metaTitle = siteSettings?.seo?.metaTitle ||
    `${siteName} - Leading Academic & Medical Conferences`;

  const metaDescription = siteSettings?.seo?.metaDescription || siteDescription;

  const keywords = siteSettings?.seo?.keywords?.join(', ') ||
    "conferences, medical conferences, academic conferences, research, networking, professional development";

  // Favicon will be handled by FaviconManager component for better cache control

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: keywords,
    authors: [{ name: 'Intelli Global Conferences' }],
    creator: 'Intelli Global Conferences',
    publisher: 'Intelli Global Conferences',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    // Remove icons from metadata - handled by FaviconManager component
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: siteName,
      type: 'website',
      locale: 'en_US',
      url: 'https://intelliglobalconferences.com',
      images: siteSettings?.logo ? [
        {
          url: getImageUrl(siteSettings.logo) || '',
          width: 1200,
          height: 630,
          alt: siteSettings.logo.alt || siteName,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      creator: '@intelliglobal',
      images: siteSettings?.logo ? [getImageUrl(siteSettings.logo) || ''] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Add your actual verification code
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Test Sanity connection in development
  let isConnected = true;
  let siteSettings = null;

  try {
    if (process.env.NODE_ENV === 'development') {
      isConnected = await testSanityConnectionWithRetry(3);
      if (!isConnected) {
        console.error('⚠️ Sanity connection failed after retries. Please check your configuration.');
        console.error('🔧 Make sure Sanity Studio is running on port 3334');
      } else {
        console.warn('✅ Sanity connection successful');
      }
    }

    // Get site settings for favicon management with error handling
    siteSettings = process.env.NODE_ENV === 'development'
      ? await getSiteSettingsFresh()
      : await getSiteSettingsSSR();
  } catch (error) {
    console.error('Error in layout initialization:', error);
    // Continue with null siteSettings to allow fallback rendering
  }

  const faviconUrl = siteSettings?.favicon ? getImageUrl(siteSettings.favicon) : null;

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} font-sans antialiased h-full bg-white`}>
        <div className="flex flex-col min-h-screen">
          <ErrorBoundary>
            <ClientErrorBoundary>
              <NavigationLoadingProvider
                threshold={300}
                timeout={10000}
                enableProgressBar={true}
                enableOverlay={true}
              >
                <PerformanceInit />
                <PerformanceMonitor enabled={process.env.NODE_ENV === 'development'} />
                <CacheBuster />
                <FaviconManager faviconUrl={faviconUrl} />
                <AutoRefresh interval={30000} enabled={process.env.NODE_ENV === 'development'} />
                <ConnectionStatus />

                {/* Header */}
                <HeaderWrapper />

                {/* Main Content */}
                <main className="flex-1 relative">
                  {children}
                </main>

                {/* Footer */}
                <Footer />
              </NavigationLoadingProvider>
            </ClientErrorBoundary>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
