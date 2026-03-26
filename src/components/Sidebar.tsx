import { ReactNode } from 'react';
import type { NavTab, NavGroup } from '@/lib/types';
import Icon from '@/components/Icon';

interface SidebarProps {
  tab: NavTab;
  currentSlug: string;
  onNavigate: (slug: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ tab, currentSlug, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  function renderNavPages(pages: (string | NavGroup)[], level = 0): ReactNode {
    return (
      <ul className={`sidebar-group ${level === 0 ? 'space-y-0.5' : 'ml-3 border-l border-gray-100 dark:border-[#141416] space-y-0.5 pl-1 pt-1'}`}>
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

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="lg:hidden fixed left-0 bottom-0 z-50 w-[18rem] bg-background-light dark:bg-background-dark overflow-auto border-r border-gray-200 dark:border-[#141416]" style={{ top: 'var(--navbar-height, 56px)' }}>
            <div className="p-4">
              {sidebarContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}
