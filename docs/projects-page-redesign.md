# Projects Section — Feature Specification

## Overview

The projects section is being redesigned from the ground up. It currently shares the same layout as the blog — a single-column reading list with a filter sidebar. That works for time-ordered writing; it does not work for a portfolio of built things.

The redesign has three parts that form a single coherent experience:

1. **Listing page** — a card grid that lets visitors scan and evaluate projects at a glance
2. **Detail overlay** — clicking a card expands it in-place into a dashboard panel while the grid stays visible behind a blurred backdrop
3. **Project dashboard** — the detail view itself: a structured dashboard with a hero strip, stat cards, and tabbed content including an interactive architecture diagram

---

## Part 1 — Projects Listing Page

### What changes

The blog-style single column is replaced with a **2–3 column card grid**. Images become the dominant visual element rather than a small thumbnail strip. The filter sidebar is retained (or moved to a compact tag bar above the grid) since tag/stack filtering is still useful.

### Card design

Each card surfaces the information a visitor actually needs before deciding to read further:

- **Project image** — fills most of the card face
- **Title** and **one-line description**
- **Status badge** — `Live` (green) / `In Progress` (amber) / `Archived` (slate) — gives honest context without requiring a read-through
- **Tech stack badges** — small labelled icons for each technology, distinct from topic tags
- **Repo and demo icon buttons** — visible directly on the card; recruiters often skim lists and never click through
- **Year** — derived from the existing `date` field, shown as a single number

On hover, a short highlight blurb ("what I built / what I learned") appears over the image. This keeps the default card clean while rewarding curiosity.

### Featured project row

A `featured` flag on the data model pins one or two projects to a larger hero card at the top of the grid before the regular card columns begin. This directs attention to the strongest work immediately.

---

## Part 2 — Overlay & Animation

### Behaviour

Clicking a project card does **not** navigate away. Instead:

1. The clicked card expands in-place into a large centred panel via a shared layout animation
2. A blurred, dimmed backdrop fades in over the rest of the grid
3. The URL updates to `/projects/[slug]` — bookmarkable and shareable
4. The project dashboard content fades into the expanded panel
5. Pressing `Escape`, clicking the backdrop, or clicking the close button collapses back to the grid with the reverse animation

Navigating directly to `/projects/[slug]` (shared link, page refresh) bypasses the overlay entirely and renders the dashboard as a standalone full-page view — no broken states.

### Routing — Next.js Intercepting Routes + Parallel Routes

This uses Next.js App Router's intercepting routes feature. The `app/projects/` directory is restructured as follows:

```
app/
└── projects/
    ├── layout.tsx                       ← NEW: renders children + @modal slot together
    ├── page.tsx                         ← unchanged: projects grid
    ├── @modal/
    │   ├── default.tsx                  ← NEW: returns null (slot empty by default)
    │   └── (.)projects/[slug]/
    │       └── page.tsx                 ← NEW: intercepted route — renders the overlay
    └── [slug]/
        └── page.tsx                     ← unchanged: standalone full-page fallback
```

The `(.)` prefix intercepts navigation to `/projects/[slug]` when the user is already on `/projects`. The `@modal` slot is populated and rendered alongside the grid via `layout.tsx`. When navigating directly, the interception does not fire and Next.js renders `[slug]/page.tsx` as a normal full-page route.

The back button calls `router.back()`, which depopulates the `@modal` slot — no custom state management needed.

```tsx
// app/projects/layout.tsx
export default function ProjectsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children} {/* grid — always rendered */}
      {modal}    {/* overlay — null until a card is clicked */}
    </>
  );
}
```

### Animation — Framer Motion shared layout

The card-to-panel expansion uses Framer Motion's `layoutId`. The card on the grid and the overlay panel share the same `layoutId` (the project slug). Framer Motion automatically animates the geometry between the two positions and sizes.

`ContentPostCard` already accepts and applies `layoutId` to its root `motion.div` — this is already in place.

**Open flow:**
```
Click card
  → Next.js populates @modal slot
  → AnimatePresence mounts overlay
  → Framer Motion morphs card → panel (shared layoutId)
  → Backdrop fades in concurrently
  → Dashboard content fades in after panel settles
```

**Close flow:**
```
Escape / backdrop click / close button
  → router.back()
  → @modal slot depopulated
  → AnimatePresence triggers exit
  → Panel morphs back toward card position
  → Backdrop fades out
```

### Visual details

**Backdrop**
- Fixed fullscreen, `z-index` above the grid
- `rgba(0,0,0,0.6)` background with `backdrop-filter: blur(8px)`
- Framer Motion fade `opacity: 0 → 1`; clicking it fires `router.back()`

**Panel**
- `max-w-5xl`, `max-h-[90vh]`, internally scrollable
- Glassmorphism style (`bg-slate-900/90`, border, shadow) matching the site
- Dashboard content fades in with a short delay after the panel finishes expanding, preventing visual noise during the morph
- On mobile: full viewport (`w-full h-full`), no max-width or rounded corners

**Scroll lock**
- `document.body.style.overflow = 'hidden'` set on overlay mount, restored on unmount

**Close button**
- `×` icon top-right of the panel
- `Escape` key wired via `useEffect` keydown listener calling `router.back()`

---

## Part 3 — Project Dashboard

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HERO STRIP                                                 │
│  Title  ·  Status badge  ·  Repo + Demo buttons  ·  Stack  │
└─────────────────────────────────────────────────────────────┘

┌─────────────┬─────────────┬─────────────┬───────────────────┐
│  Status     │  Role       │  Year       │  Stack count      │
└─────────────┴─────────────┴─────────────┴───────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  TABS:  Overview  ·  Architecture  ·  Technical Notes       │
├─────────────────────────────────────────────────────────────┤
│  [active tab content]                                       │
└─────────────────────────────────────────────────────────────┘
```

### Hero strip

- Project title (large)
- Status badge pill: `Live` (green) / `In Progress` (amber) / `Archived` (slate)
- GitHub and demo icon buttons — prominent, not buried in the detail page
- One-line tagline / description
- Tech stack badge row — small icons + names for each technology

### Stat cards row

Four small glanceable panels. Purely informational, no interaction:

| Card | Content |
|---|---|
| Status | Short label, e.g. "Actively maintained" |
| Role | Solo / Team / Contributor |
| Year | Derived from `date` |
| Stack | Top 3 technology names or total count |

### Tab 1 — Overview

- `description` rendered as a readable paragraph
- "What problem does this solve?" — `problem` field (new)
- Key outcomes or wins — `highlights[]` bullet list (new)
- Project screenshot / banner image if set

### Tab 2 — Architecture

Embedded draw.io diagrams authored externally and rendered with pan and zoom. The authoring workflow:

1. Author the diagram in draw.io (desktop app or diagrams.net in browser)
2. Export as **SVG** — draw.io SVGs embed the full diagram XML as metadata, so the source is always recoverable and re-editable
3. Store the SVG in the project's asset directory: `public/images/projects/<slug>/architecture.svg`
4. Reference via the `architectureDiagram` field (a file path string, same pattern as `image`)

**Rendering:** `react-zoom-pan-pinch` wraps the SVG element, providing mouse/touch pan and scroll-to-zoom. Controls: a reset-view button and an optional fullscreen toggle.

**Why SVG, not an iframe embed:** draw.io's iframe viewer requires the diagram to be hosted at a reachable public URL, which ties the site to an external service and breaks in offline/preview environments. SVG is self-contained, served from the same domain, scales perfectly at any resolution, and the embedded XML preserves the source.

**Tab visibility:** If `architectureDiagram` is not set, the Architecture tab does not render at all — no placeholder or empty state.

**Dark background:** draw.io exports with a white background by default. Diagrams should be authored with a transparent or dark background, or the viewer container applies a dark background behind the SVG.

### Tab 3 — Technical Notes

The existing `content` MDX field lives here — architecture decisions, trade-offs, implementation details, lessons learned. Rendered identically to the current detail page (rehype-pretty-code, syntax highlighting, Tailwind Typography prose classes). Moving it to a tab keeps the dashboard uncluttered while preserving all the depth.

Suggested internal structure for the MDX content:
- Design Decisions
- Challenges & Trade-offs
- What I'd Do Differently
- References

---

## Data Model Changes

All changes are additive — no existing fields are removed or renamed.

```ts
// New fields on ProjectMeta and StoreProject in admin-content.json
featured?: boolean;              // pins project to hero row on listing page
status?: 'live' | 'wip' | 'archived';
stack?: string[];                // explicit tech list, separate from topic tags
role?: 'solo' | 'team' | 'contributor';
problem?: string;                // one paragraph: what problem does this solve?
highlights?: string[];           // 3–5 bullet outcome / win statements
architectureDiagram?: string;   // path to draw.io SVG, e.g. "/images/projects/slug/architecture.svg"
```

Existing fields `repoUrl` and `demoUrl` are already present — no changes needed there.

---

## Component Tree

```
ProjectsLandingPage                      (listing page — replaces ContentLandingPage)
├── FeaturedProjectCard                  (large hero card for featured projects)
├── ProjectGrid                          (2–3 col grid)
│   └── ProjectCard (× n)               (image-dominant card with status, stack, links)
└── TagFilterBar                         (replaces sidebar filter)

ProjectOverlay                           (parallel route — @modal slot)
├── Backdrop                             (fixed fullscreen blur/dim, click-to-close)
└── motion.div layoutId={slug}           (expanding panel, shared with ProjectCard)
    ├── CloseButton                      (×, calls router.back())
    └── ProjectDashboardPage             (dashboard — shared with full-page route)

ProjectDashboardPage                     (used by overlay AND standalone [slug] page)
├── ProjectHeroStrip                     (title, status, CTAs, stack badges)
├── ProjectStatCards                     (4-up info row)
└── ProjectTabPanel                      (tab switcher with Framer Motion transitions)
    ├── ProjectOverviewTab               (description, problem, highlights, image)
    ├── ProjectArchitectureTab           (conditional — only if architectureDiagram is set)
    │   └── DiagramViewer               (react-zoom-pan-pinch + reset/fullscreen controls)
    └── ProjectTechnicalTab             (existing MDX prose renderer)
```

`ContentPostPage` is not modified — it remains in use for `/blog/[slug]`.

---

## Implementation Order

### Phase 1 — Data model & admin
1. Add new fields to `ProjectMeta`, `StoreProject`, and the admin form (`status`, `stack`, `role`, `featured`, `problem`, `highlights`, `architectureDiagram`)
2. Add SVG file upload to the admin form, consistent with existing image upload handling
3. Backfill `admin-content.json` with values for existing projects

### Phase 2 — Project dashboard
4. Install `react-zoom-pan-pinch`
5. Build `ProjectDashboardPage` and its sub-components: `ProjectHeroStrip`, `ProjectStatCards`, `ProjectTabPanel`, `ProjectOverviewTab`, `DiagramViewer`, `ProjectTechnicalTab`
6. Wire to the existing `app/projects/[slug]/page.tsx` — standalone full-page route works first

### Phase 3 — Listing page
7. Build `ProjectCard` (image-dominant, status badge, stack badges, repo/demo buttons)
8. Build `FeaturedProjectCard` (larger hero variant)
9. Build `ProjectGrid` and `TagFilterBar`
10. Replace `ProjectsLandingPage` with the new grid layout

### Phase 4 — Overlay
11. Restructure `app/projects/`: add `layout.tsx`, `@modal/default.tsx`, `@modal/(.)projects/[slug]/page.tsx`
12. Build `ProjectOverlay` (backdrop, `AnimatePresence`, body scroll lock, Escape key handler)
13. Ensure `ProjectCard` passes `layoutId={slug}` to its root `motion.div`
14. Test shared layout animation between card and overlay panel
15. Test full-page fallback on direct navigation and page refresh

---

## Open Decisions

- **Multiple architecture diagrams:** Support a single diagram to start. Extend to `architectureDiagrams?: { label: string; path: string }[]` (sub-tabs within the Architecture tab) as a follow-up if needed.
- **SVG rendering method:** `<img src>` is simplest but prevents CSS targeting of SVG internals. Inline SVG allows full styling but bloats the HTML. Start with `<img>` and switch to inline if theming issues arise.
- **Technical Notes route:** Keep as a tab for now. Revisit a dedicated `/projects/[slug]/notes` route if deep-linking into the notes becomes a real need.
