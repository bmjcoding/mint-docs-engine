import { useState, useEffect, useRef } from 'react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import { useTheme } from '@/hooks/useTheme';
import { Search, Sun, Moon, Monitor, Github, ExternalLink, Menu } from 'lucide-react';
import type { NavAnchor } from '@/lib/types';

interface NavbarProps {
  activeTabIdx: number;
  onTabChange: (idx: number) => void;
  onSearchOpen: () => void;
  onMobileMenuOpen?: () => void;
  anchors?: NavAnchor[];
}

export default function Navbar({ activeTabIdx, onTabChange, onSearchOpen, onMobileMenuOpen, anchors }: NavbarProps) {
  const config = useDocsConfig();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpaque, setIsOpaque] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsOpaque(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navRef.current) {
      const height = navRef.current.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--navbar-height', `${height}px`);
    }
  }, [anchors, activeTabIdx]);

  const tabs = config.navigation.tabs;

  return (
    <div
      ref={navRef}
      id="navbar"
      className="z-50 fixed lg:sticky top-0 w-full"
    >
      {/* Blur background layer */}
      <div
        id="navbar-transition"
        className={`absolute w-full h-full backdrop-blur flex-none transition-colors duration-500 pointer-events-none ${isOpaque
          ? 'bg-background-light/95 dark:bg-background-dark/75'
          : 'bg-background-light/60 dark:bg-transparent'
        }`}
        data-is-opaque={isOpaque ? 'true' : 'false'}
      />

      {/* Content */}
      <div className="z-10 relative">

        {/* ── Row 1: Top bar ── */}
        <div className="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 lg:px-10 xl:px-[var(--layout-inset)] h-[60px] w-full">

            {/* Logo */}
            <a
              href={typeof config.logo === 'object' && config.logo?.href ? config.logo.href : '#/'}
              className="select-none flex-shrink-0 mr-2"
            >
              {config.logo ? (
                typeof config.logo === 'string' ? (
                  <img src={config.logo} alt={config.name} className="h-6" />
                ) : (
                  <>
                    {config.logo.light && <img src={config.logo.light} alt={config.name} className="h-7 dark:hidden" />}
                    {config.logo.dark && <img src={config.logo.dark} alt={config.name} className="h-7 hidden dark:block" />}
                    {(!config.logo.light && !config.logo.dark) && (
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-[18px] tracking-tight font-serif">{config.name}</span>
                    )}
                  </>
                )
              ) : (
                <span className="font-medium text-gray-900 dark:text-gray-100 text-[18px] tracking-tight font-serif">{config.name}</span>
              )}
            </a>

            {/* Mobile hamburger — visible only < lg */}
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 -ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center: Search + Ask AI */}
            <div className="hidden sm:flex flex-1 items-center justify-center gap-2">
              <button
                onClick={onSearchOpen}
                className="flex items-center gap-2 h-9 rounded-xl px-3.5 w-[340px] text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors bg-gray-100 dark:bg-[#09090b] border border-gray-200 dark:border-[#141416]"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate whitespace-nowrap min-w-0">Search...</span>
                <kbd className="hidden md:flex h-5 items-center justify-center rounded px-1.5 font-sans text-sm font-medium text-gray-400 dark:text-gray-500">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={onSearchOpen}
                className="flex items-center gap-1.5 h-9 rounded-xl px-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-[#141416]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="w-4 h-4 shrink-0"><g fill="currentColor"><path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259,.342-.474s-.138-.406-.342-.474Z" fill="currentColor" stroke="none" /><polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></g></svg>
                <span>Ask AI</span>
              </button>
            </div>

            {/* Search — mobile icon */}
            <button
              onClick={onSearchOpen}
              className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Anchor links from active tab — shown in top bar */}
            {anchors && anchors.length > 0 && (
              <div className="hidden lg:flex items-center gap-4">
                {anchors.map((anchor, idx) => {
                  const isExternal = anchor.url.startsWith('http');
                  return (
                    <a
                      key={idx}
                      href={anchor.url}
                      target={isExternal ? '_blank' : '_self'}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors whitespace-nowrap"
                      style={anchor.color ? { color: anchor.color } : {}}
                    >
                      {anchor.title}
                      {isExternal && <ExternalLink className="w-3 h-3 opacity-60" />}
                    </a>
                  );
                })}
              </div>
            )}

            {/* Navbar links (e.g. GitHub) */}
            {config.navbar?.links?.map((link, i) => {
              const isExternal = link.url.startsWith('http');
              return (
                <a
                  key={i}
                  href={link.url}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {link.label === 'GitHub' ? (
                    <Github className="w-5 h-5" />
                  ) : (
                    <span>{link.label}</span>
                  )}
                </a>
              );
            })}

            {/* Navbar primary CTA */}
            {config.navbar?.primary && (
              <a
                href={config.navbar.primary.href}
                target={config.navbar.primary.href.startsWith('http') ? '_blank' : '_self'}
                rel={config.navbar.primary.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hidden md:flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-black dark:bg-white dark:text-black hover:opacity-80 transition-opacity shadow-sm border border-transparent dark:border-gray-300"
              >
                {config.navbar.primary.label || 'Get Started'}
              </a>
            )}

            {/* Theme toggle */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {themeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[90]" onClick={() => setThemeMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-[100] py-1">
                    {[
                      { mode: 'light' as const, icon: Sun, label: 'Light' },
                      { mode: 'dark' as const, icon: Moon, label: 'Dark' },
                      { mode: 'system' as const, icon: Monitor, label: 'System' },
                    ].map(({ mode, icon: Icon, label }) => (
                      <button
                        key={mode}
                        onClick={() => { setTheme(mode); setThemeMenuOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${theme === mode
                          ? 'text-black dark:text-white bg-gray-50 dark:bg-white/5'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>
          {/* Divider that starts at content edge */}
          <div className="ml-4 lg:ml-10 xl:ml-[var(--layout-inset)] border-b border-gray-200/60 dark:border-[#141416]" />
        </div>

        {/* ── Row 2: Tab navigation ── */}
        {tabs.length > 1 && (
          <div className="w-full border-b border-gray-200/60 dark:border-[#141416] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
            <div className="nav-tabs h-[46px] flex items-center text-[14px] gap-x-6 px-4 lg:px-10 xl:px-[var(--layout-inset)] overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => onTabChange(i)}
                  className={`relative h-full flex items-center whitespace-nowrap transition-colors ${i === activeTabIdx
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.tab}
                  {i === activeTabIdx && (
                    <div className="absolute bottom-[-1px] h-[2px] w-full left-0 bg-primary dark:bg-primary-light" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
