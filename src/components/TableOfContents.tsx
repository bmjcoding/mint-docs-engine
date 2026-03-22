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
        if (rect.top <= 120) {
          current = heading.id;
        }
      }
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
      className="hidden xl:flex self-start sticky xl:flex-col max-w-[28rem] z-[21] h-[calc(100vh-8rem)]"
      style={{ top: 'calc(6.5rem)' }}
    >
      <div
        id="table-of-contents-layout"
        className="z-10 hidden xl:flex box-border max-h-full pl-10 w-[19rem]"
      >
        <div
          id="table-of-contents"
          className="text-gray-600 text-sm leading-6 w-[16.5rem] overflow-y-auto space-y-2 pb-4 -mt-10 pt-10"
        >
          {/* Header */}
          <button className="text-gray-700 dark:text-gray-300 font-medium flex items-center space-x-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer">
            <List className="w-4 h-4" />
            <span>On this page</span>
          </button>

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
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
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
