import { NextResponse } from 'next/server';
import {
  createSessionToken,
  setAdminSessionCookie,
  validateOauthState,
  getAllowedGithubUsername,
} from '@/lib/admin/auth';

type GithubTokenResponse = {
  access_token?: string;
  error?: string;
};

type GithubUser = {
  login: string;
};

async function exchangeCodeForToken(code: string) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing GitHub OAuth env vars');
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const payload = (await response.json()) as GithubTokenResponse;
  if (!payload.access_token) {
    throw new Error(payload.error || 'Missing access token');
  }

  return payload.access_token;
}

async function fetchGithubUser(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub user profile');
  }

  return (await response.json()) as GithubUser;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  const isValidState = await validateOauthState(state);
  if (!isValidState || !code) {
    return NextResponse.redirect(new URL('/admin/login?error=oauth_state', url.origin));
  }

  try {
    const accessToken = await exchangeCodeForToken(code);
    const user = await fetchGithubUser(accessToken);

    // Require that the authenticated GitHub user is a collaborator on the target repo.
    // This uses the server-side `GITHUB_TOKEN` and `GITHUB_REPOSITORY` env vars.
    async function isRepoCollaborator(username: string) {
      const repo = process.env.GITHUB_REPOSITORY;
      const token = process.env.GITHUB_TOKEN;
      if (!repo || !token) {
        throw new Error('Missing GITHUB_REPOSITORY or GITHUB_TOKEN for collaborator check');
      }

      const [owner, repoName] = repo.split('/');
      if (!owner || !repoName) throw new Error('Invalid GITHUB_REPOSITORY format');

      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/collaborators/${username}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
          },
        },
      );

      // GitHub returns 204 No Content for a collaborator, 404 if not a collaborator.
      return res.status === 204 || res.status === 200;
    }

    const isCollaborator = await isRepoCollaborator(user.login);
    if (!isCollaborator) {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', url.origin));
    }

    // If an explicit allowed username is configured, enforce it as an additional guard.
    const allowedUser = getAllowedGithubUsername();
    if (allowedUser && user.login.toLowerCase() !== allowedUser.toLowerCase()) {
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized', url.origin));
    }

    await setAdminSessionCookie(createSessionToken(user.login));
    return NextResponse.redirect(new URL('/admin', url.origin));
  } catch {
    return NextResponse.redirect(new URL('/admin/login?error=oauth_failed', url.origin));
  }
}
