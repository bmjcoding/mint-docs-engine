# Mintlify Rendered HTML Analysis

> Source: Live HTML extracted from agentskills.io and mintlify.com/docs via curl (March 2026).
> Focus: Actual rendered DOM structure and CSS class names, not descriptions.

---

## Table of Contents

1. [Page-Level Structure (agentskills.io/home)](#1-page-level-structure)
2. [Navbar](#2-navbar)
3. [Sidebar](#3-sidebar)
4. [Content Area](#4-content-area)
5. [Table of Contents (TOC)](#5-table-of-contents-toc)
6. [Footer](#6-footer)
7. [Code Blocks](#7-code-blocks-agentskillsiospecification)
8. [Tables](#8-tables)
9. [Cards and CardGroup](#9-cards-and-cardgroup)
10. [Callouts (Note, Warning, Tip, etc.)](#10-callouts)
11. [Steps](#11-steps)
12. [Tabs](#12-tabs)
13. [Accordions](#13-accordions)
14. [API Playground](#14-api-playground)
15. [Key CSS Class Reference](#15-key-css-class-reference)

---

## 1. Page-Level Structure

**URL:** https://agentskills.io/home

### Body → Root Wrapper

```html
<body>
  <div>  <!-- next.js root -->
  <div class="relative antialiased text-gray-500 dark:text-gray-400">  <!-- docs theme wrapper -->
    <!-- data-docs-theme="mint" -->
    <div data-docs-theme="mint" class="max-lg:contents lg:flex lg:w-full">
      <div id="navbar" ...>
      <div id="sidebar" ...>
      <div id="content-area" ...>
        <header id="header" ...>
        <div id="content" ...>  <!-- MDX content -->
      <div id="content-side-layout" ...>
        <div id="table-of-contents-layout" ...>
          <div id="table-of-contents" ...>
      <footer id="footer" ...>
    <div id="chat-assistant-sheet" ...>
```

### Top-Level ID Map

| Element ID | Tag | CSS Classes (key ones) | Purpose |
|---|---|---|---|
| `navbar` | `div` | `z-30 fixed lg:sticky top-0 w-full peer is-not-custom is-not-center is-not-wide is-not-frame` | Fixed top navigation bar |
| `navbar-transition` | `div` | `absolute w-full h-full backdrop-blur flex-none transition-colors duration-500 border-b border-gray-500/5` | Navbar background/blur layer |
| `sidebar` | `div` | `z-20 hidden lg:block fixed bottom-0 right-auto w-[18rem]` | Left sidebar (18rem wide) |
| `sidebar-content` | `div` | `absolute inset-0 z-10 stable-scrollbar-gutter overflow-auto pr-8 pb-10` | Scrollable sidebar content |
| `navigation-items` | `div` | *(none)* | Sidebar nav items container |
| `content-area` | `div` | `relative grow box-border flex-col w-full mx-auto px-1 lg:pl-[23.7rem] lg:-ml-12 xl:w-[calc(100%-28rem)]` | Main content column (left-padded for sidebar) |
| `content-side-layout` | `div` | `hidden xl:flex self-start sticky xl:flex-col max-w-[28rem] z-[21] h-[calc(100vh-8rem)] top-[calc(6.5rem-var(--sidenav-move-up,0px))]` | Right TOC column wrapper |
| `table-of-contents-layout` | `div` | `z-10 hidden xl:flex box-border max-h-full pl-10 w-[19rem]` | TOC layout container |
| `table-of-contents` | `div` | `text-gray-600 text-sm leading-6 w-[16.5rem] overflow-y-auto space-y-2 pb-4 -mt-10 pt-10` | The actual TOC |
| `content` | `div` | `mdx-content @container/columns-container relative mt-8 mb-14 prose prose-gray dark:prose-invert [contain:inline-size] isolate` | MDX content area |
| `pagination` | `div` | `px-0.5 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200` | Prev/Next page links |
| `footer` | `footer` | `flex gap-12 justify-between pt-10 border-t border-gray-100 sm:flex dark:border-gray-800/50 pb-28` | Page footer |
| `chat-assistant-sheet` | `div` | `flex flex-col overflow-hidden shrink-0 relative h-full bg-background-light dark:bg-background-dark chat-assistant-sheet` | AI chat sidebar |

---

## 2. Navbar

**Source:** `id="navbar"` on agentskills.io

```html
<div id="navbar"
  class="z-30 fixed lg:sticky top-0 w-full peer
         is-not-custom is-not-center is-not-wide is-not-frame">

  <!-- Blur background layer -->
  <div id="navbar-transition"
    class="absolute w-full h-full backdrop-blur flex-none transition-colors duration-500
           border-b border-gray-500/5 dark:border-gray-300/[0.06]
           data-[is-opaque=true]:bg-background-light
           data-[is-opaque=true]:supports-backdrop-blur:bg-background-light/95
           data-[is-opaque=true]:dark:bg-background-dark/75
           data-[is-opaque=false]:supports-backdrop-blur:bg-background-light/60
           data-[is-opaque=false]:dark:bg-transparent"
    data-is-opaque="false">
  </div>

  <!-- Content row -->
  <div class="z-10 mx-auto relative">
    <div class="relative">
      <div class="flex items-center lg:px-7 h-14 min-w-0 mx-4 lg:mx-0">

        <!-- Logo + left nav links -->
        <div class="h-full relative flex-1 flex items-center gap-x-4 min-w-0 lg:border-none">
          <div class="flex-1 flex items-center gap-x-4">
            <a href="..." class="select-none" data-slot="context-menu-trigger">
              <!-- Logo: agentskills shows just text logo -->
              <!-- Mintlify shows: -->
              <img class="nav-logo w-auto relative object-contain shrink-0 block dark:hidden h-6" alt="light logo" .../>
              <img class="nav-logo w-auto relative object-contain shrink-0 hidden dark:block h-6" alt="dark logo" .../>
            </a>
            <!-- Tabs in navbar (Mintlify only) -->
            <div class="hidden lg:flex items-center gap-x-2"></div>
          </div>
        </div>

        <!-- Right: search, AI button, GitHub, theme toggle -->
        <div class="flex items-center gap-4">
          <!-- Search button -->
          <!-- AI Ask button -->
          <!-- GitHub link (nav) -->
          <nav class="text-sm">
            <ul class="flex space-x-6 items-center">
              <li class="cursor-pointer max-w-full flex lg:hidden">...</li>
              <li class="cursor-pointer max-w-full hidden lg:flex">agentskills/agentskills</li>
            </ul>
          </nav>
          <!-- Theme toggle -->
        </div>
      </div>

      <!-- Nav tabs (Mintlify docs has tabs below logo row) -->
      <div class="nav-tabs h-full flex text-sm gap-x-6">
        <a class="link nav-tabs-item group relative h-full gap-2 flex items-center font-medium
                  hover:text-gray-800 dark:hover:text-gray-300
                  text-gray-800 dark:text-gray-200
                  [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]"
           href="/docs">Documentation
          <!-- Active indicator -->
          <div class="absolute bottom-0 h-[1.5px] w-full left-0 bg-primary dark:bg-primary-light hidden"></div>
        </a>
      </div>
    </div>
  </div>
</div>
```

**Key navbar CSS classes:**
- `navbar` — structural ID
- `is-not-custom`, `is-not-center`, `is-not-wide`, `is-not-frame` — variant modifier classes (peer-based)
- `nav-logo` — logo image
- `nav-tabs` — horizontal tabs container
- `nav-tabs-item` — individual tab link

---

## 3. Sidebar

**Source:** `id="sidebar"` → `id="sidebar-content"` → `id="navigation-items"`

```html
<div id="sidebar" class="z-20 hidden lg:block fixed bottom-0 right-auto w-[18rem]">
  <div id="sidebar-content"
    class="absolute inset-0 z-10 stable-scrollbar-gutter overflow-auto pr-8 pb-10">

    <div class="relative lg:text-sm lg:leading-6">
      <!-- Gradient mask at top -->
      <div class="sticky top-0 h-8 z-10 bg-gradient-to-b from-background-light dark:from-background-dark"></div>

      <div id="navigation-items">

        <!-- Top-level items (no group header) -->
        <ul class="sidebar-group">
          <li class="relative scroll-m-4 first:scroll-m-20"
              data-active="true"
              data-title="Overview"
              id="/home">
            <!-- ACTIVE item -->
            <a class="group flex items-start pr-3 py-1.5 cursor-pointer gap-x-3
                      text-left break-words hyphens-auto rounded-xl w-full
                      outline-offset-[-1px]
                      bg-primary/10 text-primary
                      [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]
                      dark:text-primary-light dark:bg-primary-light/10"
               href="/home" style="padding-left:1rem">
              <div class="flex-1 flex items-start space-x-2.5">
                <div class="break-words [word-break:break-word]">Overview</div>
              </div>
            </a>
          </li>
        </ul>

        <ul class="sidebar-group">
          <li class="relative scroll-m-4 first:scroll-m-20"
              data-title="What are skills?"
              id="/what-are-skills">
            <!-- INACTIVE item -->
            <a class="group flex items-start pr-3 py-1.5 cursor-pointer gap-x-3
                      text-left rounded-xl w-full outline-offset-[-1px]
                      hover:bg-gray-600/5 dark:hover:bg-gray-200/5
                      text-gray-700 hover:text-gray-900
                      dark:text-gray-400 dark:hover:text-gray-300"
               href="/what-are-skills" style="padding-left:1rem">
              <div class="flex-1 flex items-start space-x-2.5">
                <div class="break-words [word-break:break-word]">What are skills?</div>
              </div>
            </a>
          </li>
        </ul>

        <!-- Group with header -->
        <div class="mt-6 lg:mt-8">
          <div class="sidebar-group-header flex items-center gap-2.5 pl-4 mb-3.5 lg:mb-2.5
                      font-semibold text-gray-900 dark:text-gray-200">
            <h5 id="sidebar-title">For skill creators</h5>
          </div>
          <ul class="sidebar-group space-y-px" id="sidebar-group">
            <li class="relative scroll-m-4 first:scroll-m-20"
                data-title="Quickstart"
                id="/skill-creation/quickstart">
              <a class="group flex items-start pr-3 py-1.5 cursor-pointer gap-x-3
                        text-left break-words hyphens-auto rounded-xl w-full
                        outline-offset-[-1px]
                        hover:bg-gray-600/5 dark:hover:bg-gray-200/5
                        text-gray-700 hover:text-gray-900
                        dark:text-gray-400 dark:hover:text-gray-300"
                 href="/skill-creation/quickstart" style="padding-left:1rem">
                <div class="flex-1 flex items-start space-x-2.5">
                  <div class="break-words [word-break:break-word]">Quickstart</div>
                </div>
              </a>
            </li>
            <!-- more items... -->
          </ul>
        </div>

      </div>
    </div>
  </div>
</div>
```

**Key sidebar CSS classes:**
- `sidebar-group` — `<ul>` wrapping each group
- `sidebar-group-header` — section label container
- `sidebar-title` — `<h5>` inside group header
- Active nav item: `bg-primary/10 text-primary dark:text-primary-light dark:bg-primary-light/10 [text-shadow:-0.2px_0_0_currentColor,0.2px_0_0_currentColor]`
- Inactive nav item: `hover:bg-gray-600/5 dark:hover:bg-gray-200/5 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300`
- `li[data-active="true"]` — marks the current page
- `li[data-title="..."]` — page title for the nav item
- `li[id="/path"]` — item identified by its href path

---

## 4. Content Area

**Source:** `id="content-area"` → `id="content"`

```html
<div id="content-area"
  class="relative grow box-border flex-col w-full mx-auto px-1
         lg:pl-[23.7rem] lg:-ml-12
         xl:w-[calc(100%-28rem)]">

  <!-- Page header (above MDX content) -->
  <header id="header" class="relative leading-none">
    <div class="mt-0.5 space-y-2.5">
      <div class="flex flex-col sm:flex-row items-start sm:items-center relative gap-2 min-w-0">
        <!-- Page title: h1 rendered here -->
      </div>
      <!-- Page description -->
      <div class="mt-2 text-lg prose prose-gray dark:prose-invert [&>*]:[overflow-wrap:anywhere]">
        <p>...</p>
      </div>
    </div>
    <!-- Copy page / breadcrumbs button -->
    <div id="page-context-menu" class="items-center shrink-0 min-w-[156px] justify-end ml-auto sm:flex hidden">
      <button>Copy page</button>
    </div>
  </header>

  <!-- MDX Content -->
  <div id="content"
    class="mdx-content @container/columns-container relative mt-8 mb-14
           prose prose-gray dark:prose-invert
           [contain:inline-size] isolate"
    data-page-title="Overview"
    data-page-href="/home">
    <!-- All MDX-rendered content lives here -->
  </div>

  <!-- Pagination -->
  <div id="pagination"
    class="px-0.5 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200">
    <!-- Previous / Next page links -->
  </div>

</div>
```

**Key content area CSS classes:**
- `mdx-content` — the content root
- `@container/columns-container` — container query context for CardGroup columns
- `prose prose-gray dark:prose-invert` — Tailwind Typography plugin
- `[contain:inline-size]` — CSS containment
- `isolate` — stacking context

### Heading Structure

Inside `#content`, headings are rendered as:

```html
<h2 class="flex whitespace-pre-wrap group font-semibold" id="why-agent-skills">
  <!-- Anchor link icon (appears on hover) -->
  <div class="absolute" tabindex="-1">
    <a aria-label="Navigate to header"
       class="-ml-10 flex items-center opacity-0 border-0
              group-hover:opacity-100 focus:opacity-100 focus:outline-0 group/link"
       href="#why-agent-skills">
      ​<!-- chain link SVG -->
      <div class="w-6 h-6 rounded-md flex items-center justify-center shadow-sm
                  text-gray-400 dark:text-white/50 dark:bg-background-dark
                  dark:brightness-[1.35] dark:ring-1 dark:hover:brightness-150
                  bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25
                  hover:ring-gray-400/60 dark:hover:ring-white/20
                  group-focus/link:border-2 group-focus/link:border-primary
                  dark:group-focus/link:border-primary-light">
        <svg>...</svg>
      </div>
    </a>
  </div>
  <span class="cursor-pointer">Why Agent Skills?</span>
</h2>
```

---

## 5. Table of Contents (TOC)

**Source:** `id="table-of-contents"` (right sidebar)

```html
<!-- Layout wrapper (sticky right column) -->
<div id="content-side-layout"
  class="hidden xl:flex self-start sticky xl:flex-col max-w-[28rem] z-[21]
         h-[calc(100vh-8rem)]
         top-[calc(6.5rem-var(--sidenav-move-up,0px))]">

  <div id="table-of-contents-layout"
    class="z-10 hidden xl:flex box-border max-h-full pl-10 w-[19rem]">

    <div id="table-of-contents"
      class="text-gray-600 text-sm leading-6 w-[16.5rem] overflow-y-auto
             space-y-2 pb-4 -mt-10 pt-10">

      <!-- "On this page" header -->
      <button class="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2
                     hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer">
        <svg>...</svg>
        <span>On this page</span>
      </button>

      <!-- TOC items list -->
      <div>
        <ul class="toc" id="table-of-contents-content">
          <li class="toc-item relative" data-depth="0">
            <a class="break-words py-1 block hover:text-gray-900
                      dark:text-gray-400 dark:hover:text-gray-300"
               href="#why-agent-skills">
              Why Agent Skills?
            </a>
          </li>
          <!-- nested item: data-depth="1" -->
          <li class="toc-item relative" data-depth="1">
            <a class="break-words py-1 block hover:text-gray-900
                      dark:text-gray-400 dark:hover:text-gray-300"
               href="#sub-heading">Sub heading</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

**Key TOC CSS classes:**
- `toc` — `<ul>` containing TOC items
- `toc-item` — `<li>` for each heading
- `data-depth="0"` / `data-depth="1"` — nesting level (used for indentation)
- Active TOC item gets additional styling (applied via JS scroll tracking)

---

## 6. Footer

```html
<footer id="footer"
  class="flex gap-12 justify-between pt-10 border-t border-gray-100
         sm:flex dark:border-gray-800/50 pb-28">
  <div class="flex items-center justify-between">
    <div class="sm:flex">
      <a class="group flex items-baseline gap-1 text-sm text-gray-400 dark:text-gray-500
                hover:text-gray-600 dark:hover:text-gray-300 text-nowrap"
         href="https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral&utm_source=agent-skills"
         rel="noreferrer" target="_blank">
        <span>Powered by</span>
        <svg><!-- Mintlify logo --></svg>
      </a>
    </div>
  </div>
</footer>
```

---

## 7. Code Blocks (agentskills.io/specification)

### Outer wrapper (code-block)

Code blocks come in two variants — with a filename header (tabbed) and without.

#### Variant 1: No filename/tab header

```html
<div class="code-block mt-5 mb-8 not-prose rounded-2xl relative group min-w-0
            print:print-color-exact text-gray-950 dark:text-gray-50
            codeblock-light border border-gray-950/10 dark:border-white/10
            dark:twoslash-dark bg-transparent dark:bg-transparent"
     language="text"
     numberoflines="7">

  <!-- Floating action buttons (top right) -->
  <div class="absolute top-3 right-4 flex items-center gap-1.5 print:hidden"
       data-floating-buttons="true">

    <!-- Report incorrect code button -->
    <button aria-label="Report incorrect code"
            class="h-[26px] w-[26px] flex items-center justify-center rounded-md
                   backdrop-blur peer group/code-snippet-feedback-button"
            id="code-snippet-feedback-button">
      <svg class="w-4 h-4 text-gray-400 group-hover/code-snippet-feedback-button:text-gray-500
                  dark:text-white/40 dark:group-hover/code-snippet-feedback-button:text-white/60">
        ...
      </svg>
    </button>
    <!-- Tooltip -->
    <div class="absolute -top-3 left-1/2 transform whitespace-nowrap
                -translate-x-1/2 -translate-y-1/2
                peer-hover:opacity-100 opacity-0
                text-tooltip-foreground rounded-lg px-1.5 py-0.5 text-xs
                bg-primary-dark">Report incorrect code</div>

    <!-- Copy button -->
    <button aria-label="Copy the contents from the code block"
            class="h-[26px] w-[26px] flex items-center justify-center rounded-md
                   backdrop-blur peer group/copy-button"
            data-testid="copy-code-button">
      <svg class="w-4 h-4 text-gray-400 group-hover/copy-button:text-gray-500
                  dark:text-white/40 dark:group-hover/copy-button:text-white/60">...</svg>
    </button>

    <!-- Ask AI button -->
    <button aria-label="Ask AI"
            class="h-[26px] w-[26px] flex items-center justify-center rounded-md
                   backdrop-blur peer group/ask-ai-button"
            data-chat-payload-element-id="lang-mdx-code-_Note_..."
            id="ask-ai-code-block-button">
      <svg class="w-4 h-4 text-gray-400 group-hover/ask-ai-button:text-gray-500
                  dark:text-white/40 dark:group-hover/ask-ai-button:text-white/60">...</svg>
    </button>
  </div>

  <!-- Code content area -->
  <div class="w-0 min-w-full max-w-full py-3.5 px-4 h-full
              dark:bg-codeblock relative text-sm leading-6
              children:!my-0 children:!shadow-none children:!bg-transparent
              transition-[height] duration-300 ease-in-out
              code-block-background
              [&_*]:ring-0 [&_*]:outline-0 [&_*]:focus:ring-0 [&_*]:focus:outline-0
              rounded-2xl bg-white overflow-x-auto
              scrollbar-thin scrollbar-thumb-rounded
              scrollbar-thumb-black/15 hover:scrollbar-thumb-black/20 active:scrollbar-thumb-black/20
              dark:scrollbar-thumb-white/20 dark:hover:scrollbar-thumb-white/25 dark:active:scrollbar-thumb-white/25"
       data-component-part="code-block-root">

    <!-- Shiki-rendered code -->
    <div class="font-mono whitespace-pre leading-6">
      <pre class="shiki shiki-themes github-light-default dark-plus"
           language="text"
           style="background-color:#ffffff;--shiki-dark-bg:#0B0C0E;color:#1f2328;--shiki-dark:#D4D4D4">
        <code language="text" numberoflines="7">
          <span class="line"><span>skill-name/</span></span>
          <span class="line"><span>├── SKILL.md</span></span>
          ...
        </code>
      </pre>
    </div>

  </div>
</div>
```

#### Variant 2: With filename/tab header

```html
<div class="code-block mt-5 mb-8 not-prose rounded-2xl relative group min-w-0
            print:print-color-exact text-gray-950
            bg-gray-50 dark:bg-white/5 dark:text-gray-50
            codeblock-light border border-gray-950/10 dark:border-white/10
            dark:twoslash-dark p-0.5"
     language="markdown"
     numberoflines="4">

  <!-- Filename/tab header -->
  <div class="flex text-gray-400 text-xs rounded-t-[14px] leading-6 font-medium pl-4 pr-2.5 py-1"
       data-component-part="code-block-header">
    <div class="flex-grow-0 flex items-center gap-1.5 text-gray-700 dark:text-gray-300 min-w-0"
         data-component-part="code-block-header-filename">
      <span class="truncate min-w-0" title="SKILL.md">SKILL.md</span>
    </div>
    <!-- Action buttons on right -->
    <div class="flex-1 flex items-center justify-end gap-1.5 print:hidden">
      <!-- Same report/copy/ask-ai buttons as above -->
    </div>
  </div>

  <!-- Code area (same structure as above) -->
  <div class="w-0 min-w-full max-w-full py-3.5 px-4 ...
              code-block-background rounded-xt ..."
       data-component-part="code-block-root">
    ...
  </div>
</div>
```

**Note:** `rounded-xt` is a custom variant (top corners only for tabbed variant).

### Key code block CSS classes:
- `code-block` — outer wrapper class
- `codeblock-light` — light theme variant flag
- `dark:twoslash-dark` — dark mode twoslash (TypeScript hover info)
- `code-block-background` — inner scrollable code area
- `shiki shiki-themes github-light-default dark-plus` — syntax highlighter classes on `<pre>`
- `.line` — each line in the code
- `data-component-part="code-block-root"` — inner scroll container
- `data-component-part="code-block-header"` — filename tab bar
- `data-component-part="code-block-header-filename"` — filename label
- `data-floating-buttons="true"` — action button row

### Inline code

```html
<code class="">SKILL.md</code>
```
Inline `<code>` has no special class; styling comes from Tailwind Typography prose.

---

## 8. Tables

**Source:** agentskills.io/specification

```html
<!-- Table wrapper hierarchy -->
<div id="content" class="mdx-content ...">
  <div class="px-[var(--page-padding)] grow max-w-none table">
    <table class="m-0 min-w-full w-full max-w-none table
                  [&_td]:min-w-[150px]
                  [&_th]:text-left
                  [&_td[data-numeric]]:tabular-nums">
      <thead>
        <tr>
          <th>Field</th>
          <th>Required</th>
          <th>Constraints</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>name</code></td>
          <td>Yes</td>
          <td>Max 64 characters...</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Key table CSS classes:**
- Table wrapper div: `px-[var(--page-padding)] grow max-w-none table`
- `<table>`: `m-0 min-w-full w-full max-w-none table [&_td]:min-w-[150px] [&_th]:text-left [&_td[data-numeric]]:tabular-nums`
- No additional custom classes on `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`

---

## 9. Cards and CardGroup

**Source:** https://mintlify.com/docs/components/cards

### CardGroup (rendered as `columns` + `card-group`)

```html
<div class="columns prose dark:prose-invert grid max-w-none gap-4
            sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]
            @[0px]/columns-container:grid-cols-1
            @sm/columns-container:grid-cols-[repeat(var(--cols),minmax(0,1fr))]
            columns card-group dark:prose-dark gap-y-0"
     style="--cols:2">
  <!-- Child Card elements -->
</div>
```

Key: `--cols:2` CSS custom property controls column count. Container queries (`@[0px]/columns-container` and `@sm/columns-container`) make it responsive.

### Card — Standard (clickable/linked)

```html
<div class="card block font-normal group relative my-2 ring-2 ring-transparent
            rounded-2xl bg-white dark:bg-background-dark
            border border-gray-950/10 dark:border-white/10
            overflow-hidden w-full cursor-pointer
            hover:!border-primary dark:hover:!border-primary-light"
     role="link"
     tabindex="0">

  <!-- Content container -->
  <div class="px-6 py-5 relative" data-component-part="card-content-container">

    <!-- Arrow icon (top-right, hidden by default, shown on hover) -->
    <div class="absolute text-gray-400 dark:text-gray-500
                group-hover:text-primary dark:group-hover:text-primary-light
                top-5 right-5 hidden"
         id="card-link-arrow-icon">
      <svg class="lucide lucide-arrow-up-right w-4 h-4">...</svg>
    </div>

    <!-- Icon -->
    <div class="h-6 w-6 fill-gray-800 dark:fill-gray-100 text-gray-800 dark:text-gray-100"
         data-component-part="card-icon">
      <!-- SVG icon via CSS mask -->
      <svg class="h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"
           style="-webkit-mask-image:url(...);mask-image:url(...)">
      </svg>
    </div>

    <!-- Title -->
    <h2 class="not-prose font-semibold text-base text-gray-800 dark:text-white mt-4"
        contenteditable="false"
        data-component-part="card-title">
      Card title
    </h2>

    <!-- Body content -->
    <div class="prose mt-1 font-normal text-base leading-6 text-gray-600 dark:text-gray-400"
         data-component-part="card-content">
      <span data-as="p">Card description text.</span>
    </div>

  </div>
</div>
```

### Card — Horizontal (no link, horizontal layout)

```html
<div class="card block font-normal group relative my-2 ring-2 ring-transparent
            rounded-2xl bg-white dark:bg-background-dark
            border border-gray-950/10 dark:border-white/10
            overflow-hidden w-full">

  <div class="px-6 py-5 relative flex items-center gap-x-4"
       data-component-part="card-content-container">

    <div class="h-6 w-6 fill-gray-800 dark:fill-gray-100 text-gray-800 dark:text-gray-100"
         data-component-part="card-icon">
      <svg ...></svg>
    </div>

    <div class="w-full">
      <h2 class="not-prose font-semibold text-base text-gray-800 dark:text-white"
          contenteditable="false"
          data-component-part="card-title">Horizontal card</h2>
      <div class="prose font-normal text-base text-gray-600 dark:text-gray-400 leading-6 mt-0"
           data-component-part="card-content">
        <span data-as="p">This is an example of a horizontal card.</span>
      </div>
    </div>
  </div>
</div>
```

### Card — Image

```html
<div class="card block font-normal group relative my-2 ring-2 ring-transparent
            rounded-2xl bg-white dark:bg-background-dark
            border border-gray-950/10 dark:border-white/10
            overflow-hidden w-full">

  <!-- Image at top, full width -->
  <img alt="yosemite"
       class="w-full object-cover object-center not-prose"
       data-component-part="card-image"
       src="https://mintlify-assets.b-cdn.net/yosemite.jpg"/>

  <div class="px-6 py-5 relative" data-component-part="card-content-container">
    <div class="w-full">
      <h2 class="not-prose font-semibold text-base text-gray-800 dark:text-white"
          contenteditable="false"
          data-component-part="card-title">Image card</h2>
      <div class="prose mt-1 font-normal text-base leading-6 text-gray-600 dark:text-gray-400"
           data-component-part="card-content">
        <span data-as="p">This is an example of a card with an image.</span>
      </div>
    </div>
  </div>
</div>
```

**Key card CSS classes:**
- `card` — outer card class
- `card-group` — CardGroup wrapper (also has `columns` class)
- `columns` — grid layout wrapper
- `data-component-part="card-content-container"` — inner padding container
- `data-component-part="card-icon"` — icon wrapper
- `data-component-part="card-title"` — title h2
- `data-component-part="card-content"` — body text
- `data-component-part="card-image"` — top image
- `id="card-link-arrow-icon"` — arrow icon (linked cards)
- Linked cards: `role="link"`, `cursor-pointer`, `hover:!border-primary`
- Non-linked: no `role="link"`, no hover border

---

## 10. Callouts

**Source:** https://mintlify.com/docs/components/callouts

All callouts share the same base structure but vary in `data-callout-type` and color classes.

### Note (blue)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border border-blue-200 bg-blue-50
            dark:border-blue-900 dark:bg-blue-600/20"
     data-callout-type="note">

  <svg class="size-4 text-blue-800 dark:text-blue-300">...</svg>

  <div class="text-sm prose dark:prose-invert min-w-0 w-full
              [&_kbd]:bg-background-light dark:[&_kbd]:bg-background-dark
              [&_code]:!text-current [&_kbd]:!text-current
              [&_a]:!text-current [&_a]:border-current
              [&_strong]:!text-current
              text-blue-800 dark:text-blue-300"
       data-component-part="callout-content">
    This adds a note in the content
  </div>
</div>
```

### Warning (yellow)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border border-yellow-200 bg-yellow-50
            dark:border-yellow-900 dark:bg-yellow-600/20
            [&_[data-component-part='callout-icon']]:mt-px"
     data-callout-type="warning">

  <svg class="flex-none size-5 text-yellow-800 dark:text-yellow-300">...</svg>

  <div class="... text-yellow-800 dark:text-yellow-300"
       data-component-part="callout-content">
    This raises a warning to watch out for
  </div>
</div>
```

### Info (neutral/gray)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border border-neutral-200 bg-neutral-50
            dark:border-neutral-700 dark:bg-white/10"
     data-callout-type="info">

  <svg class="flex-none size-5 text-neutral-800 dark:text-neutral-300">...</svg>

  <div class="... text-neutral-800 dark:text-neutral-300"
       data-component-part="callout-content">
    This draws attention to important information
  </div>
</div>
```

### Tip (green)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border border-green-200 bg-green-50
            dark:border-green-900 dark:bg-green-600/20
            [&_[data-component-part='callout-icon']]:mt-px"
     data-callout-type="tip">

  <!-- No SVG shown (icon may be from Lucide via CSS mask) -->

  <div class="... text-green-800 dark:text-green-300"
       data-component-part="callout-content">
    This suggests a helpful tip
  </div>
</div>
```

### Check (green, same as Tip)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border border-green-200 bg-green-50
            dark:border-green-900 dark:bg-green-600/20"
     data-callout-type="check">

  <div class="... text-green-800 dark:text-green-300"
       data-component-part="callout-content">
    This brings us a checked status
  </div>
</div>
```

### Danger (red)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border border-red-200 bg-red-50
            dark:border-red-900 dark:bg-red-600/20"
     data-callout-type="danger">

  <svg class="flex-none size-4 text-red-800 dark:text-red-300">...</svg>

  <div class="... text-red-800 dark:text-red-300"
       data-component-part="callout-content">
    This is a danger callout
  </div>
</div>
```

### Custom Callout (using CSS variables)

```html
<div class="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3
            border bg-transparent
            dark:border-[var(--callout-border-color,#71717a4d)]
            dark:bg-[var(--callout-bg-color,#7171711a)]"
     data-callout-type="callout">

  <svg class="size-4 !m-0 shrink-0">...</svg>

  <div class="... text-[var(--callout-text-color)] dark:text-[var(--dark-callout-text-color)]"
       data-component-part="callout-content">
    This is a custom callout
  </div>
</div>
```

**Callout color map:**

| Type | Border | Background | Text | Dark border | Dark bg |
|---|---|---|---|---|---|
| `note` | `border-blue-200` | `bg-blue-50` | `text-blue-800` | `dark:border-blue-900` | `dark:bg-blue-600/20` |
| `warning` | `border-yellow-200` | `bg-yellow-50` | `text-yellow-800` | `dark:border-yellow-900` | `dark:bg-yellow-600/20` |
| `info` | `border-neutral-200` | `bg-neutral-50` | `text-neutral-800` | `dark:border-neutral-700` | `dark:bg-white/10` |
| `tip` | `border-green-200` | `bg-green-50` | `text-green-800` | `dark:border-green-900` | `dark:bg-green-600/20` |
| `check` | `border-green-200` | `bg-green-50` | `text-green-800` | `dark:border-green-900` | `dark:bg-green-600/20` |
| `danger` | `border-red-200` | `bg-red-50` | `text-red-800` | `dark:border-red-900` | `dark:bg-red-600/20` |

**Key callout CSS classes:**
- `callout` — outer class
- `data-callout-type="note|warning|tip|info|check|danger|callout"` — type attribute
- `data-component-part="callout-content"` — text content div
- `data-component-part="callout-icon"` — icon element (when using CSS mask icons)

---

## 11. Steps

**Source:** https://mintlify.com/docs/components/steps

```html
<!-- Steps container -->
<div class="steps ml-3.5 mt-10 mb-6" role="list">

  <!-- Individual step -->
  <div class="step group/step step-container relative flex items-start pb-5"
       id=""
       role="listitem">

    <!-- Vertical connecting line -->
    <div class="absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem]
                bg-gray-200/70 dark:bg-white/10"
         contenteditable="false"
         data-component-part="step-line">
    </div>

    <!-- (Last step line has gradient fade) -->
    <!-- <div class='absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem]
                    bg-transparent bg-gradient-to-b from-gray-200 dark:from-white/10
                    via-80% to-transparent
                    group-has-[[data-component-part="step-content"]:empty]/step:hidden'
              data-component-part="step-line"> -->

    <!-- Step number circle -->
    <div class="absolute ml-[-13px] py-2"
         contenteditable="false"
         data-component-part="step-number">
      <div class="relative size-7 shrink-0 rounded-full
                  bg-gray-50 dark:bg-white/10
                  text-xs text-gray-900 dark:text-gray-50
                  font-semibold flex items-center justify-center">
        <div>1</div>
        <!-- Anchor link (appears on hover) -->
        <div class="absolute" data-component-part="step-number-anchor-link">
          <a aria-label="Navigate to header"
             class="flex items-center opacity-0 border-0"
             href="#">
            <div class="w-6 h-6 flex items-center justify-center">
              <svg>...</svg>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- Step content (text area, offset right from number) -->
    <div class="w-full overflow-hidden pl-8 pr-px">
      <p class="mt-2 font-semibold prose dark:prose-invert text-gray-900 dark:text-gray-200"
         contenteditable="false"
         data-component-part="step-title">
        First Step
      </p>
      <div class="prose dark:prose-invert"
           data-component-part="step-content">
        <span data-as="p">These are instructions or content that only pertain to the first step.</span>
      </div>
    </div>

  </div>

  <!-- Repeat for step 2, 3, etc. -->
</div>
```

**Key Steps CSS classes:**
- `steps` — outer container (also `role="list"`)
- `step` — individual step (also `role="listitem"`)
- `step-container` — same element, secondary class
- `group/step` — Tailwind group with named scope
- `data-component-part="step-line"` — vertical connecting line
- `data-component-part="step-number"` — circle number element
- `data-component-part="step-number-anchor-link"` — hover anchor
- `data-component-part="step-title"` — step heading `<p>`
- `data-component-part="step-content"` — step body

---

## 12. Tabs

**Source:** https://mintlify.com/docs/components/tabs

```html
<!-- Tabs container (likely a div wrapping tablist + panels) -->

<!-- Tab list -->
<ul role="tablist" class="...">
  <!-- Active tab -->
  <li aria-controls="panel-first-tab-0"
      aria-selected="true"
      class="cursor-pointer"
      id="first-tab"
      role="tab"
      tabindex="0">
    <div class="flex text-sm items-center gap-1.5 leading-6 font-semibold whitespace-nowrap
                pt-3 pb-2.5 -mb-px max-w-max border-b
                text-primary dark:text-primary-light border-current"
         data-active="true"
         data-component-part="tab-button"
         data-testid="tab-First tab">
      First tab
    </div>
  </li>

  <!-- Inactive tab (with icon) -->
  <li aria-controls="panel-second-tab-1"
      aria-selected="false"
      class="cursor-pointer"
      id="second-tab"
      role="tab"
      tabindex="-1">
    <div class="flex text-sm items-center gap-1.5 leading-6 font-semibold whitespace-nowrap
                pt-3 pb-2.5 -mb-px max-w-max border-b
                text-gray-900 border-transparent
                hover:border-gray-300
                dark:text-gray-200 dark:hover:border-gray-700"
         data-active="false"
         data-component-part="tab-button"
         data-testid="tab-Second tab">
      <!-- Tab icon via CSS mask -->
      <svg class="h-4 w-4 shrink-0 bg-gray-900 dark:bg-gray-200 tab-icon"
           style="-webkit-mask-image:url(...);mask-image:url(...)">
      </svg>
      Second tab
    </div>
  </li>

  <!-- Inactive tab (no icon) -->
  <li aria-controls="panel-third-tab-2"
      aria-selected="false"
      class="cursor-pointer"
      id="third-tab"
      role="tab"
      tabindex="-1">
    <div class="flex text-sm items-center gap-1.5 leading-6 font-semibold whitespace-nowrap
                pt-3 pb-2.5 -mb-px max-w-max border-b
                text-gray-900 border-transparent
                hover:border-gray-300
                dark:text-gray-200 dark:hover:border-gray-700"
         data-active="false"
         data-component-part="tab-button"
         data-testid="tab-Third tab">
      Third tab
    </div>
  </li>
</ul>

<!-- Tab panel -->
<div id="panel-first-tab-0" role="tabpanel" aria-labelledby="first-tab">
  <!-- Tab content -->
</div>
```

**Key Tab CSS classes:**
- `cursor-pointer` — on each `<li role="tab">`
- `data-component-part="tab-button"` — inner div with visual styling
- `data-active="true|false"` — active state
- `data-testid="tab-{name}"` — test identifier
- Active tab: `text-primary dark:text-primary-light border-current` (colored bottom border)
- Inactive tab: `text-gray-900 border-transparent hover:border-gray-300 dark:text-gray-200 dark:hover:border-gray-700`
- Tab icon: `tab-icon` class on SVG + CSS mask for icon rendering
- `aria-controls`, `aria-selected`, `aria-labelledby` — full ARIA implementation

---

## 13. Accordions

**Source:** https://mintlify.com/docs/components/accordions

### Basic Accordion

```html
<details class="accordion border-standard rounded-2xl mb-3 overflow-hidden
                bg-background-light dark:bg-codeblock cursor-default">

  <summary aria-controls="i-am-an-accordion accordion children"
           aria-expanded="false"
           class="relative not-prose flex flex-row items-center content-center
                  w-full cursor-pointer list-none
                  [&::-webkit-details-marker]:hidden
                  py-4 px-5 space-x-2
                  hover:bg-gray-100 hover:dark:bg-gray-800
                  rounded-t-xl"
           data-component-part="accordion-button">

    <!-- Anchor offset for deep linking -->
    <div class="absolute -top-[8rem]" id="i-am-an-accordion"></div>

    <!-- Caret icon (rotates when open) -->
    <div class="mr-0.5" data-component-part="accordion-caret-right">
      <svg class="h-3 w-3 transition bg-gray-700 dark:bg-gray-400 duration-75"
           style="-webkit-mask-image:url(caret-right.svg);mask-image:url(caret-right.svg)">
      </svg>
    </div>

    <!-- Title -->
    <div class="leading-tight text-left w-full"
         contenteditable="false"
         data-component-part="accordion-title-container">
      <p class="m-0 font-medium text-gray-900 dark:text-gray-200"
         data-component-part="accordion-title">
        I am an Accordion.
      </p>
    </div>

  </summary>

  <!-- Expanded content -->
  <div id="i-am-an-accordion accordion children" class="...">
    <!-- Body content lives here -->
  </div>

</details>
```

### Accordion with Icon

```html
<details class="accordion border-standard rounded-2xl mb-3 overflow-hidden
                bg-background-light dark:bg-codeblock cursor-default">

  <summary ... data-component-part="accordion-button">
    <!-- Caret -->
    <div data-component-part="accordion-caret-right">...</div>

    <!-- Icon (before title) -->
    <div class="h-4 w-4 fill-gray-800 dark:fill-gray-100 text-gray-800 dark:text-gray-100"
         data-component-part="accordion-icon">
      <svg class="w-4 h-4 bg-gray-800 dark:bg-gray-100"
           style="-webkit-mask-image:url(...);mask-image:url(...)">
      </svg>
    </div>

    <!-- Title -->
    <div class="leading-tight text-left w-full" data-component-part="accordion-title-container">
      <p class="m-0 font-medium text-gray-900 dark:text-gray-200"
         data-component-part="accordion-title">
        Advanced features
      </p>
    </div>
  </summary>

</details>
```

**Key Accordion CSS classes:**
- `accordion` — outer `<details>` class
- `border-standard` — standard border style
- `data-component-part="accordion-button"` — on `<summary>`
- `data-component-part="accordion-caret-right"` — rotating caret icon
- `data-component-part="accordion-title-container"` — title wrapper div
- `data-component-part="accordion-title"` — title `<p>`
- `data-component-part="accordion-icon"` — optional icon before title
- `[&::-webkit-details-marker]:hidden` — hides default browser `<details>` triangle
- Open state: Mintlify handles open/close via `<details>` native behavior + CSS transitions
- `hover:bg-gray-100 hover:dark:bg-gray-800` on summary for hover state
- Deep link anchor: `<div class="absolute -top-[8rem]" id="{slug}"></div>`

---

## 14. API Playground

**Source:** https://mintlify.com/docs/api-playground/overview

The API playground overview page is itself a documentation page (not the live playground). The actual interactive playground is generated per-endpoint from OpenAPI specs.

### Frame component (used on API playground overview page)

```html
<div>
  <div class="frame p-2 not-prose relative bg-gray-50/50 rounded-2xl overflow-hidden
              dark:bg-gray-800/25 print:print-color-exact"
       data-name="frame">

    <!-- Grid background pattern -->
    <div class="absolute inset-0 bg-grid-neutral-200/20
                [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]
                dark:bg-grid-white/5
                dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]
                print:print-color-exact"
         style="background-position:10px 10px">
    </div>

    <!-- Image/content wrapper -->
    <div class="relative rounded-xl overflow-hidden flex justify-center">
      <picture class="contents">
        <img class="object-contain block dark:hidden"
             alt="API playground for the trigger an update endpoint."
             data-optimize="true"
             data-path="images/playground/API-playground-light.png"
             src="https://mintcdn.com/mintlify/.../API-playground-light.png"
             .../>
        <img class="object-contain hidden dark:block"
             alt="..."
             src="https://mintcdn.com/mintlify/.../API-playground-dark.png"
             .../>
      </picture>
    </div>

    <!-- Border overlay -->
    <div class="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl
                dark:border-white/5">
    </div>

  </div>
</div>
```

**Key API/Frame CSS classes:**
- `frame` — Frame component wrapper
- `data-name="frame"` — component identifier
- `bg-grid-neutral-200/20` — grid background pattern (CSS background utility)
- `dark:bg-grid-white/5` — dark mode grid pattern

The live API playground (per-endpoint) is a React/Next.js component not present in the static HTML of the overview page. It's rendered client-side when visiting API reference pages like `/docs/api/...`.

---

## 15. Key CSS Class Reference

### Mintlify-specific classes (not standard Tailwind utilities)

| Class | Element | Purpose |
|---|---|---|
| `mdx-content` | `#content div` | Root MDX content container |
| `card` | `div` | Card component |
| `card-group` | `div` | CardGroup grid wrapper |
| `columns` | `div` | Also applied to CardGroup, handles grid layout |
| `callout` | `div` | Callout component |
| `accordion` | `details` | Accordion component |
| `border-standard` | `details` | Standard border styling for accordions |
| `steps` | `div` | Steps container |
| `step` | `div` | Individual step |
| `step-container` | `div` | Same as step, secondary class |
| `sidebar-group` | `ul` | Sidebar navigation group |
| `sidebar-group-header` | `div` | Sidebar section label |
| `sidebar-title` | `h5` | Sidebar group title text |
| `toc` | `ul` | Table of contents list |
| `toc-item` | `li` | TOC list item |
| `code-block` | `div` | Code block outer wrapper |
| `codeblock-light` | `div` | Light theme code block flag |
| `code-block-background` | `div` | Code scrollable area |
| `nav-logo` | `img` | Navbar logo image |
| `nav-tabs` | `div` | Horizontal navbar tab group |
| `nav-tabs-item` | `a` | Individual navbar tab |
| `tab-icon` | `svg` | Icon inside a tab button |
| `link` | `a` | Styled hyperlink (in nav and prose) |
| `chat-assistant-sheet` | `div` | AI chat overlay panel |
| `chat-assistant-sheet-content` | `div` | Chat message list area |
| `frame` | `div` | Frame component (image wrapper with background) |
| `stable-scrollbar-gutter` | `div` | Prevents layout shift from scrollbar |
| `is-not-custom` | `div` | Navbar modifier (no custom styling) |
| `is-not-center` | `div` | Navbar modifier (not centered layout) |
| `is-not-wide` | `div` | Navbar modifier (not wide layout) |
| `is-not-frame` | `div` | Navbar modifier (not frame layout) |
| `not-prose` | many | Opts element out of Tailwind Typography prose styles |

### `data-component-part` attribute values

| Value | Element | Purpose |
|---|---|---|
| `card-content-container` | `div` | Card inner padding wrapper |
| `card-icon` | `div` | Card icon container |
| `card-title` | `h2` | Card title |
| `card-content` | `div` | Card body text |
| `card-image` | `img` | Card top image |
| `callout-content` | `div` | Callout text content |
| `callout-icon` | element | Callout icon |
| `accordion-button` | `summary` | Accordion trigger |
| `accordion-caret-right` | `div` | Accordion caret icon |
| `accordion-title-container` | `div` | Accordion title wrapper |
| `accordion-title` | `p` | Accordion title text |
| `accordion-icon` | `div` | Optional accordion icon |
| `tab-button` | `div` | Tab button inner div |
| `step-line` | `div` | Vertical connector line between steps |
| `step-number` | `div` | Step number circle |
| `step-number-anchor-link` | `div` | Hover anchor on step number |
| `step-title` | `p` | Step heading |
| `step-content` | `div` | Step body content |
| `code-block-root` | `div` | Inner code scrollable area |
| `code-block-header` | `div` | Filename/tab bar on code block |
| `code-block-header-filename` | `div` | Filename label in header |

### CSS Custom Properties Used

| Property | Default Value | Purpose |
|---|---|---|
| `--cols` | `2` | Number of columns in CardGroup |
| `--page-padding` | *(set globally)* | Page horizontal padding |
| `--sidenav-move-up` | `0px` | TOC vertical offset animation |
| `--assistant-sheet-width` | `0px` | Chat assistant panel width |
| `--callout-border-color` | `#71717a4d` | Custom callout border color |
| `--callout-bg-color` | `#7171711a` | Custom callout background color |
| `--callout-text-color` | *(set per callout)* | Custom callout text color |
| `--dark-callout-text-color` | *(set per callout)* | Dark mode custom callout text |

### Icon rendering pattern (CSS mask)

Mintlify renders icons as colored SVG masks rather than inline SVG `fill`:

```html
<svg class="h-6 w-6 bg-primary dark:bg-primary-light !m-0 shrink-0"
     style="-webkit-mask-image:url(https://d3gk2c5xim1je2.cloudfront.net/lucide/v0.545.0/icon-name.svg);
            -webkit-mask-repeat:no-repeat;
            -webkit-mask-position:center;
            mask-image:url(https://d3gk2c5xim1je2.cloudfront.net/lucide/v0.545.0/icon-name.svg);
            mask-repeat:no-repeat;
            mask-position:center;
            mask-size:100%">
</svg>
```

The icon color is controlled by the `bg-*` class (since the element's background shows through the mask). The CDN path is `https://d3gk2c5xim1je2.cloudfront.net/lucide/v0.545.0/{icon-name}.svg`.

Solid icons use a different CDN path: `https://d3gk2c5xim1je2.cloudfront.net/v7.1.0/solid/{icon-name}.svg`

### Shiki syntax highlighting

Code blocks use [Shiki](https://shiki.style/) for server-side syntax highlighting:
- Light theme: `github-light-default`
- Dark theme: `dark-plus`
- Applied as: `class="shiki shiki-themes github-light-default dark-plus"`
- Colors injected as CSS custom properties: `style="background-color:#ffffff;--shiki-dark-bg:#0B0C0E;color:#1f2328;--shiki-dark:#D4D4D4"`
- Each token gets a `style="color:..."` with `--shiki-dark:...` for dark mode variant

---

*Analysis extracted from live HTML at agentskills.io and mintlify.com/docs — March 2026.*
