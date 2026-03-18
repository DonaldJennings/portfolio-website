import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen px-4 py-24 max-w-xl mx-auto text-slate-100 font-mono">
      <h1 className="text-3xl font-bold mb-6">Admin Access</h1>
      <div className="space-y-4 bg-slate-900/60 border border-slate-700 rounded-lg p-6">
        <p className="text-slate-300">Sign in with your authorized GitHub account to access the admin portal.</p>
        <a href="/api/admin/oauth/start" className="inline-block px-4 py-2 bg-green-600 rounded">
          Continue with GitHub
        </a>
        {error === 'misconfigured' && (
          <p className="text-red-400">Admin access is not configured on this server.</p>
        )}
        {error && error !== 'misconfigured' && (
          <p className="text-red-400">Login failed: {error}</p>
        )}
      </div>
    </div>
  );
}
