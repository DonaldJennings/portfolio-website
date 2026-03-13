import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'admin_session';
const OAUTH_STATE_COOKIE = 'admin_oauth_state';

function secret() {
  return process.env.ADMIN_SECRET || 'dev-admin-secret-change-me';
}

export function getAllowedGithubUsername() {
  return process.env.ADMIN_GITHUB_USERNAME || '';
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

export function createSessionToken(githubLogin: string) {
  const payload = `${githubLogin}:${Date.now()}`;
  return `${payload}:${sign(payload)}`;
}

export function verifySessionToken(token: string) {
  try {
    // token format: <githubLogin>:<timestamp>:<signature>
    const lastColon = token.lastIndexOf(':');
    if (lastColon === -1) return false;

    const payload = token.slice(0, lastColon);
    const signature = token.slice(lastColon + 1);

    const expected = sign(payload);

    const sigBuf = Buffer.from(signature, 'utf8');
    const expBuf = Buffer.from(expected, 'utf8');

    // Prevent timing attacks when comparing signatures
    if (sigBuf.length !== expBuf.length) return false;
    if (!crypto.timingSafeEqual(sigBuf, expBuf)) return false;

    // Validate payload timestamp and username
    const parts = payload.split(':');
    if (parts.length < 2) return false;
    const githubLogin = parts[0];
    const ts = Number(parts[1]);
    if (!Number.isFinite(ts)) return false;

    const maxAgeSeconds = 60 * 60 * 12; // match cookie maxAge
    const ageMs = Date.now() - ts;
    if (ageMs < 0 || ageMs > maxAgeSeconds * 1000) return false;

    const allowed = getAllowedGithubUsername();
    if (allowed && githubLogin.toLowerCase() !== allowed.toLowerCase()) return false;

    return true;
  } catch {
    return false;
  }
}

export function createOauthState() {
  return crypto.randomBytes(24).toString('hex');
}

export async function setOauthStateCookie(state: string) {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10,
  });
}

export async function validateOauthState(state?: string | null) {
  const cookieStore = await cookies();
  const expected = cookieStore.get(OAUTH_STATE_COOKIE)?.value;
  cookieStore.set(OAUTH_STATE_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });

  return Boolean(state && expected && state === expected);
}

export async function setAdminSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export { SESSION_COOKIE };
