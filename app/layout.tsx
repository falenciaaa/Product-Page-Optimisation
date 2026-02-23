import type { Metadata } from 'next';
import './globals.css';
import PerformanceMonitor from '../components/PerformanceMonitor';

export const metadata: Metadata = {
  title: 'Product Catalog',
  description: 'Browse our wide selection of quality products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <PerformanceMonitor />
      </body>
    </html>
  );
}