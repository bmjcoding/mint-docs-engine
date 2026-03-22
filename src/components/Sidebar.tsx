import type { NavTab } from '@/lib/types';

interface SidebarProps {
  tab: NavTab;
  currentSlug: string;
  onNavigate: (slug: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ tab, currentSlug, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const sidebarContent = (
    <div className="relative lg:text-sm lg:leading-6">
      {/* Gradient mask at top */}
      <div className="sticky top-0 h-8 z-10 bg-gradient-to-b from-background-light dark:from-background-dark" />

      <div id="navigation-items">
        {tab.groups.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-6 lg:mt-8' : ''}>
            {/* Group header */}
            <div className="sidebar-group-header flex items-center gap-2.5 pl-4 mb-3.5 lg:mb-2.5 font-semibold text-gray-900 dark:text-gray-200">
              <h5 id={`sidebar-title-${gi}`}>{group.group}</h5>
            </div>

            {/* Group items */}
            <ul className="sidebar-group space-y-px" id={`sidebar-group-${gi}`}>
              {group.pages.map((pageSlug) => {
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
              })}
            </ul>
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
