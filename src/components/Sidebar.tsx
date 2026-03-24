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
      <ul className={`sidebar-group ${level === 0 ? 'space-y-px' : 'ml-3 border-l border-gray-100 dark:border-gray-800 space-y-px pl-1 pt-1'}`}>
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
                  className={`group flex items-start pr-3 py-1.5 cursor-pointer gap-x-3 text-left break-words rounded-xl w-full outline-offset-[-1px] ${isActive
                    ? 'bg-primary/10 text-primary dark:text-primary-light dark:bg-primary-light/10 faux-bold'
                    : 'hover:bg-gray-600/5 dark:hover:bg-gray-200/5 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  href={`#/${pageSlug}`}
                  style={{ paddingLeft: '1rem' }}
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
                <div className="flex items-center gap-2 pl-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400">
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

      {/* Global Anchors */}
      {tab.anchors && tab.anchors.length > 0 && (
        <div className="mb-6 lg:mb-8 pb-4 border-b border-gray-200 dark:border-gray-800">
          <ul className="space-y-1">
            {tab.anchors.map((anchor, idx) => (
              <li key={idx}>
                <a 
                  href={anchor.url} 
                  target="_self"
                  className="flex items-center gap-3 px-4 py-1.5 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors font-medium rounded-xl hover:bg-gray-600/5 dark:hover:bg-gray-200/5"
                  style={anchor.color ? { color: anchor.color } : {}}
                >
                  {anchor.icon && <span className="text-lg w-5 h-5 flex items-center justify-center opacity-80"><Icon name={anchor.icon} className="w-5 h-5" /></span>}
                  {!anchor.icon && <span className="w-5 h-5 flex items-center justify-center text-gray-400 opacity-80"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>}
                  <span>{anchor.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div id="navigation-items">
        {tab.groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-6 lg:mt-8' : ''}>
            {/* Group header */}
            <div className="sidebar-group-header flex items-center gap-2.5 pl-4 mb-3.5 lg:mb-2.5 font-semibold text-gray-900 dark:text-gray-200">
              {group.icon && <span className="text-gray-500 w-5 h-5 flex items-center justify-center text-lg"><Icon name={group.icon} className="w-5 h-5" /></span>}
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
        className="z-20 hidden lg:block fixed bottom-0 right-auto w-[18rem] left-0"
        style={{ top: '5.75rem' }}
      >
        <div
          id="sidebar-content"
          className="absolute inset-0 z-10 stable-scrollbar-gutter overflow-auto pl-4 pr-4 pb-10"
        >
          {sidebarContent}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="lg:hidden fixed top-14 left-0 bottom-0 z-50 w-[18rem] bg-background-light dark:bg-background-dark overflow-auto border-r border-gray-200 dark:border-gray-800">
            <div className="p-4">
              {sidebarContent}
            </div>
          </div>
        </>
      )}
    </>
  );
}
