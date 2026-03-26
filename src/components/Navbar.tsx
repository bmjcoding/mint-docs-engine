import { useState, useEffect, useRef } from 'react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import { useTheme } from '@/hooks/useTheme';
import { Search, Sun, Moon, Github, ExternalLink, Menu, MoreVertical, ChevronRight, X } from 'lucide-react';
import type { NavAnchor } from '@/lib/types';

interface NavbarProps {
  activeTabIdx: number;
  onTabChange: (idx: number) => void;
  onSearchOpen: () => void;
  onMobileMenuOpen?: () => void;
  onMobileMenuClose?: () => void;
  mobileMenuOpen?: boolean;
  anchors?: NavAnchor[];
  breadcrumbs?: string[];
  currentPageTitle?: string;
}

export default function Navbar({ activeTabIdx, onTabChange, onSearchOpen, onMobileMenuOpen, onMobileMenuClose, mobileMenuOpen, anchors, breadcrumbs, currentPageTitle }: NavbarProps) {
  const config = useDocsConfig();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpaque, setIsOpaque] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

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
        className="absolute w-full h-full backdrop-blur-sm flex-none transition-colors duration-500 pointer-events-none bg-background-light/70 dark:bg-background-dark/70"
      />

      {/* Content */}
      <div className="z-10 relative">

        {/* Row 1: Top bar */}
        <div>
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

            {/* Desktop: Search + Ask AI (in flex flow, centered in available space) */}
            <div className="hidden lg:flex flex-1 items-center justify-center gap-2 min-w-0">
              <button
                onClick={onSearchOpen}
                className="flex items-center gap-2 h-8 rounded-lg px-3 text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors bg-gray-100 dark:bg-[#09090b] border border-gray-200 dark:border-[#212123]"
              >
                <Search className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="whitespace-nowrap">Search...</span>
                <kbd className="flex h-5 items-center justify-center rounded px-1 font-sans text-xs font-medium text-gray-400 dark:text-gray-500">
                  &#8984;K
                </kbd>
              </button>

              <button
                onClick={onSearchOpen}
                className="flex items-center gap-1.5 h-8 rounded-lg px-2.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-gray-200 dark:border-[#212123]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="w-4 h-4 shrink-0"><g fill="currentColor"><path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259-.342-.474s-.138-.406-.342-.474Z" fill="currentColor" stroke="none" /><polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></g></svg>
                <span>Ask AI</span>
              </button>
            </div>

            {/* Mobile: when sidebar is open, show X; otherwise show search/sparkle/dots */}
            {mobileMenuOpen ? (
              <button
                onClick={onMobileMenuClose}
                className="cursor-pointer lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors ml-auto"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex lg:hidden items-center gap-0.5 ml-auto">
                <button
                  onClick={onSearchOpen}
                  className="cursor-pointer p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={onSearchOpen}
                  className="cursor-pointer p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  aria-label="Ask AI"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className="w-5 h-5"><g fill="currentColor"><path d="M5.658,2.99l-1.263-.421-.421-1.263c-.137-.408-.812-.408-.949,0l-.421,1.263-1.263,.421c-.204,.068-.342,.259-.342,.474s.138,.406,.342,.474l1.263,.421,.421,1.263c.068,.204,.26,.342,.475,.342s.406-.138,.475-.342l.421-1.263,1.263-.421c.204-.068,.342-.259-.342-.474s-.138-.406-.342-.474Z" fill="currentColor" stroke="none" /><polygon points="9.5 2.75 11.412 7.587 16.25 9.5 11.412 11.413 9.5 16.25 7.587 11.413 2.75 9.5 7.587 7.587 9.5 2.75" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></g></svg>
                </button>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="cursor-pointer p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-gray-200 dark:border-[#212123] bg-white dark:bg-[#18181b] shadow-lg py-1 z-50">
                      <button
                        onClick={() => { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); setMenuOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                        {resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
                      </button>
                      {config.navbar?.primary && (
                        <a
                          href={config.navbar.primary.href}
                          target={config.navbar.primary.href.startsWith('http') ? '_blank' : '_self'}
                          rel={config.navbar.primary.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                          {config.navbar.primary.label || 'Get Started'}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop: Anchor links from active tab */}
            {anchors && anchors.length > 0 && (
              <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
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

            {/* Desktop: Navbar links (e.g. GitHub) */}
            {config.navbar?.links?.map((link, i) => {
              const isExternal = link.url.startsWith('http');
              return (
                <a
                  key={i}
                  href={link.url}
                  target={isExternal ? '_blank' : '_self'}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors flex-shrink-0"
                >
                  {link.label === 'GitHub' ? (
                    <Github className="w-5 h-5" />
                  ) : (
                    <span>{link.label}</span>
                  )}
                </a>
              );
            })}

            {/* Desktop: Navbar primary CTA */}
            {config.navbar?.primary && (
              <a
                href={config.navbar.primary.href}
                target={config.navbar.primary.href.startsWith('http') ? '_blank' : '_self'}
                rel={config.navbar.primary.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="hidden lg:flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-black dark:bg-white dark:text-black hover:opacity-80 transition-opacity shadow-sm border border-transparent dark:border-gray-300 flex-shrink-0"
              >
                {config.navbar.primary.label || 'Get Started'}
              </a>
            )}

            {/* Desktop: Theme toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="hidden lg:block p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex-shrink-0"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

          </div>
          {/* Divider that starts at content edge */}
          <div className="ml-4 lg:ml-10 xl:ml-[var(--layout-inset)] mr-4 lg:mr-10 xl:mr-[var(--layout-inset)] border-b border-gray-200/60 dark:border-[#151516]" />
        </div>

        {/* Row 2: Desktop tabs */}
        {tabs.length > 1 && (
          <div className="hidden lg:block w-full border-b border-gray-200/60 dark:border-[#151516]">
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

        {/* Row 2: Mobile breadcrumb with hamburger */}
        <div className="lg:hidden w-full border-b border-gray-200/60 dark:border-[#151516]">
          <div className="flex items-center gap-2 px-4 h-[46px]">
            <button
              onClick={onMobileMenuOpen}
              className="cursor-pointer p-1.5 -ml-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 text-sm min-w-0 overflow-hidden">
                <span className="text-gray-400 dark:text-gray-500 whitespace-nowrap">{breadcrumbs[0]}</span>
                {currentPageTitle && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">{currentPageTitle}</span>
                  </>
                )}
              </nav>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
