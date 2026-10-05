import type { Metadata, Viewport } from 'next';
import { Ubuntu } from 'next/font/google';
import './globals.css';
import { ProductProvider } from '../context/ProductContext';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu',
  weight: ['300', '400', '500', '700'],
});

export const viewport: Viewport = {
  themeColor: '#282828',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Davis Furniture | Wholesale Base, Headboard & Mattress Specialists',
    template: '%s | Davis Furniture Wholesale'
  },
  description: 'Wholesale Base, Headboard & Mattress Specialists rooted in Northern Ireland. Over two decades of craftsmanship, custom sizes, and trade supply.',
  keywords: ['Davis Furniture', 'Wholesale beds', 'Headboard specialists', 'Ottoman storage bed', 'Northern Ireland furniture', 'Contract beds wholesale'],
  authors: [{ name: 'Davis Furniture Wholesale' }],
  metadataBase: new URL('https://davisfurniturewholesale.com'),
  openGraph: {
    title: 'Davis Furniture | Wholesale Base, Headboard & Mattress Specialists',
    description: 'Wholesale Base, Headboard & Mattress Specialists rooted in Northern Ireland. Premium craftsmanship and tailored trade supply.',
    url: 'https://davisfurniturewholesale.com',
    siteName: 'Davis Furniture Wholesale',
    images: [
      {
        url: '/images/slider-mars-dt.webp',
        width: 1600,
        height: 678,
        alt: 'Davis Furniture Wholesale',
      }
    ],
    locale: 'en_GB',
    type: 'website',
  },
  icons: {
    icon: '/images/davis-logo.webp',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={ubuntu.variable}>
      <body className={`${ubuntu.className} min-h-screen flex flex-col bg-white text-neutral-900`}>
        <ProductProvider>
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}

