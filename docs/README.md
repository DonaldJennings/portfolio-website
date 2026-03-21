# Documentation

Architecture and design documentation for the portfolio website.

## Contents

| Document | What it covers |
|---|---|
| [architecture.md](./architecture.md) | System overview, tech stack, key patterns, repo layout, environment variables |
| [routing.md](./routing.md) | Full route map, modal overlay slots, API endpoints, middleware logic |
| [content-system.md](./content-system.md) | JSON data store schema, content flow to pages, MDX pipeline, admin save flow |
| [components.md](./components.md) | Atomic design hierarchy, component catalogue, canvas effects, scroll-to-section |
| [admin.md](./admin.md) | Admin portal auth (GitHub OAuth + HMAC sessions), content save → GitHub PR flow |
| [theme-system.md](./theme-system.md) | Color schemes, CSS variables, backdrop effects, how to add new schemes/backdrops |

## Quick Reference

```
JSON store → lib helpers → generateStaticParams → static HTML
                                                 ↘ MDX compile → ContentPostPage

Click save in admin → PUT /api/admin/content → GitHub PR (prod) / disk write (dev)

ThemeContext → data-color-scheme on <html> → CSS variables → all components
            → backdropId → ActiveBackdrop → NodeGraph / MatrixRain / Starfield
```
