# Content System

All site content lives in a single JSON file. This document covers the data schema, how content flows to rendered pages, and how the MDX pipeline works.

---

## Data Store

**File:** `src/data/admin-content.json`

This is the single source of truth for everything on the site. It is never split across multiple files or a database.

```mermaid
graph LR
    JSON[(admin-content.json)]

    JSON --> Posts["posts[]<br/>blog posts + MDX"]
    JSON --> Projects["projects[]<br/>project entries + MDX"]
    JSON --> Experience["experience[]<br/>roles per company"]
    JSON --> Education["education[]"]
    JSON --> Publications["publications[]"]
    JSON --> Profile["profile{}<br/>name, bio, avatar..."]
    JSON --> Landing["landing{}<br/>headline, CTAs, nav links"]
    JSON --> Skills["skillCategories[]"]
    JSON --> Highlights["highlights[]"]
    JSON --> Interests["interests[]"]
    JSON --> Awards["awards[]"]
    JSON --> Certifications["certifications[]"]
    JSON --> GithubRepos["githubRepos[]"]
```

---

## Store Access

```mermaid
flowchart TD
    JSON[(admin-content.json)]

    subgraph storeFile["lib/admin/storeFile.ts"]
        Read["readStoreFile()"]
    end

    subgraph env["Environment"]
        Dev["Development<br/>reads from disk"]
        Prod["Production<br/>webpack-bundled copy<br/>(serverless safe)"]
    end

    Read --> Dev
    Read --> Prod

    subgraph helpers["Query Helpers"]
        Blog["lib/devblog.ts<br/>getDevBlogPosts()<br/>getDevBlogPost(slug)"]
        Proj["lib/projects.ts<br/>getAllProjects()<br/>getProject(slug)"]
        Store["lib/admin/contentStore.ts<br/>getContentStore()<br/>full typed store"]
    end

    Dev --> helpers
    Prod --> helpers
    JSON --> Read
```

`storeFile.ts` is the only file that touches the JSON. Everything else goes through the query helpers.

---

## Content Data Flow

### Blog / Projects (SSG)

```mermaid
sequenceDiagram
    participant Build as Next.js Build
    participant SP as generateStaticParams()
    participant Helper as devblog.ts / projects.ts
    participant Store as admin-content.json
    participant MDX as compileMDX.tsx
    participant Page as Static HTML

    Build->>SP: Enumerate all slugs
    SP->>Helper: getDevBlogPosts()
    Helper->>Store: readStoreFile()
    Store-->>Helper: posts[]
    Helper-->>SP: slug list
    SP-->>Build: [{ slug }, { slug }, ...]

    loop For each slug
        Build->>Helper: getDevBlogPost(slug)
        Helper->>Store: readStoreFile()
        Store-->>Helper: post with MDX content string
        Helper-->>Build: post object
        Build->>MDX: compileMdx(post.content)
        MDX-->>Build: React element tree
        Build->>Page: Render static HTML
    end
```

### Home / About (SSG, no slug)

```mermaid
flowchart LR
    Store[(admin-content.json)]
    Store --> CS["getContentStore()"]
    CS --> Profile["profile{}"]
    CS --> Landing["landing{}"]
    CS --> Experience["experience[]"]
    CS --> Education["education[]"]
    CS --> Skills["skillCategories[]"]
    Profile --> Home["/"]
    Landing --> Home
    Experience --> About["/about"]
    Education --> About
    Skills --> About
```

---

## MDX Pipeline

Blog posts and project write-ups are stored as raw MDX strings inside the JSON store. They are compiled server-side at build time.

```mermaid
flowchart LR
    Raw["MDX string\n(in JSON store)"]
    Raw --> Compile["compileMdx(source)\nlib/compileMDX.tsx"]

    subgraph Plugins
        Pretty["rehype-pretty-code\nGitHub Dark syntax theme"]
        GFM["remark-gfm\nGitHub Flavored Markdown"]
    end

    Compile --> Plugins
    Plugins --> Tree["React element tree"]
    Tree --> ContentPostPage["ContentPostPage\nwrapped in prose / Tailwind Typography"]
    ContentPostPage --> TOC["Sticky Table of Contents\n(built from DOM headings)"]
```

**Key files:**
- `src/lib/compileMDX.tsx` — wraps `next-mdx-remote/rsc` with the plugin config
- `src/components/pages/ContentPostPage.tsx` — renders compiled MDX + generates TOC from headings
- `src/components/molecules/MDXContent.tsx` — applies `prose` classes and custom MDX component overrides

---

## Data Schema

### `AdminPost`
```typescript
{
  slug: string;
  title: string;
  date: string;           // ISO date string
  description: string;
  excerpt: string;
  tags: string[];
  image?: string;
  author?: string;
  content: string;        // Raw MDX string
}
```

### `AdminProject`
```typescript
{
  slug: string;
  title: string;
  date: string;
  description: string;
  excerpt: string;
  tags: string[];
  image?: string;
  repoUrl?: string;
  demoUrl?: string;
  author?: string;
  content: string;        // Raw MDX string
  status?: 'live' | 'wip' | 'archived';
  stack?: string[];
  role?: string;
  featured?: boolean;
  problem?: string;
  highlights?: string[];
  architectureDiagram?: string;
}
```

### `ExperienceEntry`
```typescript
{
  company: string;
  logoUrl?: string;
  websiteUrl?: string;
  roles: {
    role: string;
    dates: string;
    description: string;
    skills: string[];
    isCurrent?: boolean;
  }[];
}
```

### `ProfileData`
```typescript
{
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  statusLabel: string;
  avatarUrl?: string;
}
```

### `LandingData`
```typescript
{
  headline: string;
  subheadline: string;
  heroPhotoUrl?: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  navLinks: { label: string; href: string; description?: string; icon?: string }[];
}
```

---

## Schema Migration

`src/lib/admin/contentStore.ts` includes a migration layer that normalises legacy JSON shapes to the current schema on read. This allows the store to evolve without a hard cutover — old data is quietly upgraded in memory.

---

## Admin Content Save Flow

```mermaid
sequenceDiagram
    participant Admin as Admin UI
    participant API as PUT /api/admin/content
    participant Env as Environment
    participant Disk as Filesystem (dev)
    participant GH as GitHub API (prod)

    Admin->>API: PUT { store payload }
    API->>API: Verify admin_session cookie
    API->>Env: Check GITHUB_TOKEN
    alt Development (no GITHUB_TOKEN)
        API->>Disk: writeStoreFile(payload)
        Disk-->>Admin: 200 OK
    else Production
        API->>GH: Create branch admin-content-update-{ts}
        API->>GH: Commit admin-content.json to branch
        API->>GH: Open / update PR "Admin content updates"
        GH-->>Admin: 200 OK (PR URL returned)
    end
```

In production, content changes never land directly on `main` — they always go through a PR that can be reviewed before merging and triggering a rebuild.
