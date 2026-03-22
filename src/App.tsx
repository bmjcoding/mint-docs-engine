import { useState, useEffect, useCallback } from 'react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import TableOfContents from '@/components/TableOfContents';
import Footer from '@/components/Footer';
import SearchModal from '@/components/SearchModal';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { loadPage, extractToc, getAdjacentPages } from '@/lib/content';
import type { PageData, TocItem } from '@/lib/types';
import { Copy, Check, Menu } from 'lucide-react';

export default function App() {
  const config = useDocsConfig();
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [currentSlug, setCurrentSlug] = useState('');
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine initial slug from hash or default to first page
  useEffect(() => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash) {
      setCurrentSlug(hash);
      // Find which tab this slug belongs to
      config.navigation.tabs.forEach((tab, i) => {
        for (const group of tab.groups) {
          if (group.pages.includes(hash)) {
            setActiveTabIdx(i);
            return;
          }
        }
      });
    } else {
      // Default to first page of first tab
      const firstTab = config.navigation.tabs[0];
      if (firstTab?.groups[0]?.pages[0]) {
        const firstSlug = firstTab.groups[0].pages[0];
        setCurrentSlug(firstSlug);
        window.location.hash = `/${firstSlug}`;
      }
    }
  }, [config]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash;
      // Only process if it looks like a page route (starts with #/)
      if (!rawHash.startsWith('#/')) return;
      const slug = rawHash.slice(2); // remove '#/'
      if (slug) {
        setCurrentSlug(slug);
        // Find which tab this slug belongs to
        config.navigation.tabs.forEach((tab, i) => {
          for (const group of tab.groups) {
            if (group.pages.includes(slug)) {
              setActiveTabIdx(i);
              return;
            }
          }
        });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [config]);

  // Load page content when slug changes
  useEffect(() => {
    if (!currentSlug) return;

    loadPage(currentSlug).then(data => {
      if (data) {
        setPageData(data);
        setTocItems(extractToc(data.content));
        document.title = `${data.frontmatter.title} - ${config.name}`;
        window.scrollTo({ top: 0 });
      }
    });
  }, [currentSlug, config.name]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = useCallback((slug: string) => {
    window.location.hash = `/${slug}`;
    setCurrentSlug(slug);
    setMobileMenuOpen(false);

    // Find which tab this slug belongs to
    config.navigation.tabs.forEach((tab, i) => {
      for (const group of tab.groups) {
        if (group.pages.includes(slug)) {
          setActiveTabIdx(i);
          return;
        }
      }
    });
  }, [config]);

  const handleTabChange = useCallback((idx: number) => {
    setActiveTabIdx(idx);
    // Navigate to first page of the new tab
    const tab = config.navigation.tabs[idx];
    if (tab?.groups[0]?.pages[0]) {
      handleNavigate(tab.groups[0].pages[0]);
    }
  }, [config, handleNavigate]);

  const handleCopyPage = async () => {
    if (pageData) {
      await navigator.clipboard.writeText(pageData.rawContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeTab = config.navigation.tabs[activeTabIdx];

  // Get adjacent pages for pagination
  const { prev, next } = getAdjacentPages(config, currentSlug);
  const getPageTitle = (slug: string) =>
    slug.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || slug;

  // Breadcrumbs
  const breadcrumbs: string[] = [];
  if (activeTab) {
    breadcrumbs.push(activeTab.tab);
    for (const group of activeTab.groups) {
      if (group.pages.includes(currentSlug)) {
        breadcrumbs.push(group.group);
        break;
      }
    }
  }

  return (
    <div className="relative antialiased text-gray-500 dark:text-gray-400">
      <div data-docs-theme="mint" className="max-lg:contents lg:flex lg:w-full">
        {/* Navbar */}
        <Navbar
          activeTabIdx={activeTabIdx}
          onTabChange={handleTabChange}
          onSearchOpen={() => setSearchOpen(true)}
        />

        {/* Sidebar */}
        {activeTab && (
          <Sidebar
            tab={activeTab}
            currentSlug={currentSlug}
            onNavigate={handleNavigate}
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content area */}
        <div
          id="content-area"
          className="relative grow box-border flex-col w-full mx-auto px-4 sm:px-6 lg:pl-[20rem] xl:pr-4"
        >
          <div className="flex flex-row-reverse gap-8 pt-20 lg:pt-8">
            {/* Table of Contents (right side) */}
            <TableOfContents items={tocItems} />

            {/* Content column */}
            <div className="min-w-0 flex-1 max-w-3xl">
              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden mb-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {pageData && (
                <>
                  {/* Page header */}
                  <header id="header" className="relative leading-none">
                    {/* Breadcrumbs */}
                    {breadcrumbs.length > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {breadcrumbs.map((crumb, i) => (
                          <span key={i} className="flex items-center gap-1.5">
                            {i > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                            <span>{crumb}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-0.5 space-y-2.5">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center relative gap-2 min-w-0">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                          {pageData.frontmatter.title}
                        </h1>
                        {/* Copy page button */}
                        <div id="page-context-menu" className="items-center shrink-0 min-w-[156px] justify-end ml-auto sm:flex hidden">
                          <button
                            onClick={handleCopyPage}
                            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          >
                            {copied ? (
                              <><Check className="w-4 h-4" /> Copied!</>
                            ) : (
                              <><Copy className="w-4 h-4" /> Copy page</>
                            )}
                          </button>
                        </div>
                      </div>
                      {/* Description */}
                      {pageData.frontmatter.description && (
                        <div className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                          <p>{pageData.frontmatter.description}</p>
                        </div>
                      )}
                    </div>
                  </header>

                  {/* MDX Content */}
                  <div
                    id="content"
                    className="mdx-content relative mt-8 mb-14 prose prose-gray dark:prose-invert isolate"
                    data-page-title={pageData.frontmatter.title}
                    data-page-href={`/${currentSlug}`}
                  >
                    <MarkdownRenderer content={pageData.content} />
                  </div>

                  {/* Footer */}
                  <Footer
                    prevPage={prev ? { slug: prev, title: getPageTitle(prev) } : null}
                    nextPage={next ? { slug: next, title: getPageTitle(next) } : null}
                    onNavigate={handleNavigate}
                  />
                </>
              )}

              {!pageData && currentSlug && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-pulse text-gray-400 dark:text-gray-500 text-lg">Loading page...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}
