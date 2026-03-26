import { useState } from 'react';
import { useDocsConfig } from '@/hooks/useDocsConfig';
import { ChevronLeft, ChevronRight, Github, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FooterProps {
  prevPage: { slug: string; title: string } | null;
  nextPage: { slug: string; title: string } | null;
  onNavigate: (slug: string) => void;
}

export default function Footer({ prevPage, nextPage, onNavigate }: FooterProps) {
  const config = useDocsConfig();
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  return (
    <>
      {/* Pagination */}
      <div id="pagination" className="px-0.5 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mt-8">
        {prevPage ? (
          <a
            href={`#/${prevPage.slug}`}
            className="group flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-light transition-colors"
            onClick={(e) => { e.preventDefault(); onNavigate(prevPage.slug); }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{prevPage.title}</span>
          </a>
        ) : <div />}
        <div className="flex-1" />
        {nextPage && (
          <a
            href={`#/${nextPage.slug}`}
            className="group flex items-center gap-1.5 hover:text-primary dark:hover:text-primary-light transition-colors"
            onClick={(e) => { e.preventDefault(); onNavigate(nextPage.slug); }}
          >
            <span>{nextPage.title}</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Was this helpful */}
      <div className="flex items-center gap-3 mt-8 py-4 border-t border-gray-100 dark:border-[#151516]">
        {feedback ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Thanks for your feedback!
          </span>
        ) : (
          <>
            <span className="text-sm text-gray-500 dark:text-gray-400">Was this page helpful?</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFeedback('yes')}
                className="flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 hover:border-green-200 hover:text-green-700 dark:hover:bg-green-900/20 dark:hover:border-green-800 dark:hover:text-green-400 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Yes
              </button>
              <button
                onClick={() => setFeedback('no')}
                className="flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-700 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 transition-colors"
              >
                <ThumbsDown className="w-3.5 h-3.5" /> No
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer id="footer" className="flex gap-12 justify-between pt-10 border-t border-gray-100 dark:border-[#151516] pb-28">
        <div className="flex items-center justify-between">
          <div className="sm:flex">
            <a
              className="group flex items-baseline gap-1 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-nowrap"
              href="https://www.perplexity.ai/computer"
              rel="noreferrer"
              target="_blank"
            >
              <span>Created with Perplexity Computer</span>
            </a>
          </div>
        </div>
        {config.footer?.socials && (
          <div className="flex items-center gap-3">
            {config.footer.socials.github && (
              <a
                href={config.footer.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </footer>
    </>
  );
}
