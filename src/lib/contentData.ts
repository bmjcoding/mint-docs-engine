// Embedded content data - in production, these would be loaded from files
// This allows the docs engine to work when deployed to static hosting

const contentMap: Record<string, string> = {};

// This function loads content from embedded data or from fetch
export function getContentMap(): Record<string, string> {
  return contentMap;
}

export function setContent(slug: string, content: string): void {
  contentMap[slug] = content;
}

export function hasContent(slug: string): boolean {
  return slug in contentMap;
}
