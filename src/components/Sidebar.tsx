import { ReactNode, useState } from 'react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import { useTheme } from '@/hooks/useTheme';
import { X, Sun, Moon, ChevronDown, Check } from 'lucide-react';
import type { NavTab, NavGroup } from '@/lib/types';
import Icon from '@/components/Icon';

interface SidebarProps {
  tab: NavTab;
  currentSlug: string;
  onNavigate: (slug: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  tabs?: NavTab[];
  activeTabIdx?: number;
  onTabChange?: (idx: number) => void;
}

export default function Sidebar({ tab, currentSlug, onNavigate, mobileOpen, onMobileClose, tabs, activeTabIdx, onTabChange }: SidebarProps) {
  const config = useDocsConfig();
  const { setTheme, resolvedTheme } = useTheme();
  const [tabDropdownOpen, setTabDropdownOpen] = useState(false);

  function renderNavPages(pages: (string | NavGroup)[], level = 0): ReactNode {
    return (
      <ul className={`sidebar-group ${level === 0 ? 'space-y-0.5' : 'ml-3 border-l border-gray-100 dark:border-[#151516] space-y-0.5 pl-1 pt-1'}`}>
        {pages.map((item, idx) => {
          if (typeof item === 'string') {
            const pageSlug = item;
            const isActive = currentSlug === pageSlug;
            const displayName = pageSlug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || pageSlug;

            return (
              <li
                key={pageSlug}
                className="relative scroll-m-4 first:scroll-m-20"
                data-active={isActive ? 'true' : undefined}
                data-title={displayName}
                id={`/${pageSlug}`}
              >
                <a
                  className={`group flex items-start cursor-pointer gap-x-3 text-left break-words rounded-xl outline-offset-[-1px] text-[14px] leading-6 ${isActive
                    ? 'bg-primary/15 text-primary dark:text-primary-light dark:bg-primary-light/10 font-medium'
                    : 'hover:bg-gray-600/5 dark:hover:bg-gray-200/5 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  href={`#/${pageSlug}`}
                  style={{ padding: '6px 12px', marginLeft: '20px', marginRight: '4px' }}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(pageSlug);
                    onMobileClose?.();
                  }}
                >
                  <div className="flex-1 flex items-start space-x-2.5">
                    <div className="break-words [word-break:break-word]">{displayName}</div>
                  </div>
                </a>
              </li>
            );
          } else {
            // It's a nested NavGroup (dropdown/folder)
            return (
              <li key={`group-${level}-${idx}`} className="mt-2 mb-1">
                <div className="flex items-center gap-2 pl-8 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.icon && <span className="text-gray-400 dark:text-gray-500 w-4 h-4 shrink-0 flex items-center justify-center -ml-1 text-base"><Icon name={item.icon} className="w-4 h-4" /></span>}
                  <span>{item.group}</span>
                </div>
                {renderNavPages(item.pages, level + 1)}
              </li>
            );
          }
        })}
      </ul>
    );
  }

  const sidebarContent = (
    <div className="relative lg:text-sm lg:leading-6">
      {/* Gradient mask at top */}
      <div className="sticky top-0 h-8 z-10 bg-gradient-to-b from-background-light dark:from-background-dark" />

      <div id="navigation-items">
        {tab.groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-6 lg:mt-8' : ''}>
            {/* Group header */}
            <div className="sidebar-group-header flex items-center gap-2.5 pl-8 mb-2 font-semibold text-gray-900 dark:text-gray-200 text-[14px]">
              {group.icon && <span className="text-gray-500 w-5 h-5 flex items-center justify-center text-lg -ml-0.5"><Icon name={group.icon} className="w-5 h-5" /></span>}
              <h5 id={`sidebar-title-${gi}`}>{group.group}</h5>
            </div>

            {/* Group items (recursive) */}
            {renderNavPages(group.pages)}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div
        id="sidebar"
        className="z-20 hidden lg:block fixed bottom-0 right-auto w-[18rem] left-0 xl:left-[var(--sidebar-inset)]"
        style={{ top: 'calc(var(--navbar-height, 6.5rem) + 6px)' }}
      >
        <div
          id="sidebar-content"
          className="absolute inset-0 z-10 stable-scrollbar-gutter overflow-auto pr-4 pb-10"
        >
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar overlay — full-height panel starting from top */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="lg:hidden fixed top-0 left-0 bottom-0 z-[70] w-[min(65vw,20rem)] bg-background-light dark:bg-background-dark overflow-auto border-r border-gray-200 dark:border-[#151516]">

            {/* Mobile sidebar header: logo + theme toggle */}
            <div className="flex items-center px-4 h-[60px]">
              {/* Logo — smaller for mobile sidebar */}
              <a
                href={typeof config.logo === 'object' && config.logo?.href ? config.logo.href : '#/'}
                className="select-none flex-shrink-0"
                onClick={() => onMobileClose?.()}
              >
                {config.logo ? (
                  typeof config.logo === 'string' ? (
                    <img src={config.logo} alt={config.name} className="h-5" />
                  ) : (
                    <>
                      {config.logo.light && <img src={config.logo.light} alt={config.name} className="h-5 dark:hidden" />}
                      {config.logo.dark && <img src={config.logo.dark} alt={config.name} className="h-5 hidden dark:block" />}
                      {(!config.logo.light && !config.logo.dark) && (
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-[15px] tracking-tight font-serif">{config.name}</span>
                      )}
                    </>
                  )
                ) : (
                  <span className="font-medium text-gray-900 dark:text-gray-100 text-[15px] tracking-tight font-serif">{config.name}</span>
                )}
              </a>

              <div className="flex-1" />

              {/* Theme toggle pill */}
              <div className="flex items-center gap-0.5 rounded-full border border-[#1a1a1c] hover:border-[#222224] transition-colors p-[3px]">
                <button
                  onClick={() => setTheme('light')}
                  className={`cursor-pointer p-2 rounded-full transition-all ${resolvedTheme === 'light' ? 'bg-[#171717] text-gray-200' : 'text-gray-500'}`}
                  aria-label="Light mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`cursor-pointer p-2 rounded-full transition-all ${resolvedTheme === 'dark' ? 'bg-[#171717] text-gray-200' : 'text-gray-500'}`}
                  aria-label="Dark mode"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Tab selector dropdown (if multiple tabs) */}
            {tabs && tabs.length > 1 && (
              <div className="px-4 pt-4 relative">
                <button
                  onClick={() => setTabDropdownOpen(!tabDropdownOpen)}
                  className="cursor-pointer flex items-center justify-between w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-[#1a1a1c] hover:bg-gray-600/5 dark:hover:bg-gray-200/5 text-base font-medium text-gray-900 dark:text-gray-100 outline-none focus:outline-none transition-colors"
                >
                  <span>{tabs[activeTabIdx ?? 0]?.tab}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${tabDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {tabDropdownOpen && (
                  <div className="absolute left-4 right-4 mt-2 rounded-lg border border-gray-300 dark:border-[#1a1a1c] bg-background-light dark:bg-background-dark py-1 z-10">
                    {tabs.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onTabChange?.(i);
                          setTabDropdownOpen(false);
                        }}
                        className={`cursor-pointer flex items-center justify-between w-full px-4 py-3 text-base transition-colors ${i === (activeTabIdx ?? 0)
                          ? 'text-primary dark:text-primary-light font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{t.tab}</span>
                        {i === (activeTabIdx ?? 0) && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation items — bump text size and align with dropdown for mobile */}
            <div className="p-4 pt-2 [&_.sidebar-group-header]:!text-base [&_.sidebar-group-header]:!pl-4 [&_.sidebar-group_a]:!text-base [&_.sidebar-group_a]:!leading-7 [&_.sidebar-group_a]:![margin-left:4px] [&_.sidebar-group_a]:!cursor-pointer">
              {sidebarContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}
