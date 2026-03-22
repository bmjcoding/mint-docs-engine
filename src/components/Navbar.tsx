import { useState, useEffect } from 'react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import { useTheme } from '@/hooks/useTheme';
import { Search, Sun, Moon, Monitor, Github } from 'lucide-react';

interface NavbarProps {
  activeTabIdx: number;
  onTabChange: (idx: number) => void;
  onSearchOpen: () => void;
}

export default function Navbar({ activeTabIdx, onTabChange, onSearchOpen }: NavbarProps) {
  const config = useDocsConfig();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpaque, setIsOpaque] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsOpaque(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = config.navigation.tabs;

  return (
    <div
      id="navbar"
      className="z-30 fixed lg:sticky top-0 w-full"
    >
      {/* Blur background layer */}
      <div
        id="navbar-transition"
        className={`absolute w-full h-full backdrop-blur flex-none transition-colors duration-500 pointer-events-none border-b ${isOpaque
          ? 'bg-background-light/95 dark:bg-background-dark/75 border-gray-500/10 dark:border-gray-300/[0.06]'
          : 'bg-background-light/60 dark:bg-transparent border-gray-500/5 dark:border-gray-300/[0.06]'
        }`}
        data-is-opaque={isOpaque ? 'true' : 'false'}
      />

      {/* Content */}
      <div className="z-10 mx-auto relative">
        <div className="relative">
          {/* Main row */}
          <div className="flex items-center lg:px-7 h-14 min-w-0 mx-4 lg:mx-0">
            {/* Logo + tabs left */}
            <div className="h-full relative flex-1 flex items-center gap-x-4 min-w-0 lg:border-none">
              <div className="flex-1 flex items-center gap-x-4">
                {/* Logo */}
                <a href="#/" className="select-none flex-shrink-0">
                    <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">
                      {config.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-base">{config.name}</span>
                  </div>
                </a>

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            </div>

            {/* Right side: search, links, theme */}
            <div className="flex items-center gap-3 ml-4">
              {/* Search button */}
              <button
                onClick={onSearchOpen}
                className="hidden sm:flex items-center gap-2 h-9 rounded-xl px-3 text-sm text-gray-500 dark:text-gray-400 ring-1 ring-gray-400/30 dark:ring-gray-600/50 hover:ring-gray-400/60 dark:hover:ring-gray-500/60 transition-all bg-white/80 dark:bg-white/5 min-w-[180px]"
              >
                <Search className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{config.search?.prompt || 'Search...'}</span>
                <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile search */}
              <button
                onClick={onSearchOpen}
                className="sm:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Navbar links */}
              {config.navbar?.links?.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  {link.label === 'GitHub' && <Github className="w-5 h-5" />}
                  {link.label !== 'GitHub' && <span>{link.label}</span>}
                </a>
              ))}

              {/* Theme toggle */}
              <div className="relative">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {themeMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setThemeMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-36 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50 py-1">
                      {[
                        { mode: 'light' as const, icon: Sun, label: 'Light' },
                        { mode: 'dark' as const, icon: Moon, label: 'Dark' },
                        { mode: 'system' as const, icon: Monitor, label: 'System' },
                      ].map(({ mode, icon: Icon, label }) => (
                        <button
                          key={mode}
                          onClick={() => { setTheme(mode); setThemeMenuOpen(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${theme === mode
                            ? 'text-primary dark:text-primary-light bg-primary/5'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
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

          {/* Nav tabs row */}
          {tabs.length > 1 && (
            <div className="nav-tabs h-full flex text-sm gap-x-6 px-4 lg:px-7 overflow-x-auto">
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => onTabChange(i)}
                  className={`nav-tabs-item group relative h-full gap-2 flex items-center font-medium py-2.5 whitespace-nowrap transition-colors ${i === activeTabIdx
                    ? 'text-gray-800 dark:text-gray-200 faux-bold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.tab}
                  {/* Active indicator */}
                  <div className={`absolute bottom-0 h-[1.5px] w-full left-0 ${i === activeTabIdx ? 'bg-primary dark:bg-primary-light' : 'bg-transparent'}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
