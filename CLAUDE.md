# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint
npm run format     # Prettier (writes in place)
```

No test runner is configured.

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · next-mdx-remote · Framer Motion · Netlify deployment

### Content System

All content (blog posts, projects, experience, education, profile) lives in a single JSON store at `src/data/admin-content.json`. This is the source of truth for everything rendered on the site.

- `src/lib/admin/storeFile.ts` — reads/writes the JSON store. In production, the file is webpack-bundled so Netlify serverless functions can access it without filesystem access.
- `src/lib/devblog.ts` and `src/lib/projects.ts` — query helpers that call `readStoreFile()` and return typed data.
- Blog/project posts contain MDX as strings. `src/lib/compileMDX.tsx` compiles them at runtime using `next-mdx-remote` with `rehype-pretty-code` (GitHub Dark theme).

### Routing

- `/` — Home (landing page with experience, education, hero sections)
- `/blog` and `/blog/[slug]` — Blog listing and individual posts (SSG via `generateStaticParams`)
- `/projects` and `/projects/[slug]` — Same pattern as blog
- `/admin` — Admin portal with GitHub OAuth; content editing writes back to the JSON store via `/api/admin/content`

### Component Structure (Atomic Design)

```
src/components/
  atoms/       # Base UI: Button, Icon, PageHeader, HeroTitle, ProjectTag
  molecules/   # Composed: ContentFilter, Section, ContentPostPageContents
  organisms/   # Complex: NavBar, HeroSection, ExperienceList, ContentPostCard, NodeGraph, MatrixRain
  pages/       # Full-page components assembled from organisms
  context/     # ThemeContext (global theme state)
```

`ContentPostPage` handles rendering MDX posts and generates a sticky table of contents from DOM headings.

### Key Patterns

- **SSG for content posts:** Both `/blog/[slug]` and `/projects/[slug]` use `generateStaticParams()` — all posts are statically generated at build time.
- **Client-side filtering:** The content listing pages (`/blog`, `/projects`) filter by tag/search in React state — no server round-trips.
- **Scroll-to-section navigation:** Uses `sessionStorage` to carry a target section ID when navigating from another page to the home page.
- **MDX prose:** Rendered content uses Tailwind Typography (`prose` classes) inside `ContentPostPage`.

### Styling Conventions

- Tailwind utility classes throughout; dark theme with green/teal/blue accents on slate backgrounds.
- Custom keyframe animations defined in `src/app/globals.css`.
- Prettier config: single quotes, semicolons, trailing commas, 100-char line width, LF line endings.
