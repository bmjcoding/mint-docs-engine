import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Hash, ArrowRight } from 'lucide-react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import type { DocsConfig } from '@/lib/types';

interface SearchResult {
  slug: string;
  title: string;
  description?: string;
  group: string;
  tab: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (slug: string) => void;
}

function getAllPages(config: DocsConfig): SearchResult[] {
  const results: SearchResult[] = [];

  function processPages(pages: any[], tabTitle: string, groupTitle: string) {
    for (const item of pages) {
      if (typeof item === 'string') {
        const pageSlug = item;
        const name = pageSlug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || pageSlug;
        results.push({
          slug: pageSlug,
          title: name,
          group: groupTitle,
          tab: tabTitle,
        });
      } else {
        processPages(item.pages, tabTitle, item.group);
      }
    }
  }

  for (const tab of config.navigation.tabs) {
    for (const group of tab.groups) {
      processPages(group.pages, tab.tab, group.group);
    }
  }
  return results;
}

export default function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const config = useDocsConfig();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const allPages = getAllPages(config);

  const filtered = query.trim()
    ? allPages.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.group.toLowerCase().includes(query.toLowerCase()) ||
        p.slug.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (!resultsRef.current) return;
    const selected = resultsRef.current.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIdx(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIdx(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[selectedIdx]) {
          onNavigate(filtered[selectedIdx].slug);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [filtered, selectedIdx, onNavigate, onClose]);

  if (!isOpen) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 search-backdrop flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className={`w-full max-w-[540px] mx-4 bg-white dark:bg-[#1a1a1e] shadow-2xl border border-gray-200 dark:border-[#303033] overflow-hidden ${hasQuery ? 'rounded-2xl' : 'rounded-xl'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className={`flex items-center gap-3 px-4 py-3 ${hasQuery ? 'border-b border-gray-200 dark:border-[#303033]' : ''}`}>
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.search?.prompt || 'Search documentation...'}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        {hasQuery && (
          <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                No results found for &ldquo;{query}&rdquo;
              </div>
            ) : (
              filtered.map((result, i) => {
                const isSelected = i === selectedIdx;
                return (
                  <button
                    key={result.slug}
                    data-selected={isSelected}
                    className={`w-full flex items-center gap-3 px-3 py-2 mx-1 text-left transition-colors rounded-lg ${isSelected
                      ? 'bg-gray-100 dark:bg-white/[0.08]'
                      : 'hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                    }`}
                    style={{ width: 'calc(100% - 8px)' }}
                    onClick={() => { onNavigate(result.slug); onClose(); }}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <Hash className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mb-0.5">
                        {result.tab} &rsaquo; {result.group}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {result.title}
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
