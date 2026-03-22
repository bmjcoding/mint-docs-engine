import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';
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
  for (const tab of config.navigation.tabs) {
    for (const group of tab.groups) {
      for (const pageSlug of group.pages) {
        const name = pageSlug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || pageSlug;
        results.push({
          slug: pageSlug,
          title: name,
          group: group.group,
          tab: tab.tab,
        });
      }
    }
  }
  return results;
}

export default function SearchModal({ isOpen, onClose, onNavigate }: SearchModalProps) {
  const config = useDocsConfig();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allPages = getAllPages(config);

  const filtered = query.trim()
    ? allPages.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.group.toLowerCase().includes(query.toLowerCase()) ||
        p.slug.toLowerCase().includes(query.toLowerCase())
      )
    : allPages;

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

  return (
    <div className="fixed inset-0 z-50 search-backdrop flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.search?.prompt || 'Search documentation...'}
            className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((result, i) => (
              <button
                key={result.slug}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === selectedIdx
                  ? 'bg-primary/10 text-primary dark:text-primary-light'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => { onNavigate(result.slug); onClose(); }}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <FileText className="w-4 h-4 flex-shrink-0 opacity-50" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{result.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.tab} &rsaquo; {result.group}</div>
                </div>
                {i === selectedIdx && <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-50" />}
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> to select
          </span>
          <span className="flex items-center gap-1">
            <span className="font-mono">↑↓</span> to navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono">esc</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
