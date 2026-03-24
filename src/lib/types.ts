export interface DocsConfig {
  $schema?: string;
  theme?: string;
  name: string;
  colors: {
    primary: string;
    light?: string;
    dark?: string;
  };
  logo?: string | {
    light?: string;
    dark?: string;
    href?: string;
  };
  favicon?: string | {
    light?: string;
    dark?: string;
  };
  navigation: {
    tabs: NavTab[];
  };
  navbar?: {
    links?: NavbarLink[];
    primary?: {
      type: string;
      label?: string;
      href: string;
    };
  };
  footer?: {
    socials?: Record<string, string>;
  };
  appearance?: {
    default?: 'light' | 'dark' | 'system';
  };
  banner?: {
    content: string;
    dismissible?: boolean;
  };
  search?: {
    prompt?: string;
  };
  redirects?: Redirect[];
}

export interface Redirect {
  source: string;
  destination: string;
}

export interface NavAnchor {
  icon?: string;
  title: string;
  url: string;
  color?: string;
}

export interface NavTab {
  tab: string;
  groups: NavGroup[];
  anchors?: NavAnchor[];
}

export interface NavGroup {
  group: string;
  pages: (string | NavGroup)[];
  icon?: string;
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
