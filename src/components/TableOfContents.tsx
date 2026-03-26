import { useState, useEffect, useCallback } from 'react';
import type { TocItem } from '@/lib/types';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  const handleScroll = useCallback(() => {
    const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
    let current = '';

    for (const heading of headings) {
      if (heading) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.15) {
          current = heading.id;
        }
      }
    }

    // Default to first item when at top of page or no heading has scrolled past
    if (!current && items.length > 0) {
      current = items[0].id;
    }

    setActiveId(current);
  }, [items]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (items.length === 0) return null;

  return (
    <div
      id="content-side-layout"
      className="hidden xl:flex self-start sticky xl:flex-col max-w-[20rem] z-[21] h-[calc(100vh-var(--navbar-height,6.5rem)-1.5rem)] top-[calc(var(--navbar-height,6.5rem)+2.5rem)]"
    >
      <div
        id="table-of-contents-layout"
        className="z-10 hidden xl:flex box-border max-h-full w-[19rem]"
      >
        <div
          id="table-of-contents"
          className="text-gray-600 text-sm leading-6 w-[16.5rem] overflow-y-auto space-y-2 pb-4 pt-2"
        >
          {/* Header */}
          <div className="flex items-center space-x-2 text-gray-900 dark:text-gray-200 font-medium">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="2" y1="3.5" x2="14" y2="3.5"/><line x1="2" y1="8" x2="10" y2="8"/><line x1="2" y1="12.5" x2="6" y2="12.5"/></svg>
            <span>On this page</span>
          </div>

          {/* Items */}
          <div>
            <ul className="toc" id="table-of-contents-content">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="toc-item relative"
                  data-depth={item.level - 2}
                >
                  <a
                    className={`break-words py-1 block transition-colors ${activeId === item.id
                      ? 'text-primary dark:text-primary-light font-medium'
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    href={`#${item.id}`}
                    style={{ paddingLeft: item.level > 2 ? '1rem' : undefined }}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
