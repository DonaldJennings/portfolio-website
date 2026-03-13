import { NextResponse } from 'next/server';
import { createOauthState, setOauthStateCookie } from '@/lib/admin/auth';

export async function GET() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json({ error: 'Missing GITHUB_OAUTH_CLIENT_ID' }, { status: 500 });
  }

  const state = createOauthState();
  await setOauthStateCookie(state);

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('scope', 'read:user user:email');
  authorizeUrl.searchParams.set('state', state);

  return NextResponse.redirect(authorizeUrl);
}
