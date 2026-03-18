# Admin Portal — Security Review

**Date:** 2026-03-18
**Scope:** GitHub OAuth login flow, session management, admin API endpoints
**Goal:** Ensure only the owner's GitHub account can authenticate and make changes

---

## Overall Posture

The implementation uses GitHub OAuth with a layered defence: CSRF state validation → GitHub collaborator check → optional username whitelist → HMAC-SHA256 signed session cookie. The bones are solid, but several gaps could undermine that defence in practice.

---

## Findings

### 🔴 CRITICAL — Hardcoded fallback secret

**File:** `src/lib/admin/auth.ts:8`

```ts
function secret() {
  return process.env.ADMIN_SECRET || 'dev-admin-secret-change-me';
}
```

If `ADMIN_SECRET` is not set in a production environment, the HMAC key for all session tokens falls back to `'dev-admin-secret-change-me'` — a string that is **publicly visible in this repository**. Anyone who reads the source code and knows the session token format (`githubLogin:timestamp:hmac`) can compute a valid HMAC and forge a session cookie without going through OAuth at all.

**Fix:** Throw hard at startup if the secret is missing in production. Never silently fall back to a known value.

```ts
function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_SECRET env var must be set in production');
    }
    return 'dev-only-secret'; // never reaches prod
  }
  return s;
}
```

---

### 🟠 HIGH — No central middleware enforcement; auth checked per-page

**File:** No `src/middleware.ts` exists

Auth is enforced by calling `isAdminAuthenticated()` inside each individual server component. Every `/admin/*` page currently does this correctly, but this is a "remember to do it" pattern. A new admin page or API route added in future that omits the check would be fully public.

**Fix:** Add a `middleware.ts` at the project root that protects the entire `/admin` and `/api/admin` namespace centrally.

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/admin/login', '/api/admin/oauth/start', '/api/admin/oauth/callback', '/api/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  const session = request.cookies.get('admin_session');
  if (!session?.value) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
```

Note: full token verification (HMAC + expiry) cannot run in Edge middleware because it requires Node.js `crypto`. The middleware acts as a fast pre-filter; the full `verifySessionToken` check in each page/API route remains the authoritative gate.

---

### 🟠 HIGH — `ADMIN_GITHUB_USERNAME` whitelist is optional; system falls back to collaborator-only

**File:** `src/app/api/admin/oauth/callback/route.ts:114–118`, `src/lib/admin/auth.ts:11–13`

The collaborator check is the primary auth gate. The username whitelist is described as "an additional guard" and only applies if the env var is set. If `ADMIN_GITHUB_USERNAME` is not configured, **any collaborator on the repo can log in**, including people added temporarily or by mistake.

The repo is likely public (`DonaldJennings/portfolio-website`). While you must be a collaborator to pass the check, the surface area is larger than "only me".

**Fix:** Require `ADMIN_GITHUB_USERNAME` to be set and fail closed if it is absent.

```ts
const allowedUser = getAllowedGithubUsername();
if (!allowedUser) {
  // Config error: must explicitly name the allowed user
  return NextResponse.redirect(new URL('/admin/login?error=misconfigured', url.origin));
}
if (user.login.toLowerCase() !== allowedUser.toLowerCase()) {
  return NextResponse.redirect(new URL('/admin/login?error=unauthorized', url.origin));
}
```

---

### 🟡 MEDIUM — No rate limiting on OAuth or API endpoints

**Files:** `src/app/api/admin/oauth/start/route.ts`, `src/app/api/admin/oauth/callback/route.ts`, all `/api/admin/*` routes

None of the admin endpoints have request rate limiting. While the OAuth callback requires a valid GitHub-issued code (limiting attack surface there), the start endpoint and the content/upload endpoints could be hammered. On Netlify, the upload endpoint makes external GitHub API calls per request, which could exhaust the GitHub API rate limit under repeated abuse.

**Fix:** Use Netlify's built-in rate limiting (configured in `netlify.toml`) or add an IP-based check using the `x-nf-client-connection-ip` header in middleware.

---

### 🟡 MEDIUM — Image upload has no file size limit

**File:** `src/app/api/admin/upload-image/route.ts`

```ts
const arrayBuffer = await file.arrayBuffer();
```

There is no check on `file.size` before reading the entire file into memory. An authenticated user could upload a multi-gigabyte file, causing a memory spike or a Netlify function timeout (10 s / 50 MB limits apply, but hitting them wastes resources).

**Fix:** Add a size guard immediately after receiving the file.

```ts
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
if (file.size > MAX_SIZE_BYTES) {
  return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 413 });
}
```

---

### 🟡 MEDIUM — `redirect_uri` not specified in OAuth authorisation request

**File:** `src/app/api/admin/oauth/start/route.ts`

```ts
const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
authorizeUrl.searchParams.set('client_id', clientId);
authorizeUrl.searchParams.set('scope', 'read:user user:email');
authorizeUrl.searchParams.set('state', state);
// no redirect_uri
```

Omitting `redirect_uri` means GitHub uses the first callback URL registered on the OAuth App. If multiple callback URLs are registered (e.g., `localhost` for dev and the production domain), GitHub can redirect to either. Explicitly pinning it prevents any ambiguity and is best practice.

**Fix:**

```ts
authorizeUrl.searchParams.set(
  'redirect_uri',
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/oauth/callback`
);
```

---

### 🟡 MEDIUM — `sameSite: 'lax'` on session cookie; `'strict'` is safer post-login

**File:** `src/lib/admin/auth.ts:93`

The session cookie uses `sameSite: 'lax'`. `lax` allows the cookie to be sent on top-level cross-site navigations (e.g., clicking a link from another site). `strict` would prevent this and eliminate any residual CSRF risk on the session cookie. The trade-off is that `strict` breaks the OAuth redirect back from GitHub, but that redirect only needs to work for the *state* cookie (not the session cookie — the session cookie is set *after* the callback has already validated the state).

**Fix:** Keep the OAuth state cookie at `'lax'` (required for the GitHub redirect), but set the session cookie to `'strict'`.

```ts
cookieStore.set(SESSION_COOKIE, token, {
  ...
  sameSite: 'strict', // session doesn't need cross-site sending
});
```

---

### 🟡 MEDIUM — Image MIME type validated by browser-reported value only

**File:** `src/app/api/admin/upload-image/route.ts:23`

```ts
if (!file.type.startsWith('image/')) {
```

`file.type` is the MIME type sent by the client; it can be trivially spoofed. A polyglot file (e.g., a file that is simultaneously valid JPEG and valid HTML/JS) could pass this check. On Netlify's CDN the file would be served with `Content-Type: image/jpeg`, so script execution is not a risk, but it's worth hardening.

**Fix:** Read the first few bytes of the buffer and check the magic bytes signature before processing.

```ts
const bytes = new Uint8Array(buffer.slice(0, 4));
const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8;
const isGif = bytes[0] === 0x47 && bytes[1] === 0x49;
const isWebp = bytes[0] === 0x52 && bytes[3] === 0x46; // RIFF...WEBP
if (!isPng && !isJpeg && !isGif && !isWebp) {
  return NextResponse.json({ error: 'Unsupported image format' }, { status: 415 });
}
```

---

### 🟢 LOW — OAuth state compared with `===` rather than timing-safe equal

**File:** `src/lib/admin/auth.ts:88`

```ts
return Boolean(state && expected && state === expected);
```

For OAuth CSRF state, the timing oracle is negligible — the state is a 48-char random hex string and the comparison is between two values that transit the network anyway. This is very low practical risk. However, applying `crypto.timingSafeEqual` for all secret comparisons is a good habit.

---

### 🟢 LOW — Session token payload is cleartext

**File:** `src/lib/admin/auth.ts:20–21`

```ts
const payload = `${githubLogin}:${Date.now()}`;
return `${payload}:${sign(payload)}`;
```

The cookie value contains the GitHub username and timestamp in plain text. This means anyone with access to server logs that record cookie values (e.g., CDN access logs) can see who is logged in and when the session was created. The HMAC prevents forgery but not observation.

This is low severity because the cookie is `httpOnly` and `secure`, preventing client-side JS access and clear-text network transit. However, encrypting the token rather than only signing it would remove this leakage.

---

### 🟢 LOW — Session revocation not possible

There is no server-side session store. A stolen session cookie remains valid until the 12-hour HMAC expiry. There is no way to invalidate a specific session (e.g., if you suspect compromise) without rotating `ADMIN_SECRET`, which would invalidate all sessions.

This is acceptable for a personal portfolio, but worth being aware of.

---

## Priority Summary

| # | Severity | Finding | Effort to fix |
|---|----------|---------|---------------|
| 1 | 🔴 Critical | Hardcoded fallback secret in public source | Low |
| 2 | 🟠 High | No central middleware; per-page auth enforcement | Medium |
| 3 | 🟠 High | `ADMIN_GITHUB_USERNAME` is optional, not required | Low |
| 4 | 🟡 Medium | No rate limiting on OAuth/API endpoints | Medium |
| 5 | 🟡 Medium | No file size limit on image upload | Low |
| 6 | 🟡 Medium | `redirect_uri` not pinned in OAuth start | Low |
| 7 | 🟡 Medium | Session cookie should use `sameSite: 'strict'` | Low |
| 8 | 🟡 Medium | Image MIME type relies on browser-reported value | Low |
| 9 | 🟢 Low | OAuth state uses `===` not timing-safe equal | Low |
| 10 | 🟢 Low | Session token payload is cleartext | Medium |
| 11 | 🟢 Low | No server-side session revocation | High |

---

## Immediate Actions (address before next deploy)

1. **Verify `ADMIN_SECRET` is set** in your Netlify environment variables — if it is not, all session tokens are forgeable right now.
2. **Set `ADMIN_GITHUB_USERNAME`** in Netlify env vars to your GitHub login — do not leave it unset.
3. **Fix the secret fallback** to throw in production rather than using the default string.
