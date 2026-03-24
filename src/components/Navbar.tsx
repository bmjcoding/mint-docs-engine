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
        <div className="border-b border-gray-200/60 dark:border-white/[0.08] bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center gap-3 px-4 lg:px-8 h-14 max-w-[100rem] mx-auto w-full">

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
                    {config.logo.light && <img src={config.logo.light} alt={config.name} className="h-6 dark:hidden" />}
                    {config.logo.dark && <img src={config.logo.dark} alt={config.name} className="h-6 hidden dark:block" />}
                    {(!config.logo.light && !config.logo.dark) && (
                      <span className="font-semibold text-gray-900 dark:text-gray-100 text-[17px] tracking-tight">{config.name}</span>
                    )}
                  </>
                )
              ) : (
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-[17px] tracking-tight">{config.name}</span>
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

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search — desktop */}
            <button
              onClick={onSearchOpen}
              className="hidden sm:flex items-center gap-2 h-9 rounded-lg px-2 w-[220px] text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20"
            >
              <Search className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left">{config.search?.prompt || 'Search...'}</span>
              <kbd className="hidden md:flex h-5 items-center justify-center rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 font-sans text-[10px] font-medium text-gray-400">
                ⌘K
              </kbd>
            </button>

            {/* Search — mobile icon */}
            <button
              onClick={onSearchOpen}
              className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
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
        </div>

        {/* ── Row 2: Tab navigation ── */}
        {tabs.length > 1 && (
          <div className="w-full border-b border-gray-200/60 dark:border-white/[0.08] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md">
            <div className="nav-tabs h-11 flex items-center text-[13.5px] font-sans gap-x-6 px-4 lg:px-8 max-w-[100rem] mx-auto overflow-x-auto">
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
                    <div className="absolute bottom-0 h-[2px] w-full left-0 bg-gray-900 dark:bg-white" />
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
