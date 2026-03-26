# CLAUDE.md

## Project Goal

This project is a **pixel-perfect replica of the official Claude Code Docs site** (https://code.claude.com/docs/en/quickstart). The goal is 100% feature parity — components, typography, colors, spacing, responsive behavior, animations, and interactions should all match the reference site exactly.

When in doubt about how something should look or behave, **always refer to the live reference site** as the source of truth.

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no separate config file)
- **Content**: MDX/Markdown files in `dist/content/`, parsed with `react-markdown` + `gray-matter`
- **Icons**: `lucide-react`
- **Routing**: Hash-based (`#/slug`)

## Project Structure

```
src/
  App.tsx              — Main layout shell, routing, state management
  index.css            — CSS variables, theme colors, layout constants
  components/
    Navbar.tsx          — Top navigation bar (responsive: desktop/mobile)
    Sidebar.tsx         — Left nav panel (desktop fixed, mobile overlay)
    TableOfContents.tsx — Right-side TOC (visible at xl+)
    Footer.tsx          — Page footer with prev/next navigation
    SearchModal.tsx     — Cmd+K search overlay
    MarkdownRenderer.tsx — MDX content rendering
    MdxComponents.tsx   — Custom MDX component implementations
    InstallConfigurator.tsx — Interactive install widget
    Icon.tsx            — Icon resolver
  hooks/
    useDocsConfig.tsx   — Docs configuration provider
    useTheme.tsx        — Light/dark/system theme management
  lib/
    types.ts            — TypeScript type definitions
    content.ts          — Content loading and parsing utilities
dist/content/           — Markdown/MDX documentation pages
```

## Key Design Decisions

### Responsive Breakpoints (Tailwind defaults)
| Breakpoint | Width | What changes |
|---|---|---|
| `sm` | 640px | — |
| `md` | 768px | — |
| `lg` | 1024px | Desktop sidebar appears, navbar switches from mobile to desktop layout, three-column layout activates |
| `xl` | 1280px | Table of Contents appears, sidebar shifts via `--sidebar-inset` |

### Mobile Navbar (below `lg`)
- **Row 1**: Logo (left), compact icons on right (search, AI sparkle, three-dot menu). When sidebar is open, icons are replaced with X close button.
- **Row 2**: Hamburger menu + breadcrumb trail ("Tab > Page Title")
- The three-dot menu contains theme toggle and CTA link

### Desktop Navbar (at `lg`+)
- **Row 1**: Logo, absolutely-centered search bar + "Ask AI" button, anchor links, navbar links, CTA button, theme toggle
- **Row 2**: Tab navigation with active indicator

### Mobile Sidebar
- Full-height panel (`z-[70]`) starting from `top: 0`, overlays the navbar
- Own header: smaller logo + theme toggle pill (no divider below)
- Tab selector dropdown (absolute positioned, floats over nav content)
- Navigation items with text bumped to `text-base` (16px) for readability
- Theme toggle pill: border `#1a1a1c`, active icon bg `#171717`, hover border `#222224`

### CSS Variables
- `--navbar-height`: Set dynamically via JS, used for sticky positioning
- `--layout-inset`: Centers content at wide viewports
- `--sidebar-inset`: Sidebar left offset on wide screens
- `--color-primary`: `#D97757` (the signature orange/clay color)

## Reference Comparison Workflow

When working on UI changes:
1. Open the reference site (https://code.claude.com/docs/en/quickstart) side-by-side
2. Test at multiple widths: mobile (~375px), tablet (~768px), desktop (~1280px), wide (~1440px+)
3. Match colors, spacing, font sizes, hover states, and transitions exactly
4. Use the browser DevTools on the reference site to inspect exact values when needed

## Dev Server

- Run on a **non-default port** using auto-port to avoid conflicts with worktree sessions
- Another Claude session may be running a dev server on different port from a worktree — do not kill it

## Build & Lint

```bash
npx vite build        # Build (pre-existing TS errors in useDocsConfig.tsx are known, build still succeeds)
npx tsc --noEmit      # Type check (has known errors, non-blocking)
```
