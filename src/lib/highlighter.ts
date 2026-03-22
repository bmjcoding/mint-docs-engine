import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

const COMMON_LANGS = [
  'javascript', 'typescript', 'jsx', 'tsx',
  'python', 'bash', 'shell', 'json', 'yaml',
  'html', 'css', 'markdown', 'go', 'rust',
  'java', 'ruby', 'php', 'sql', 'graphql',
  'xml', 'toml', 'diff', 'text',
];

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light-default', 'dark-plus'],
      langs: COMMON_LANGS,
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, language: string): Promise<string> {
  const highlighter = await getHighlighter();
  const loadedLangs = highlighter.getLoadedLanguages();
  const lang = loadedLangs.includes(language) ? language : 'text';

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      light: 'github-light-default',
      dark: 'dark-plus',
    },
  });
}
