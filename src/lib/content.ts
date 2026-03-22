import type { PageFrontmatter, PageData, TocItem } from './types';

const pageCache = new Map<string, PageData>();

// Import all content files at build time
const contentModules = import.meta.glob('/public/content/**/*.mdx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function getContentFromModules(slug: string): string | null {
  // Try various path patterns
  const paths = [
    `/public/content/${slug}.mdx`,
  ];
  for (const path of paths) {
    if (contentModules[path]) {
      return contentModules[path];
    }
  }
  return null;
}

export async function loadPage(slug: string): Promise<PageData | null> {
  if (pageCache.has(slug)) {
    return pageCache.get(slug)!;
  }

  // First try embedded content (works in production)
  const embedded = getContentFromModules(slug);
  if (embedded) {
    const { frontmatter, content } = parseFrontmatter(embedded);
    const page: PageData = { slug, frontmatter, content, rawContent: embedded };
    pageCache.set(slug, page);
    return page;
  }

  // Fallback to fetch (works in dev)
  try {
    const res = await fetch(`./content/${slug}.mdx`);
    if (!res.ok) return null;
    const rawContent = await res.text();
    const { frontmatter, content } = parseFrontmatter(rawContent);
    const page: PageData = { slug, frontmatter, content, rawContent };
    pageCache.set(slug, page);
    return page;
  } catch {
    return null;
  }
}

function parseFrontmatter(raw: string): { frontmatter: PageFrontmatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return {
      frontmatter: { title: 'Untitled' },
      content: raw,
    };
  }

  const yamlStr = match[1];
  const content = match[2];
  const frontmatter: Record<string, string> = {};

  for (const line of yamlStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      frontmatter[key] = value;
    }
  }

  return {
    frontmatter: {
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description,
      sidebarTitle: frontmatter.sidebarTitle,
      icon: frontmatter.icon,
    },
    content,
  };
}

export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    items.push({ id, text, level });
  }

  return items;
}

export function getAllPageSlugs(config: { navigation: { tabs: Array<{ groups: Array<{ pages: string[] }> }> } }): string[] {
  const slugs: string[] = [];
  for (const tab of config.navigation.tabs) {
    for (const group of tab.groups) {
      for (const page of group.pages) {
        slugs.push(page);
      }
    }
  }
  return slugs;
}

export function getAdjacentPages(
  config: { navigation: { tabs: Array<{ groups: Array<{ pages: string[] }> }> } },
  currentSlug: string
): { prev: string | null; next: string | null } {
  const allSlugs = getAllPageSlugs(config);
  const idx = allSlugs.indexOf(currentSlug);
  return {
    prev: idx > 0 ? allSlugs[idx - 1] : null,
    next: idx < allSlugs.length - 1 ? allSlugs[idx + 1] : null,
  };
}

export function getBreadcrumbs(
  config: { navigation: { tabs: Array<{ tab: string; groups: Array<{ group: string; pages: string[] }> }> } },
  currentSlug: string
): Array<{ label: string; slug?: string }> {
  for (const tab of config.navigation.tabs) {
    for (const group of tab.groups) {
      if (group.pages.includes(currentSlug)) {
        return [
          { label: tab.tab },
          { label: group.group },
        ];
      }
    }
  }
  return [];
}
