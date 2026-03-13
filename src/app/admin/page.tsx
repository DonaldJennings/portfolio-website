import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import AdminPortalClient from '@/components/pages/AdminPortalClient';
import { isAdminAuthenticated } from '@/lib/admin/auth';
import { getContentStore } from '@/lib/admin/contentStore';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    notFound();
  }

  const store = getContentStore();

  if (!store) {
    redirect('/');
  }

  return <AdminPortalClient initialStore={store} />;
}
