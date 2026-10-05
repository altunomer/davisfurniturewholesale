import type { Metadata } from 'next';
import { AdminLoginPage } from '@/components/admin/AdminLoginPage';

export const metadata: Metadata = {
  title: 'Webmaster Access | Davis Furniture',
  robots: {
    index: false,
    follow: false,
  },
};

export default function WebmasterLoginPage() {
  return <AdminLoginPage />;
}

