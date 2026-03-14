import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin/auth';

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

  // Redirect to the content editor by default.
  redirect('/admin/content');
}
