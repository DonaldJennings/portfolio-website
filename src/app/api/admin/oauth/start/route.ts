import { NextResponse } from 'next/server';
import { createOauthState, setOauthStateCookie } from '@/lib/admin/auth';

export async function GET(request: Request) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'Missing GITHUB_OAUTH_CLIENT_ID' }, { status: 500 });
  }

  const state = createOauthState();
  await setOauthStateCookie(state);

  // Pin the redirect_uri explicitly so GitHub always sends the callback to
  // the expected endpoint, regardless of how many URLs are registered on the
  // OAuth App. Prefer the explicit NEXT_PUBLIC_BASE_URL env var if set;
  // otherwise derive from the current request origin.
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
  const redirectUri = `${origin}/api/admin/oauth/callback`;

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('scope', 'read:user user:email');
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);

  return NextResponse.redirect(authorizeUrl);
}
