import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { DocsConfig } from '@/lib/types';

const DocsConfigContext = createContext<DocsConfig | null>(null);

export function DocsConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DocsConfig | null>(null);

  useEffect(() => {
    fetch('./docs.json')
      .then(r => r.json())
      .then((data: DocsConfig) => {
        setConfig(data);
        // Apply primary color as CSS custom properties
        if (data.colors?.primary) {
          applyPrimaryColor(data.colors.primary);
        }
        // Set page title
        if (data.name) {
          document.title = data.name;
        }
        // Set favicon
        if (data.favicon) {
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
          if (link) {
            link.href = data.favicon;
          } else {
            const newLink = document.createElement('link');
            newLink.rel = 'icon';
            newLink.href = data.favicon;
            document.head.appendChild(newLink);
          }
        }
      })
      .catch(console.error);
  }, []);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <div className="animate-pulse text-gray-400">Loading documentation...</div>
      </div>
    );
  }

  return (
    <DocsConfigContext.Provider value={config}>
      {children}
    </DocsConfigContext.Provider>
  );
}

export function useDocsConfig(): DocsConfig {
  const ctx = useContext(DocsConfigContext);
  if (!ctx) throw new Error('useDocsConfig must be used within DocsConfigProvider');
  return ctx;
}

function applyPrimaryColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const root = document.documentElement;
  root.style.setProperty('--primary-r', String(r));
  root.style.setProperty('--primary-g', String(g));
  root.style.setProperty('--primary-b', String(b));
}
