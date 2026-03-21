# Admin Portal

The admin portal lets an authorised GitHub user edit all site content through a browser UI. In production, saves create a GitHub pull request rather than writing directly to the deployed site.

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant MW as Edge Middleware
    participant Start as /api/admin/oauth/start
    participant GH as GitHub
    participant CB as /api/admin/oauth/callback
    participant Admin as /admin/content

    User->>Browser: Navigate to /admin
    Browser->>MW: Request /admin
    MW->>MW: No admin_session cookie
    MW-->>Browser: Redirect → /admin/login

    User->>Browser: Click "Continue with GitHub"
    Browser->>Start: GET /api/admin/oauth/start
    Start->>Start: Generate random state
    Start->>Browser: Set oauth_state cookie
    Start-->>Browser: Redirect → github.com/login/oauth/authorize

    Browser->>GH: Authorize (scopes: read:user)
    GH-->>Browser: Redirect → /api/admin/oauth/callback?code=…&state=…

    Browser->>CB: GET /api/admin/oauth/callback
    CB->>CB: Validate oauth_state cookie
    CB->>GH: Exchange code → access token
    CB->>GH: GET /user (get GitHub login)
    CB->>CB: Check login === ADMIN_GITHUB_USERNAME
    alt Authorised
        CB->>CB: createSessionToken(login)
        CB->>Browser: Set admin_session cookie (httpOnly, 12h)
        CB-->>Browser: Redirect → /admin/content
        Browser->>Admin: Load admin UI
    else Unauthorised
        CB-->>Browser: 403 Forbidden
    end
```

---

## Session Tokens

Sessions are stateless — no database required. The token is an HMAC-signed string stored in an `httpOnly` cookie.

**Token format:**
```
<githubLogin>:<timestamp>:<hmac-sha256-signature>
```

**Verification:**
- Signature validated with timing-safe comparison (prevents oracle attacks)
- Timestamp checked — tokens expire after 12 hours
- `ADMIN_SECRET` env var is the HMAC key

**Key functions** (`src/lib/admin/auth.ts`):
- `createSessionToken(githubLogin)` — signs and returns token string
- `verifySessionToken(token)` — validates signature + expiry
- `isAdminAuthenticated(request)` — reads cookie and calls verify

---

## Middleware Protection

`src/middleware.ts` runs at the edge on all `/admin/*` and `/api/admin/*` requests.

```mermaid
flowchart TD
    Req[Request]
    Req --> Public{Public path?\n/admin/login\n/oauth/*}
    Public -->|Yes| Pass[Allow through]
    Public -->|No| Cookie{Valid\nadmin_session?}
    Cookie -->|Yes| Pass
    Cookie -->|No| IsAPI{/api/* ?}
    IsAPI -->|Yes| R401[Return 401 JSON]
    IsAPI -->|No| Redir[Redirect → /admin/login]
```

**Rate limiting:** `/api/admin/oauth/start` is capped at 10 requests per IP per 60 seconds using an in-memory sliding window.

---

## Admin UI Structure

The main UI lives in `AdminPortalClient` (`src/components/pages/AdminPortalClient.tsx`). It's a single client component with tab navigation.

```mermaid
graph TD
    APC[AdminPortalClient]
    APC --> T1[Content tab\nblog posts + projects]
    APC --> T2[Posts tab\nblog posts only]
    APC --> T3[Projects tab]
    APC --> T4[Experience tab]
    APC --> T5[Education tab]
    APC --> T6[Profile tab\nname, bio, avatar, role]
    APC --> T7[Landing tab\nheadline, CTAs, nav links]
    APC --> T8[Publications tab]
    APC --> T9[GitHub tab\nrepo metrics viewer]
```

Each tab loads and saves the relevant slice of `admin-content.json` via the `/api/admin/content` endpoint.

---

## Content Save Flow

```mermaid
sequenceDiagram
    participant UI as Admin UI
    participant API as PUT /api/admin/content
    participant Auth as isAdminAuthenticated()
    participant Env as process.env
    participant Disk as Filesystem
    participant GH as GitHub API

    UI->>API: PUT { updatedStore }
    API->>Auth: Verify cookie
    Auth-->>API: Valid / Invalid
    API->>Env: Has GITHUB_TOKEN?

    alt Dev (no token)
        API->>Disk: writeStoreFile(store)
        Disk-->>UI: 200 OK
    else Production
        API->>GH: GET current file SHA
        API->>GH: Create / checkout branch\nadmin-content-update-{timestamp}
        API->>GH: PUT file commit (base64 encoded JSON)
        API->>GH: Create PR if none open\nor update existing PR body
        GH-->>UI: 200 OK + PR URL
    end
```

**Branch naming:** `admin-content-update-<unix-timestamp>`

**PR title:** `Admin content updates`

**Commit message:** `Admin: update site content (via admin UI)`

After the PR is merged, Netlify detects the push to `main` and triggers a rebuild, which re-runs `generateStaticParams` and picks up the new content.

---

## GitHub Image Upload

Images (e.g. avatars, post covers) are uploaded via `POST /api/admin/upload-image`. The endpoint commits the binary file to the GitHub repo (base64 encoded) using `githubSync.ts → commitFileToBranch()`. The committed URL is then stored in the JSON store.

---

## Environment Variables Required

| Variable | Purpose |
|---|---|
| `ADMIN_SECRET` | HMAC key for signing session tokens |
| `ADMIN_GITHUB_USERNAME` | Only this GitHub login is granted access |
| `GITHUB_OAUTH_CLIENT_ID` | OAuth app client ID |
| `GITHUB_OAUTH_CLIENT_SECRET` | OAuth app secret |
| `GITHUB_TOKEN` | Personal access token for creating PRs (prod only) |
| `GITHUB_REPOSITORY` | `owner/repo` for PR target (prod only) |
