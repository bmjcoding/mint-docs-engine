# Mintlify Docs Engine — Claude Code Continuation Prompt

## Context
This is a clean Mintlify documentation site clone built from scratch. It reads from `docs.json` and renders markdown content pages with Mintlify-equivalent components and layout.

## Research Files (READ THESE)
Three research files in the project root contain the complete Mintlify specification:
- `mintlify-config-analysis.md` — Complete docs.json schema, all config properties
- `mintlify-components-analysis.md` — All 24 MDX component specs  
- `mintlify-rendered-html-analysis.md` — Exact rendered HTML/CSS from live Mintlify sites

## Current State
Working:
- docs.json config loading (name, colors, navigation, tabs, navbar, footer)
- 3-column layout (sidebar, content, TOC)
- Navbar with tabs, search button, theme toggle
- Sidebar with collapsible groups, active states
- Table of Contents auto-generated from headings
- Markdown rendering with components (Callout, Card, CodeBlock, Steps, Tabs, Accordion, Badge, Frame, Tooltip)
- Search modal (Cmd+K) with keyboard navigation
- Light/Dark/System theme toggle
- Breadcrumbs from navigation tree
- Prev/Next page navigation
- Copy page button
- 6 sample content pages

## Known Issues to Fix First
1. **Navbar backdrop intercepts sidebar clicks** — The `#navbar-transition` div has `pointer-events` blocking sidebar link clicks. Fix: add `pointer-events-none` to the backdrop div.
2. **Dark mode sidebar text too faint** — Sidebar nav items in dark mode are barely visible. The inactive link color should be `dark:text-gray-400 dark:hover:text-gray-300`.
3. **Dark mode callout styling** — Callouts need dark mode border/background adjustments.
4. **Sidebar active state in dark mode** — Should use `dark:bg-primary-light/10 dark:text-primary-light`.

## Remaining Features (by priority)

### P0 — Critical for Mintlify parity
1. **Shiki syntax highlighting** — `npm install shiki`. Use `github-light-default` + `dark-plus` dual themes with CSS variable mode. Replace plain code blocks with Shiki-highlighted output.
2. **Fix all dark mode issues** — Every component must look correct in dark mode. Test thoroughly.
3. **Heading anchor links** — Show `#` icon on heading hover that copies the anchor URL.
4. **Page feedback** — Wire "Was this helpful?" Yes/No buttons to actually work (can be local state for now).

### P1 — Important components
5. **CodeGroup** — Multi-file tabbed code blocks (partially implemented, verify it works).
6. **Mermaid diagrams** — `npm install mermaid`. Render ```mermaid fenced blocks as diagrams.
7. **Expandable / ParamField / ResponseField** — API documentation field components.
8. **Panel** — Side panel for API request/response examples.

### P2 — Missing components (see mintlify-components-analysis.md)
9. **Color** — Color swatch display component
10. **Icon** — Standalone icon component
11. **Prompt** — AI prompt card with copy action
12. **Tile / Tiles** — Navigation tiles with image previews
13. **Tree** — File tree display with keyboard navigation
14. **Update** — Changelog timeline entry
15. **View** — Multi-view framework/language switcher

### P3 — Advanced features
16. **Full-text search** — Index all page content and search across it
17. **OpenAPI playground** — Render interactive API endpoints from spec
18. **Banner** — Site-wide announcement from config
19. **Custom fonts** — Load from config fonts property
20. **Background decoration** — gradient/grid/windows patterns from config
21. **Internationalization** — Language switching support

## Parallelization
These can be worked on simultaneously:
- **Thread 1:** P0 items 1-4 (Shiki, dark mode fixes, anchors, feedback)
- **Thread 2:** P1 items 5-8 (CodeGroup, Mermaid, API components)
- **Thread 3:** P2 items 9-15 (missing components — all independent)

P3 items should wait until P0-P2 are complete.

## Rules
- No em dashes in generated text
- Use exact Mintlify CSS classes from mintlify-rendered-html-analysis.md
- Use data-component-part attributes on component sub-elements
- TypeScript strict, no `any` types
- Test with `npx tsc --noEmit && npx vite build` after changes
- All components must support dark mode
