import React from 'react';
import type { Metadata } from 'next';
import { AdminSettingsPage } from '@/components/admin/AdminSettingsPage';

export const metadata: Metadata = {
  title: 'Mail & Store Settings | Webmaster Portal',
};

export default function SettingsManagerPage() {
  return <AdminSettingsPage />;
}

