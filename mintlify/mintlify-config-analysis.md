# Mintlify Configuration System — Exhaustive Analysis

> Sources: [Global settings](https://mintlify.com/docs/organize/settings) · [Site structure](https://mintlify.com/docs/organize/settings-structure) · [Appearance & branding](https://mintlify.com/docs/organize/settings-appearance) · [SEO & search](https://mintlify.com/docs/organize/settings-seo) · [API settings](https://mintlify.com/docs/organize/settings-api) · [Integrations](https://mintlify.com/docs/organize/settings-integrations) · [Full reference](https://mintlify.com/docs/organize/settings-reference) · [Navigation](https://mintlify.com/docs/organize/navigation) · [Pages](https://mintlify.com/docs/organize/pages) · [Themes](https://mintlify.com/docs/customize/themes) · [Fonts](https://mintlify.com/docs/customize/fonts) · [JSON Schema](https://mintlify.com/docs.json)
>
> Last fetched: March 21, 2026

---

## Table of Contents

1. [Overview and Configuration File](#1-overview-and-configuration-file)
2. [Complete docs.json Schema Quick Reference](#2-complete-docsjson-schema-quick-reference)
3. [Required Fields](#3-required-fields)
4. [Appearance & Branding Settings](#4-appearance--branding-settings)
5. [Site Structure Settings](#5-site-structure-settings)
6. [Navigation System](#6-navigation-system)
7. [SEO & Search Settings](#7-seo--search-settings)
8. [API Settings](#8-api-settings)
9. [Integrations](#9-integrations)
10. [Page Frontmatter (MDX Metadata)](#10-page-frontmatter-mdx-metadata)
11. [Themes Reference](#11-themes-reference)
12. [Fonts Configuration](#12-fonts-configuration)
13. [Advanced: $ref Configuration Splitting](#13-advanced-ref-configuration-splitting)
14. [Complete Example docs.json](#14-complete-example-docsjson)

---

## 1. Overview and Configuration File

Mintlify documentation sites are configured via a **`docs.json`** file at the project root. This is the successor to the deprecated `mint.json`. It controls navigation, appearance, integrations, API documentation settings, SEO, and more.

**JSON Schema URL:** `https://mintlify.com/docs.json`

Include the `$schema` reference at the top of `docs.json` for editor autocomplete, validation, and inline documentation:

```json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Your project name",
  "colors": { "primary": "#ff0000" },
  "navigation": [{ "group": "Home", "pages": ["index"] }]
}
```

### Upgrading from mint.json

```bash
npm i -g mint        # Install CLI (or: mint update)
mint upgrade         # Creates docs.json from existing mint.json
```

---

## 2. Complete docs.json Schema Quick Reference

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `$schema` | string (URI) | No | `https://mintlify.com/docs.json` | JSON schema URL for editor support |
| `$ref` | string (file path) | No | — | Load config from another JSON file |
| `theme` | string | **Yes** | — | Layout theme (see Themes section) |
| `name` | string (minLength: 1) | **Yes** | — | Project/organization/product name |
| `colors.primary` | string (hex) | **Yes** | — | Primary brand color |
| `navigation` | object | **Yes** | — | Content structure and hierarchy |
| `public` | boolean | No | — | Whether docs are publicly accessible by default |
| `description` | string | No | — | Site description for SEO and AI indexing |
| `logo` | string \| object | No | — | Site logo (path or light/dark object) |
| `favicon` | string \| object | No | — | Favicon (path or light/dark object) |
| `colors.light` | string (hex) | No | — | Color for emphasis in dark mode |
| `colors.dark` | string (hex) | No | — | Color for buttons and hover states |
| `appearance.default` | `"system"` \| `"light"` \| `"dark"` | No | `"system"` | Default color mode |
| `appearance.strict` | boolean | No | `false` | Hide light/dark mode toggle |
| `fonts.family` | string | No | Theme default | Font family name |
| `fonts.weight` | number | No | — | Font weight |
| `fonts.source` | string (URI) | No | — | Hosted or local font URL/path |
| `fonts.format` | `"woff"` \| `"woff2"` | No | — | Font format (required with `source`) |
| `fonts.heading` | object | No | — | Override font for headings |
| `fonts.body` | object | No | — | Override font for body text |
| `icons.library` | `"fontawesome"` \| `"lucide"` \| `"tabler"` | No | `"fontawesome"` | Icon library |
| `background.decoration` | `"gradient"` \| `"grid"` \| `"windows"` | No | — | Background decorative pattern |
| `background.color.light` | string (hex) | No | — | Light mode background color |
| `background.color.dark` | string (hex) | No | — | Dark mode background color |
| `background.image` | string \| object | No | — | Background image path or light/dark object |
| `styling.eyebrows` | `"section"` \| `"breadcrumbs"` | No | `"section"` | Page eyebrow style |
| `styling.latex` | boolean | No | Auto-detected | Force-load or disable LaTeX stylesheets |
| `styling.codeblocks` | `"system"` \| `"dark"` \| string \| object | No | `"system"` | Code block theme |
| `thumbnails.appearance` | `"light"` \| `"dark"` | No | Site default | Thumbnail theme |
| `thumbnails.background` | string | No | — | Thumbnail background image |
| `thumbnails.fonts.family` | string | No | — | Thumbnail font (Google Fonts only) |
| `navbar.links` | array | No | — | Links in the top navbar |
| `navbar.primary` | object | No | — | Primary CTA button in navbar |
| `footer.socials` | object | No | — | Social media profile links |
| `footer.links` | array | No | — | Link columns in the footer |
| `banner.content` | string | No | — | Site-wide banner text (MDX supported) |
| `banner.dismissible` | boolean | No | `false` | Show dismiss button on banner |
| `interaction.drilldown` | boolean | No | Theme default | Auto-navigate to first page on group expand |
| `contextual.options` | array | No | — | Actions in the contextual menu |
| `contextual.display` | `"header"` \| `"toc"` | No | `"header"` | Contextual menu placement |
| `redirects` | array | No | — | URL redirect rules |
| `variables` | object | No | — | Global `{{variable}}` substitutions |
| `metadata.timestamp` | boolean | No | `false` | Show last-modified date on all pages |
| `errors.404.redirect` | boolean | No | `true` | Auto-redirect 404s to home |
| `errors.404.title` | string | No | — | Custom 404 page title |
| `errors.404.description` | string | No | — | Custom 404 page description |
| `api.openapi` | string \| array \| object | No | — | OpenAPI spec file(s) |
| `api.asyncapi` | string \| array \| object | No | — | AsyncAPI spec file(s) |
| `api.playground.display` | `"interactive"` \| `"simple"` \| `"none"` \| `"auth"` | No | `"interactive"` | Playground mode |
| `api.playground.proxy` | boolean | No | `true` | Route requests through proxy |
| `api.params.expanded` | `"all"` \| `"closed"` | No | `"closed"` | Expand API params by default |
| `api.url` | `"full"` | No | — | Always show full base URL |
| `api.examples.languages` | array of string | No | — | Code example languages |
| `api.examples.defaults` | `"required"` \| `"all"` | No | `"all"` | Include optional params in examples |
| `api.examples.prefill` | boolean | No | `false` | Prefill playground with spec examples |
| `api.examples.autogenerate` | boolean | No | `true` | Auto-generate code samples |
| `api.spec.download` | boolean | No | `false` | Show spec download button |
| `api.mdx.auth.method` | `"bearer"` \| `"basic"` \| `"key"` \| `"cobo"` | No | — | Auth method for MDX API pages |
| `api.mdx.auth.name` | string | No | — | Auth parameter name |
| `api.mdx.server` | string \| array | No | — | Base URL(s) for MDX API pages |
| `seo.indexing` | `"navigable"` \| `"all"` | No | `"navigable"` | Which pages to index |
| `seo.metatags` | object | No | — | Global custom meta tags |
| `search.prompt` | string | No | — | Search bar placeholder text |
| `integrations.*` | object | No | — | Third-party integrations (see section 9) |

---

## 3. Required Fields

You must define exactly four fields to build a working Mintlify site:

| Field | Type | Description |
|---|---|---|
| `theme` | string | Layout theme (one of the nine theme names) |
| `name` | string | Project or organization name |
| `colors.primary` | string (hex) | Primary brand color as a hex code |
| `navigation` | object | Your content structure |

---

## 4. Appearance & Branding Settings

### 4.1 `theme` (required)

The layout theme for your site. Must be one of:

| Value | Description |
|---|---|
| `"mint"` | Classic documentation theme with time-tested layouts and familiar navigation |
| `"maple"` | Modern, clean aesthetics perfect for AI and SaaS products |
| `"palm"` | Sophisticated fintech theme with deep customization for enterprise documentation |
| `"willow"` | Stripped-back essentials for distraction-free documentation |
| `"linden"` | Retro terminal vibes with monospace fonts for that 80s hacker aesthetic |
| `"almond"` | Card-based organization meets minimalist design for intuitive navigation |
| `"aspen"` | Modern documentation crafted for complex navigation and custom components |
| `"sequoia"` | Minimal, elegant layouts designed for large-scale content-focused documentation |
| `"luma"` | Clean, minimal design for polished documentation |

### 4.2 `colors` (required)

```json
"colors": {
  "primary": "#0D9373",
  "light": "#55D799",
  "dark": "#0D9373"
}
```

| Property | Type | Required | Description |
|---|---|---|---|
| `colors.primary` | hex string matching `^#([a-fA-F0-9]{6}\|[a-fA-F0-9]{3})$` | **Yes** | Primary brand color; used for emphasis in light mode |
| `colors.light` | hex string (same pattern) | No | Color for emphasis in dark mode |
| `colors.dark` | hex string (same pattern) | No | Color for buttons and hover states in both modes |

### 4.3 `logo`

Type: `string` or `object`

**Simple form (same logo for both modes):**
```json
"logo": "/logo.svg"
```

**Object form (separate light/dark logos):**
```json
"logo": {
  "light": "/logo/light.svg",
  "dark": "/logo/dark.svg",
  "href": "https://yoursite.com"
}
```

| Property | Type | Required | Description |
|---|---|---|---|
| `logo.light` | string | Yes (when object) | Path to logo for light mode |
| `logo.dark` | string | Yes (when object) | Path to logo for dark mode |
| `logo.href` | string (URI) | No | URL to redirect when clicking logo; defaults to homepage |

### 4.4 `favicon`

Type: `string` or `object`. Automatically resized to appropriate favicon sizes.

```json
"favicon": "/favicon.svg"
// or
"favicon": {
  "light": "/favicon.png",
  "dark": "/favicon-dark.png"
}
```

| Property | Type | Required | Description |
|---|---|---|---|
| `favicon.light` | string | Yes (when object) | Path to favicon for light mode |
| `favicon.dark` | string | Yes (when object) | Path to favicon for dark mode |

### 4.5 `appearance`

```json
"appearance": {
  "default": "dark",
  "strict": true
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `appearance.default` | `"system"` \| `"light"` \| `"dark"` | `"system"` | Default color mode |
| `appearance.strict` | boolean | `false` | When `true`, hides the light/dark mode toggle |

### 4.6 `icons`

```json
"icons": {
  "library": "lucide"
}
```

| Property | Type | Default | Options | Description |
|---|---|---|---|---|
| `icons.library` | string | `"fontawesome"` | `"fontawesome"`, `"lucide"`, `"tabler"` | Icon library; all icon names in your docs must come from this library |

> **Note:** You can specify a URL to an externally hosted icon or a path to an icon file for any individual icon, regardless of the library setting.

### 4.7 `background`

```json
"background": {
  "decoration": "gradient",
  "color": {
    "light": "#F8FAFC",
    "dark": "#0F172A"
  },
  "image": "/images/background.png"
}
```

| Property | Type | Options | Description |
|---|---|---|---|
| `background.decoration` | string | `"gradient"`, `"grid"`, `"windows"` | Decorative background pattern |
| `background.color.light` | hex string | — | Background color for light mode |
| `background.color.dark` | hex string | — | Background color for dark mode |
| `background.image` | string \| object | — | Background image path (string) or separate light/dark paths (object) |
| `background.image.light` | string | — | Background image for light mode (when using object form) |
| `background.image.dark` | string | — | Background image for dark mode (when using object form) |

### 4.8 `styling`

```json
"styling": {
  "eyebrows": "breadcrumbs",
  "latex": false,
  "codeblocks": {
    "theme": {
      "light": "github-light",
      "dark": "tokyo-night"
    }
  }
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `styling.eyebrows` | `"section"` \| `"breadcrumbs"` | `"section"` | Page eyebrow (label shown at top of page) |
| `styling.latex` | boolean | Auto-detected | Force-load (`true`) or disable (`false`) LaTeX stylesheets |
| `styling.codeblocks` | `"system"` \| `"dark"` \| string \| object | `"system"` | Code block theme configuration |

#### `styling.codeblocks` full options:

- `"system"` — Matches the current site mode (light or dark)
- `"dark"` — Always uses dark mode
- A Shiki theme name string (e.g., `"tokyo-night"`) — Applies to all code blocks
- An object with `theme` key:
  - `theme` as a single string: applies one Shiki theme to both modes
  - `theme` as an object with `light` and `dark` keys: applies separate Shiki themes per mode

**Complete list of supported Shiki themes:**

`andromeeda`, `aurora-x`, `ayu-dark`, `catppuccin-frappe`, `catppuccin-latte`, `catppuccin-macchiato`, `catppuccin-mocha`, `dark-plus`, `dracula`, `dracula-soft`, `everforest-dark`, `everforest-light`, `github-dark`, `github-dark-default`, `github-dark-dimmed`, `github-dark-high-contrast`, `github-light`, `github-light-default`, `github-light-high-contrast`, `gruvbox-dark-hard`, `gruvbox-dark-medium`, `gruvbox-dark-soft`, `gruvbox-light-hard`, `gruvbox-light-medium`, `gruvbox-light-soft`, `houston`, `kanagawa-dragon`, `kanagawa-lotus`, `kanagawa-wave`, `laserwave`, `light-plus`, `material-theme`, `material-theme-darker`, `material-theme-lighter`, `material-theme-ocean`, `material-theme-palenight`, `min-dark`, `min-light`, `monokai`, `night-owl`, `nord`, `one-dark-pro`, `one-light`, `plastic`, `poimandres`, `red`, `rose-pine`, `rose-pine-dawn`, `rose-pine-moon`, `slack-dark`, `slack-ochin`, `snazzy-light`, `solarized-dark`, `solarized-light`, `synthwave-84`, `tokyo-night`, `vesper`, `vitesse-black`, `vitesse-dark`, `vitesse-light`, `css-variables`

**Custom language configuration:**
```json
"styling": {
  "codeblocks": {
    "languages": {
      "custom": ["/path/to/language.json"]
    }
  }
}
```

### 4.9 `thumbnails`

Social media and page preview thumbnail customization.

```json
"thumbnails": {
  "appearance": "dark",
  "background": "/images/og-background.png",
  "fonts": {
    "family": "Inter"
  }
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `thumbnails.appearance` | `"light"` \| `"dark"` | Site color scheme | Visual theme for thumbnails |
| `thumbnails.background` | string | — | Background image (relative path or absolute URL) |
| `thumbnails.fonts.family` | string | — | Font family for thumbnails (Google Fonts only) |

---

## 5. Site Structure Settings

### 5.1 `navbar`

```json
"navbar": {
  "links": [
    { "type": "github", "href": "https://github.com/your-org/your-repo" },
    { "label": "Community", "href": "https://example.com/community" }
  ],
  "primary": {
    "type": "button",
    "label": "Get started",
    "href": "https://example.com/signup"
  }
}
```

#### `navbar.links` — Array of objects:

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `"github"` \| `"discord"` | No | Link type; omit for a standard link |
| `label` | string | Conditional (required when `type` is omitted) | Link label text |
| `href` | string (URI) | **Yes** | Link destination URL |
| `icon` | string | No | Icon name, URL, path, or SVG |
| `iconType` | string | No | Font Awesome icon style only |

#### `navbar.primary` — Object:

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `"button"` \| `"github"` \| `"discord"` | **Yes** | Button style |
| `label` | string | Conditional (required when type is `"button"`) | Button label |
| `href` | string (URI) | **Yes** | Button destination URL |

### 5.2 `footer`

```json
"footer": {
  "socials": {
    "x": "https://x.com/yourhandle",
    "github": "https://github.com/your-org"
  },
  "links": [
    {
      "header": "Company",
      "items": [
        { "label": "Blog", "href": "https://example.com/blog" },
        { "label": "Careers", "href": "https://example.com/careers" }
      ]
    }
  ]
}
```

#### `footer.socials` — Object with platform keys:

Valid keys: `x`, `website`, `facebook`, `youtube`, `discord`, `slack`, `github`, `linkedin`, `instagram`, `hacker-news`, `medium`, `telegram`, `twitter`, `x-twitter`, `earth-americas`, `bluesky`, `threads`, `reddit`, `podcast`

#### `footer.links` — Array of objects:

| Field | Type | Required | Description |
|---|---|---|---|
| `header` | string | No | Column header text |
| `items` | array of `{ label: string, href: string }` | **Yes** | Link items in the column |

### 5.3 `banner`

A site-wide banner displayed at the top of every page.

```json
"banner": {
  "content": "We just launched something new. [Learn more](https://example.com)",
  "dismissible": true
}
```

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `banner.content` | string | Yes (when using banner) | — | Banner text; supports basic MDX (links, bold, italic); custom components not supported |
| `banner.dismissible` | boolean | No | `false` | Show dismiss button so users can close the banner |

### 5.4 `interaction`

```json
"interaction": {
  "drilldown": true
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `interaction.drilldown` | boolean | Theme default | `true` = auto-navigate to first page when a group expands; `false` = only expand/collapse without navigating |

### 5.5 `contextual`

The contextual menu gives users quick access to AI tools and page actions. Appears in page header or table of contents sidebar. **Only available on preview and production deployments.**

```json
"contextual": {
  "options": ["copy", "view", "chatgpt", "claude"],
  "display": "header"
}
```

| Property | Type | Required | Default | Description |
|---|---|---|---|---|
| `contextual.options` | array | **Yes** | — | Actions in the menu; first item is the default action |
| `contextual.display` | `"header"` \| `"toc"` | No | `"header"` | Where to display the menu |

#### Built-in contextual option values:

| Value | Description |
|---|---|
| `"add-mcp"` | Add your MCP server to the user's configuration |
| `"aistudio"` | Send the current page to Google AI Studio |
| `"assistant"` | Open the AI assistant with current page as context |
| `"copy"` | Copy the current page as Markdown to clipboard |
| `"chatgpt"` | Send the current page to ChatGPT |
| `"claude"` | Send the current page to Claude |
| `"cursor"` | Install your hosted MCP server in Cursor |
| `"devin"` | Send the current page to Devin |
| `"devin-mcp"` | Install your hosted MCP server in Devin |
| `"grok"` | Send the current page to Grok |
| `"mcp"` | Copy your MCP server URL to clipboard |
| `"perplexity"` | Send the current page to Perplexity |
| `"view"` | View the current page as Markdown in a new tab |
| `"vscode"` | Install your hosted MCP server in VS Code |
| `"windsurf"` | Send the current page to Windsurf |

#### Custom contextual option object:

```json
{
  "title": "Send to My Tool",
  "description": "Open this page in My Tool",
  "icon": "rocket",
  "href": "https://mytool.com?url=$page"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | **Yes** | Display title |
| `description` | string | **Yes** | Description text |
| `icon` | string | No | Icon name, URL, path, or SVG |
| `href` | string \| object | **Yes** | Link destination; supports `$page`, `$path`, `$mcp` placeholders. When object: `{ base: string, query: [{ key, value }] }` |

### 5.6 `redirects`

```json
"redirects": [
  { "source": "/old-page", "destination": "/new-page" },
  { "source": "/temp-redirect", "destination": "/destination", "permanent": false }
]
```

Each item:

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `source` | string | **Yes** | — | Path to redirect from (e.g., `/old-page`) |
| `destination` | string | **Yes** | — | Path to redirect to (e.g., `/new-page`) |
| `permanent` | boolean | No | `true` | `true` = 308 redirect; `false` = 307 redirect |

### 5.7 `variables`

Global variables replaced at build time using `{{variableName}}` syntax.

```json
"variables": {
  "version": "2.0.0",
  "api-url": "https://api.example.com"
}
```

- Variable names: alphanumeric characters and hyphens only
- All referenced variables must be defined or the build fails
- Values are sanitized against XSS attacks
- Reference in content: `The current version is {{version}}.`

### 5.8 `metadata`

```json
"metadata": {
  "timestamp": true
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `metadata.timestamp` | boolean | `false` | When `true`, all pages display date last modified. Overridable per-page with `timestamp` frontmatter |

### 5.9 `errors`

```json
"errors": {
  "404": {
    "redirect": false,
    "title": "Page not found",
    "description": "The page you're looking for doesn't exist. [Go home](/)."
  }
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `errors.404.redirect` | boolean | `true` | Whether to auto-redirect to home on 404 |
| `errors.404.title` | string | — | Custom title for the 404 page |
| `errors.404.description` | string | — | Custom description; supports MDX formatting including links, bold, italic, and custom components |

### 5.10 `public`

```json
"public": true
```

| Property | Type | Description |
|---|---|---|
| `public` | boolean | Whether the documentation is publicly accessible by default |

---

## 6. Navigation System

The `navigation` object controls the full information architecture of your site. Choose one primary organizational pattern at the root level; other navigation elements nest within it.

### 6.1 Pages (simplest unit)

Each entry in `pages` arrays references the path to an MDX file (without extension).

```json
"navigation": {
  "pages": [
    "settings",
    "pages",
    "navigation"
  ]
}
```

### 6.2 Groups

Organize sidebar navigation into labeled sections.

```json
"navigation": {
  "groups": [
    {
      "group": "Getting started",
      "icon": "play",
      "pages": [
        "quickstart",
        {
          "group": "Editing",
          "expanded": false,
          "icon": "pencil",
          "pages": ["installation", "editor"]
        }
      ]
    },
    {
      "group": "Writing content",
      "icon": "notebook-text",
      "tag": "NEW",
      "pages": ["writing-content/page", "writing-content/text"]
    }
  ]
}
```

#### Group object fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `group` | string | **Yes** | Group display name |
| `pages` | array | **Yes** | Pages or nested groups |
| `icon` | string | No | Icon name, URL, or SVG |
| `iconType` | string | No | Font Awesome icon style |
| `tag` | string | No | Badge label next to group name |
| `root` | string | No | Path to a main page for the group; clicking the group title opens this page |
| `expanded` | boolean | No | Default expanded state for nested groups (only affects nested groups; top-level groups are always expanded) |
| `openapi` | string | No | Path to OpenAPI spec; auto-generates pages for all defined endpoints |

### 6.3 Tabs

Create distinct sections with separate URL paths and a horizontal top navigation bar.

```json
"navigation": {
  "tabs": [
    {
      "tab": "API reference",
      "icon": "square-terminal",
      "pages": ["api-reference/get", "api-reference/post"]
    },
    {
      "tab": "Blog",
      "icon": "newspaper",
      "href": "https://external-link.com/blog"
    }
  ]
}
```

#### Tab object fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `tab` | string | **Yes** | Tab display name |
| `icon` | string | No | Icon for the tab |
| `iconType` | string | No | Font Awesome icon style |
| `hidden` | boolean | No | Hide this tab |
| `href` | string (URI) | Conditional (required for external links) | External link URL |
| `pages` | array | Conditional | Pages in this tab |
| `groups` | array | No | Groups in this tab |
| `anchors` | array | No | Anchors in this tab |
| `menu` | array | No | Menu items in this tab |

#### Menus within Tabs

Add dropdown navigation items to a tab. Menu items can only contain groups, pages, and external links.

```json
{
  "tab": "Developer tools",
  "menu": [
    {
      "item": "API reference",
      "icon": "rocket",
      "groups": [
        {
          "group": "Core endpoints",
          "pages": ["api-reference/get", "api-reference/post"]
        }
      ]
    },
    {
      "item": "SDKs",
      "icon": "code",
      "description": "SDKs are used to interact with the API.",
      "pages": ["sdk/fetch", "sdk/create"]
    }
  ]
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `item` | string | **Yes** | Menu item display name |
| `icon` | string | No | Icon for the menu item |
| `description` | string | No | Description text |
| `pages` | array | Conditional | Pages in this menu item |
| `groups` | array | No | Groups in this menu item |

### 6.4 Anchors

Persistent navigation items at the top of the sidebar.

```json
"navigation": {
  "anchors": [
    {
      "anchor": "Documentation",
      "icon": "book-open",
      "pages": ["quickstart", "development"]
    },
    {
      "anchor": "Blog",
      "href": "https://external-link.com/blog"
    }
  ]
}
```

#### Anchor object fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `anchor` | string | **Yes** | Anchor display name |
| `icon` | string | No | Icon name |
| `iconType` | string | No | Font Awesome icon style |
| `color.light` | hex string | No | Icon color in light mode |
| `color.dark` | hex string | No | Icon color in dark mode |
| `hidden` | boolean | No | Hide this anchor |
| `href` | string (URI) | Conditional (required for external links) | External link URL |
| `pages` | array | Conditional | Pages in this anchor |
| `groups` | array | No | Groups in this anchor |

### 6.5 Global Anchors

Links that appear on all pages, regardless of which section the user is viewing.

```json
"navigation": {
  "global": {
    "anchors": [
      { "anchor": "Changelog", "icon": "list", "href": "/changelog" },
      { "anchor": "Blog", "icon": "pencil", "href": "https://mintlify.com/blog" }
    ]
  }
}
```

### 6.6 Products

Dedicated navigation divisions for organizing product-specific documentation.

```json
"navigation": {
  "products": [
    {
      "product": "Core API",
      "description": "Core API description",
      "icon": "api",
      "groups": [
        { "group": "Getting started", "pages": ["core-api/quickstart"] }
      ]
    },
    {
      "product": "Mobile SDK",
      "description": "Mobile SDK description",
      "icon": "smartphone",
      "href": "https://mobile-sdk-docs.example.com"
    }
  ]
}
```

#### Product object fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `product` | string | **Yes** | Product display name |
| `description` | string | No | Product description |
| `icon` | string | No | Product icon |
| `iconType` | string | No | Font Awesome icon style |
| `href` | string (URI) | Conditional (for external links) | External product link |
| `pages` | array | Conditional | Pages for this product |
| `groups` | array | No | Groups for this product |

### 6.7 Dropdowns

Expandable menus at the top of the sidebar navigation.

```json
"navigation": {
  "dropdowns": [
    {
      "dropdown": "Documentation",
      "icon": "book-open",
      "pages": ["quickstart", "development"]
    }
  ]
}
```

#### Dropdown object fields: same shape as anchors, replacing `anchor` with `dropdown`.

| Field | Type | Required | Description |
|---|---|---|---|
| `dropdown` | string | **Yes** | Dropdown display name |
| `icon` | string | No | Icon |
| `iconType` | string | No | Font Awesome icon style |
| `hidden` | boolean | No | Hide this dropdown |
| `href` | string (URI) | Conditional | External link URL |

### 6.8 Versions

Partition navigation into selectable versions.

```json
"navigation": {
  "versions": [
    {
      "version": "1.0.0",
      "groups": [{ "group": "Getting started", "pages": ["v1/overview"] }]
    },
    {
      "version": "2.0.0",
      "default": true,
      "tag": "Latest",
      "groups": [{ "group": "Getting started", "pages": ["v2/overview"] }]
    }
  ]
}
```

#### Version object fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | string (minLength: 1) | **Yes** | Version identifier (display name) |
| `default` | boolean | No | Set as default version (otherwise first in array is default) |
| `tag` | string | No | Badge label in version dropdown (e.g., "Latest", "Recommended", "Beta", "Deprecated") |
| `hidden` | boolean | No | Hide this version |
| `href` | string (URI) | Conditional | External link |
| Any navigation fields | — | No | `groups`, `pages`, `tabs`, `anchors`, etc. |

### 6.9 Languages

Partition navigation into selectable languages with language-specific configurations.

```json
"navigation": {
  "languages": [
    {
      "language": "en",
      "banner": { "content": "English banner content", "dismissible": true },
      "footer": { "socials": { "x": "https://x.com/mintlify" } },
      "navbar": {
        "links": [{ "label": "Docs", "href": "/en/docs" }],
        "primary": { "type": "button", "label": "Get Started", "href": "/en/quickstart" }
      },
      "groups": [{ "group": "Getting started", "pages": ["en/overview"] }]
    }
  ]
}
```

#### Language object fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `language` | string | **Yes** | Language code |
| `default` | boolean | No | Set as default language |
| `hidden` | boolean | No | Hide this language |
| `banner` | object | No | Language-specific banner config |
| `footer` | object | No | Language-specific footer config |
| `navbar` | object | No | Language-specific navbar config |
| Any navigation fields | — | No | `groups`, `pages`, `tabs`, etc. |

**Supported language codes:**

| Code | Language | Code | Language | Code | Language |
|---|---|---|---|---|---|
| `ar` | Arabic | `fr` | French | `pl` | Polish |
| `ca` | Catalan | `fr-CA` | French (Canada) | `pt` | Portuguese |
| `cn` | Chinese | `he` | Hebrew | `pt-BR` | Portuguese (Brazil) |
| `cs` | Czech | `hi` | Hindi | `ro` | Romanian |
| `de` | German | `hu` | Hungarian | `ru` | Russian |
| `en` | English | `id` | Indonesian | `sv` | Swedish |
| `es` | Spanish | `it` | Italian | `tr` | Turkish |
| — | — | `ja` / `jp` | Japanese | `uk` | Ukrainian |
| — | — | `ko` | Korean | `uz` | Uzbek |
| — | — | `lv` | Latvian | `vi` | Vietnamese |
| — | — | `nl` | Dutch | `zh` | Chinese |
| — | — | `no` | Norwegian | `zh-Hans` | Chinese Simplified |
| — | — | — | — | `zh-Hant` | Chinese Traditional |

### 6.10 Global Navigation Object

Top-level `navigation.global` elements appear on all pages across all locales.

```json
"navigation": {
  "global": {
    "tabs": [...],
    "anchors": [...],
    "dropdowns": [...],
    "languages": [...],
    "versions": [...],
    "products": [...]
  }
}
```

### 6.11 OpenAPI in Navigation

Integrate OpenAPI specs directly into navigation. Adding `openapi` to a navigation element without specifying pages auto-generates pages for **all endpoints**.

```json
"navigation": {
  "groups": [
    {
      "group": "API reference",
      "openapi": "/path/to/openapi-v1.json",
      "pages": [
        "overview",
        "GET /users",
        "POST /users",
        {
          "group": "Products",
          "openapi": "/path/to/openapi-v2.json",
          "pages": ["GET /products"]
        }
      ]
    }
  ]
}
```

### 6.12 Nesting Rules

- Choose **one** root-level parent pattern (tabs, groups, or dropdown)
- Nest other navigation elements within the primary pattern
- Each level can contain only one type of child element
- Example valid nesting: `tabs → anchors → groups → pages`
- Example invalid: `tabs` containing both `anchors` and `groups` at the same level

---

## 7. SEO & Search Settings

### 7.1 `description`

```json
"description": "Documentation for Example Co.'s API and developer platform."
```

A plain string describing your documentation site for SEO and AI indexing. Appears in search engine results. Also used by AI tools to understand your site's purpose.

### 7.2 `seo`

```json
"seo": {
  "indexing": "navigable",
  "metatags": {
    "og:site_name": "Example Co. Docs",
    "twitter:card": "summary_large_image"
  }
}
```

| Property | Type | Default | Description |
|---|---|---|---|
| `seo.indexing` | `"navigable"` \| `"all"` | `"navigable"` | `"navigable"` = index only pages in navigation; `"all"` = index every page including those not in navigation |
| `seo.metatags` | object (key-value string pairs) | — | Custom meta tags added to every page |

### 7.3 `search`

```json
"search": {
  "prompt": "Search the docs..."
}
```

| Property | Type | Description |
|---|---|---|
| `search.prompt` | string | Placeholder text in the search bar when empty |

### 7.4 `metadata`

(Documented in structure section above, but also relevant to SEO.)

```json
"metadata": {
  "timestamp": true
}
```

---

## 8. API Settings

All API-related settings live under the `api` key.

```json
"api": {
  "openapi": ["openapi/v1.json", "openapi/v2.json"],
  "playground": {
    "display": "interactive",
    "proxy": true
  },
  "params": {
    "expanded": "all"
  },
  "url": "full",
  "examples": {
    "languages": ["curl", "python", "javascript", "go"],
    "defaults": "required",
    "prefill": true,
    "autogenerate": true
  },
  "spec": {
    "download": true
  },
  "mdx": {
    "auth": {
      "method": "bearer",
      "name": "Authorization"
    },
    "server": "https://api.example.com"
  }
}
```

### 8.1 `api.openapi`

OpenAPI specification files for generating API reference pages.

| Form | Example |
|---|---|
| Single path | `"openapi": "openapi.json"` |
| Single URL | `"openapi": "https://api.example.com/openapi.json"` |
| Array of paths/URLs | `"openapi": ["openapi/v1.json", "openapi/v2.json"]` |
| Object with source and directory | `"openapi": { "source": "openapi.json", "directory": "api-reference" }` |

### 8.2 `api.asyncapi`

AsyncAPI specification files for event-driven API reference pages. Same format options as `api.openapi`.

### 8.3 `api.playground`

| Property | Type | Default | Options | Description |
|---|---|---|---|---|
| `api.playground.display` | string | `"interactive"` | `"interactive"`, `"simple"`, `"none"`, `"auth"` | Playground display mode; `"auth"` shows playground only to authenticated users |
| `api.playground.proxy` | boolean | `true` | — | Whether to route API requests through a proxy |

### 8.4 `api.params`

| Property | Type | Default | Options | Description |
|---|---|---|---|---|
| `api.params.expanded` | string | `"closed"` | `"all"`, `"closed"` | Whether to expand all parameters by default |

### 8.5 `api.url`

| Property | Type | Default | Description |
|---|---|---|---|
| `api.url` | `"full"` | Only shown when multiple base URLs exist | When set to `"full"`, always shows the complete base URL on every endpoint page |

### 8.6 `api.examples`

| Property | Type | Default | Description |
|---|---|---|---|
| `api.examples.languages` | array of string | — | Languages for autogenerated code snippets |
| `api.examples.defaults` | `"required"` \| `"all"` | `"all"` | Whether to include optional parameters in examples |
| `api.examples.prefill` | boolean | `false` | Whether to prefill playground fields with spec example values |
| `api.examples.autogenerate` | boolean | `true` | Whether to generate code samples from API specifications. When `false`, only manually-written code samples are shown |

### 8.7 `api.spec`

| Property | Type | Default | Description |
|---|---|---|---|
| `api.spec.download` | boolean | `false` | Show a download button for the OpenAPI spec on API reference pages |

### 8.8 `api.mdx`

Settings for API pages built from MDX files (rather than OpenAPI specs).

#### `api.mdx.auth`

| Property | Type | Options | Description |
|---|---|---|---|
| `api.mdx.auth.method` | string | `"bearer"`, `"basic"`, `"key"`, `"cobo"` | Authentication method |
| `api.mdx.auth.name` | string | — | Authentication parameter name |

#### `api.mdx.server`

| Property | Type | Description |
|---|---|---|
| `api.mdx.server` | string \| array of strings (URI) | Base URL(s) prepended to relative paths in page-level `api` frontmatter. Not used when frontmatter contains a full URL |

---

## 9. Integrations

All integrations are configured under the `integrations` key:

```json
"integrations": {
  "ga4": { "measurementId": "G-XXXXXXXXXX" }
}
```

### 9.1 Analytics Integrations

| Integration | Config Key | Required Field(s) | Notes |
|---|---|---|---|
| Adobe Analytics | `integrations.adobe` | `launchUrl` (string URI) | Launch URL for Adobe Analytics |
| Amplitude | `integrations.amplitude` | `apiKey` (string) | — |
| Microsoft Clarity | `integrations.clarity` | `projectId` (string) | Session recording and heatmaps |
| Fathom | `integrations.fathom` | `siteId` (string) | Privacy-friendly analytics |
| Google Analytics 4 | `integrations.ga4` | `measurementId` (string starting with `G`) | GA4 measurement ID |
| Google Tag Manager | `integrations.gtm` | `tagId` (string starting with `G`) | GTM container ID |
| Heap | `integrations.heap` | `appId` (string) | — |
| Hightouch | `integrations.hightouch` | `writeKey` (string) | Optional: `apiHost` (string) |
| Hotjar | `integrations.hotjar` | `hjid` (string), `hjsv` (string) | Both fields required |
| Koala | `integrations.koala` | `publicApiKey` (string, minLength: 2) | — |
| LogRocket | `integrations.logrocket` | `appId` (string) | Session replay |
| Mixpanel | `integrations.mixpanel` | `projectToken` (string) | — |
| Pirsch | `integrations.pirsch` | `id` (string) | Privacy-friendly analytics |
| Plausible | `integrations.plausible` | `domain` (string) | Optional: `server` (string) for self-hosted |
| PostHog | `integrations.posthog` | `apiKey` (string starting with `phc_`) | Optional: `apiHost` (URI), `sessionRecording` (boolean, default `false`) |
| Segment | `integrations.segment` | `key` (string) | Write key |

### 9.2 Chat & Support Integrations

| Integration | Config Key | Required Field(s) | Notes |
|---|---|---|---|
| Front Chat | `integrations.frontchat` | `snippetId` (string, minLength: 6) | — |
| Intercom | `integrations.intercom` | `appId` (string, minLength: 6) | — |

### 9.3 Data Enrichment Integrations

| Integration | Config Key | Required Field(s) | Notes |
|---|---|---|---|
| Clearbit | `integrations.clearbit` | `publicApiKey` (string) | Visitor data enrichment |

### 9.4 Platform Settings

| Integration | Config Key | Fields | Notes |
|---|---|---|---|
| Mintlify Telemetry | `integrations.telemetry` | `enabled` (boolean) | When `false`, feedback features are also disabled |
| Cookies | `integrations.cookies` | `key` (string), `value` (string) | Both optional |

### 9.5 Full Integrations Example

```json
"integrations": {
  "ga4": { "measurementId": "G-XXXXXXXXXX" },
  "posthog": {
    "apiKey": "phc_XXXXXXXXXX",
    "apiHost": "https://app.posthog.com",
    "sessionRecording": true
  },
  "intercom": { "appId": "abc12345" },
  "hotjar": { "hjid": "1234567", "hjsv": "6" },
  "plausible": {
    "domain": "docs.example.com",
    "server": "https://plausible.example.com"
  },
  "telemetry": { "enabled": true }
}
```

---

## 10. Page Frontmatter (MDX Metadata)

Every MDX page begins with YAML frontmatter enclosed by `---` at the top of the file. Frontmatter controls how the page appears and behaves.

```yaml
---
title: "About frontmatter"
description: "Frontmatter controls how your page appears and behaves"
sidebarTitle: "Frontmatter"
icon: "book"
iconType: "solid"
tag: "NEW"
mode: "wide"
timestamp: true
hidden: false
noindex: false
deprecated: false
---
```

### 10.1 Core Page Metadata

| Field | Type | Description |
|---|---|---|
| `title` | string | Page title in navigation and browser tabs. If omitted, generated from file path (dashes/underscores replaced with spaces, first letter capitalized) |
| `description` | string | Brief description shown under the title; improves SEO |
| `sidebarTitle` | string | Short title that displays in the sidebar (shorter than `title`) |
| `icon` | string | Icon to display; accepts: Font Awesome name, Lucide name, Tabler name, external URL, local file path |
| `iconType` | string | Font Awesome icon style only: `regular`, `solid`, `light`, `thin`, `sharp-solid`, `duotone`, `brands` |
| `tag` | string | Badge label displayed next to page title in sidebar |

### 10.2 Page Mode / Layout

The `mode` frontmatter field controls page layout:

| Value | Description | Theme Support |
|---|---|---|
| (unset) | Standard layout with sidebar and table of contents | All themes |
| `"wide"` | Hides the table of contents; extra horizontal space for pages without headings | All themes |
| `"custom"` | Blank canvas: removes all elements except top navbar (no sidebar, TOC, or footer) | All themes |
| `"frame"` | Similar to `custom` but keeps the sidebar navigation | Aspen, Almond, Luma, Sequoia |
| `"center"` | Removes sidebar and TOC, centers content | Mint, Linden, Willow, Maple |

### 10.3 Page Visibility and Indexing

| Field | Type | Description |
|---|---|---|
| `hidden` | boolean | `true` = removes page from sidebar navigation (still URL-accessible; not indexed by search engines). **Do not set to `false`** (undefined behavior). Remove field to make visible again |
| `noindex` | boolean | `true` = prevents search engines from indexing the page. Pages with `hidden: true` automatically get `noindex: true` |
| `deprecated` | boolean | `true` = displays a "deprecated" label next to the page title while keeping the page accessible |

### 10.4 Access Control

| Field | Type | Description |
|---|---|---|
| `groups` | array of string | Restrict page to users in specific groups. Users must belong to at least one listed group. Requires authentication to be configured |

### 10.5 API Pages

```yaml
---
openapi: "GET /endpoint"
---
```

Or for MDX-based API pages:
```yaml
---
api: "GET /endpoint"
---
```

### 10.6 External Links

```yaml
---
title: "npm Package"
url: "https://www.npmjs.com/package/mint"
---
```

The `url` frontmatter links directly to an external site from the navigation.

### 10.7 SEO Meta Tags (in Frontmatter)

```yaml
---
"twitter:image": "/images/social-preview.jpg"
"og:title": "Custom OG title"
---
```

Always wrap meta tags with colons in quotes. Mintlify automatically generates most SEO meta tags; use frontmatter to customize specific ones.

### 10.8 Search Keywords

```yaml
---
keywords: ['configuration', 'setup', 'getting started']
---
```

`keywords` array provides internal search keywords that don't appear in page content but help users discover the page via search.

### 10.9 Timestamp

```yaml
---
timestamp: true   # Always show timestamp even if global setting is false
timestamp: false  # Hide timestamp even if global setting is true
---
```

Overrides the global `metadata.timestamp` setting from `docs.json` for an individual page.

### 10.10 Custom Metadata

Any arbitrary YAML frontmatter is valid:

```yaml
---
product: "API"
version: "1.0.0"
---
```

---

## 11. Themes Reference

Mintlify provides nine built-in themes. Set with the required `theme` field in `docs.json`.

| Theme | Character | Best For |
|---|---|---|
| `mint` | Classic documentation with time-tested layouts and familiar navigation | General-purpose documentation |
| `maple` | Modern, clean aesthetics | AI products, SaaS |
| `palm` | Sophisticated, deeply customizable fintech theme | Enterprise documentation |
| `willow` | Stripped-back essentials | Distraction-free, minimalist docs |
| `linden` | Retro terminal vibes, monospace fonts | Developer tools, CLI docs |
| `almond` | Card-based organization with minimalist design | Intuitive navigation-heavy docs |
| `aspen` | Modern documentation for complex navigation and custom components | Large-scale, component-rich docs |
| `sequoia` | Minimal, elegant layouts for large-scale content | Content-focused documentation |
| `luma` | Clean, minimal design | Polished, refined documentation |

### Theme-specific mode support:

| Mode | Supported Themes |
|---|---|
| `wide` | All themes |
| `custom` | All themes |
| `frame` | Aspen, Almond, Luma, Sequoia |
| `center` | Mint, Linden, Willow, Maple |

---

## 12. Fonts Configuration

Fonts are configured under the `fonts` key in `docs.json`. Supports Google Fonts and self-hosted fonts.

### 12.1 Google Fonts (Simple)

```json
"fonts": {
  "family": "Inter"
}
```

Google Fonts family names load automatically — no `source` required.

### 12.2 Google Fonts (Heading/Body Split)

```json
"fonts": {
  "heading": {
    "family": "Playfair Display"
  },
  "body": {
    "family": "Inter"
  }
}
```

### 12.3 Self-Hosted (Local) Fonts

Place font files in your project directory and reference them:

```
your-project/
├── fonts/
│   ├── InterDisplay-Regular.woff2
│   └── InterDisplay-Bold.woff2
├── docs.json
```

```json
"fonts": {
  "heading": {
    "family": "InterDisplay",
    "source": "/fonts/InterDisplay-Bold.woff2",
    "format": "woff2",
    "weight": 700
  },
  "body": {
    "family": "InterDisplay",
    "source": "/fonts/InterDisplay-Regular.woff2",
    "format": "woff2",
    "weight": 400
  }
}
```

### 12.4 Externally Hosted Fonts

```json
"fonts": {
  "family": "Hubot Sans",
  "source": "https://mintlify-assets.b-cdn.net/fonts/Hubot-Sans.woff2",
  "format": "woff2",
  "weight": 400
}
```

### 12.5 Font Configuration Reference

| Property | Type | Required | Description |
|---|---|---|---|
| `fonts.family` | string | Yes (when using `fonts`) | Font family name (Google Fonts supported natively) |
| `fonts.weight` | number | No | Font weight (e.g., `400`, `700`). Variable fonts support fractional values like `550` |
| `fonts.source` | string (URI) | No | URL to a hosted font or path to a local font file. Not needed for Google Fonts |
| `fonts.format` | `"woff"` \| `"woff2"` | Required when using `fonts.source` | Font file format |
| `fonts.heading` | object | No | Override font for headings only (same fields: `family`, `weight`, `source`, `format`) |
| `fonts.body` | object | No | Override font for body text only (same fields: `family`, `weight`, `source`, `format`) |

---

## 13. Advanced: $ref Configuration Splitting

As `docs.json` grows, split it into smaller files using `$ref` references.

```json
// docs.json
{
  "$schema": "https://mintlify.com/docs.json",
  "theme": "mint",
  "name": "Acme Docs",
  "colors": { "primary": "#1a73e8" },
  "navigation": {
    "$ref": "./config/navigation.json"
  },
  "appearance": {
    "$ref": "./config/appearance.json",
    "strict": true
  }
}
```

```json
// config/navigation.json
[
  { "group": "Get started", "pages": ["index", "quickstart"] },
  { "group": "Guides", "pages": ["guides/first-steps"] }
]
```

### $ref Rules:

1. **Object resolution**: When `$ref` resolves to an object, sibling keys in the same block are merged on top (sibling keys take precedence)
2. **Array resolution**: When `$ref` resolves to a non-object (e.g., array), sibling keys are ignored
3. **Nested references**: Referenced files can contain their own `$ref` entries, resolved relative to that file
4. **Path constraints**: Paths must be relative and stay within the project root. Path traversal (e.g., `../../outside`) is not allowed
5. **Circular references**: Cause a build error
6. **Valid JSON only**: References must point to valid JSON files

---

## 14. Complete Example docs.json

```json
{
  "$schema": "https://mintlify.com/docs.json",

  // Required
  "theme": "maple",
  "name": "Example Co.",
  "colors": {
    "primary": "#3B82F6",
    "light": "#93C5FD",
    "dark": "#1D4ED8"
  },

  // Appearance & Branding
  "logo": {
    "light": "/logo/light.svg",
    "dark": "/logo/dark.svg",
    "href": "https://example.com"
  },
  "favicon": "/favicon.svg",
  "appearance": {
    "default": "system",
    "strict": false
  },
  "fonts": {
    "heading": {
      "family": "Playfair Display"
    },
    "body": {
      "family": "Inter"
    }
  },
  "icons": {
    "library": "lucide"
  },
  "background": {
    "decoration": "gradient",
    "color": {
      "light": "#F8FAFC",
      "dark": "#0F172A"
    }
  },
  "styling": {
    "eyebrows": "breadcrumbs",
    "codeblocks": {
      "theme": {
        "light": "github-light",
        "dark": "tokyo-night"
      }
    }
  },
  "thumbnails": {
    "appearance": "dark",
    "fonts": { "family": "Inter" }
  },

  // SEO
  "description": "Documentation for Example Co.'s API and developer platform.",
  "seo": {
    "indexing": "navigable",
    "metatags": {
      "og:site_name": "Example Co. Docs",
      "twitter:card": "summary_large_image"
    }
  },
  "search": {
    "prompt": "Search the docs..."
  },
  "metadata": {
    "timestamp": true
  },

  // Structure
  "navbar": {
    "links": [
      { "type": "github", "href": "https://github.com/your-org/your-repo" }
    ],
    "primary": {
      "type": "button",
      "label": "Get started",
      "href": "https://example.com/signup"
    }
  },
  "footer": {
    "socials": {
      "github": "https://github.com/your-org",
      "x": "https://x.com/yourhandle"
    },
    "links": [
      {
        "header": "Company",
        "items": [
          { "label": "Blog", "href": "https://example.com/blog" },
          { "label": "Careers", "href": "https://example.com/careers" }
        ]
      }
    ]
  },
  "banner": {
    "content": "New: Version 2.0 is live! [See what's new](/changelog).",
    "dismissible": true
  },
  "contextual": {
    "options": ["copy", "view", "claude", "chatgpt"],
    "display": "header"
  },
  "interaction": {
    "drilldown": false
  },
  "redirects": [
    { "source": "/old-page", "destination": "/new-page" }
  ],
  "variables": {
    "version": "2.0.0",
    "api-url": "https://api.example.com"
  },
  "errors": {
    "404": {
      "redirect": false,
      "title": "Page not found",
      "description": "The page you're looking for doesn't exist. [Go home](/)."
    }
  },

  // API
  "api": {
    "openapi": ["openapi/v1.json", "openapi/v2.json"],
    "playground": {
      "display": "interactive",
      "proxy": true
    },
    "params": { "expanded": "all" },
    "url": "full",
    "examples": {
      "languages": ["curl", "python", "javascript", "go"],
      "defaults": "required",
      "prefill": true,
      "autogenerate": true
    },
    "spec": { "download": true }
  },

  // Integrations
  "integrations": {
    "ga4": { "measurementId": "G-XXXXXXXXXX" },
    "posthog": {
      "apiKey": "phc_XXXXXXXXXX",
      "sessionRecording": false
    },
    "intercom": { "appId": "abc12345" },
    "telemetry": { "enabled": true }
  },

  // Navigation
  "navigation": {
    "global": {
      "anchors": [
        { "anchor": "Changelog", "icon": "list", "href": "/changelog" }
      ]
    },
    "tabs": [
      {
        "tab": "Documentation",
        "icon": "book-open",
        "groups": [
          {
            "group": "Getting started",
            "icon": "play",
            "pages": ["quickstart", "installation"]
          }
        ]
      },
      {
        "tab": "API Reference",
        "icon": "square-terminal",
        "openapi": "/openapi/v2.json"
      }
    ]
  }
}
```

---

## Appendix: Page Frontmatter Full Reference Table

| Field | Type | Description |
|---|---|---|
| `title` | string | Page title in navigation and browser tabs |
| `description` | string | Description shown under title; improves SEO |
| `sidebarTitle` | string | Short sidebar navigation title |
| `icon` | string | Icon (Font Awesome / Lucide / Tabler name, URL, or file path) |
| `iconType` | string | FA style: `regular`, `solid`, `light`, `thin`, `sharp-solid`, `duotone`, `brands` |
| `tag` | string | Badge label in sidebar next to page title |
| `mode` | string | Layout: unset (default), `wide`, `custom`, `frame`, `center` |
| `hidden` | boolean | Remove from sidebar (still accessible by URL) |
| `noindex` | boolean | Prevent search engine indexing |
| `deprecated` | boolean | Show "deprecated" label |
| `groups` | array of string | Access control: restrict to named user groups |
| `openapi` | string | OpenAPI endpoint: `"METHOD /path"` |
| `api` | string | MDX API endpoint: `"METHOD /path"` |
| `url` | string (URI) | External link target for navigation |
| `timestamp` | boolean | Override global timestamp setting |
| `keywords` | array of string | Internal search keywords (not visible in content) |
| `"og:*"` / `"twitter:*"` | string | Any SEO meta tag as a quoted key-value pair |
| Custom fields | any YAML | Arbitrary metadata (e.g., `product`, `version`) |

---

*Analysis compiled from 11 official Mintlify documentation pages and the live JSON schema at https://mintlify.com/docs.json — March 21, 2026*
