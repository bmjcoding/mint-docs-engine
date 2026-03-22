import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/hooks/useTheme';
import { DocsConfigProvider } from '@/hooks/useDocsConfig';
import App from '@/App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <DocsConfigProvider>
        <App />
      </DocsConfigProvider>
    </ThemeProvider>
  </StrictMode>
);
