export interface DocsConfig {
  $schema?: string;
  theme?: string;
  name: string;
  colors: {
    primary: string;
    light?: string;
    dark?: string;
  };
  logo?: {
    light?: string;
    dark?: string;
  };
  favicon?: string;
  navigation: {
    tabs: NavTab[];
  };
  navbar?: {
    links?: NavbarLink[];
  };
  footer?: {
    socials?: Record<string, string>;
  };
  appearance?: {
    default?: 'light' | 'dark' | 'system';
  };
  search?: {
    prompt?: string;
  };
}

export interface NavTab {
  tab: string;
  groups: NavGroup[];
}

export interface NavGroup {
  group: string;
  pages: string[];
}

export interface NavbarLink {
  label: string;
  url: string;
}

export interface PageFrontmatter {
  title: string;
  description?: string;
  sidebarTitle?: string;
  icon?: string;
}

export interface PageData {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
  rawContent: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
