import { useMemo, useState, useEffect, type ReactNode } from 'react';
// Force Vite HMR reload
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  Callout, Card, CardGroup, Columns, Column, CodeBlock, CodeGroup, Steps, Tabs, Accordion,
  Mermaid, Expandable, ParamField, ResponseField,
  Badge, Panel, RequestExample, ResponseExample,
  Update, Prompt, Tree, TreeFolder, TreeFile, Tile, Color, ColorRow, ColorItem, Tooltip
} from './MdxComponents';

interface MarkdownRendererProps {
  content: string;
}

const MOCK_USER = {
  firstName: "Jane",
  company: "Acme Corp",
  plan: "Enterprise",
  org: { plan: "enterprise" }
};

function processSyncFeatures(content: string) {
  let finalContent = content;
  // Variables
  finalContent = finalContent.replace(/\{user\.([a-zA-Z.]+)\??\}/g, (match, path) => {
    const parts = path.split('.');
    let val: any = MOCK_USER;
    for (const p of parts) { val = val?.[p]; }
    return val !== undefined ? String(val) : match;
  });
  // Conditionals
  const conditionalRegex = /\{\s*(user\.[^?]+)\?\s*<>\s*(.*?)\s*<\/>\s*:\s*<>\s*(.*?)\s*<\/>\s*\}/g;
  finalContent = finalContent.replace(conditionalRegex, (match, condition, trueStr, falseStr) => {
     try {
       // Only allow evaluating user context securely
       const fn = new Function('user', `return ${condition};`);
       const result = fn(MOCK_USER);
       return result ? trueStr : falseStr;
     } catch(e) { return match; }
  });
  return finalContent;
}

interface ParsedBlock {
  type: 'markdown' | 'component';
  content: string;
  component?: string;
  props?: Record<string, string>;
  children?: ParsedBlock[];
}

function parseCustomComponents(content: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  let remaining = content;

  const componentTags = [
    'Note', 'Warning', 'Info', 'Tip', 'Check', 'Danger', 'Callout',
    'Card', 'CardGroup', 'Columns', 'Column',
    'CodeGroup',
    'Steps', 'Step',
    'Tabs', 'Tab',
    'Accordion', 'AccordionGroup',
    'Expandable', 'ParamField', 'ResponseField',
    'Panel', 'RequestExample', 'ResponseExample',
    'Badge', 'Tooltip', 'Mermaid',
    'Update', 'Prompt', 'Tree', 'Tree\\.Folder', 'TreeFolder', 'Tree\\.File', 'TreeFile', 'Tile', 'Color', 'Color\\.Row', 'ColorRow', 'Color\\.Item', 'ColorItem'
  ];

  const tagPattern = new RegExp(
    `<(${componentTags.join('|')})(\\s[^>]*)?(?:/>|>([\\s\\S]*?)</\\1>)`,
    'g'
  );

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset lastIndex
  tagPattern.lastIndex = 0;

  while ((match = tagPattern.exec(remaining)) !== null) {
    // Add any markdown before this component
    if (match.index > lastIndex) {
      const mdContent = remaining.slice(lastIndex, match.index).trim();
      if (mdContent) {
        blocks.push({ type: 'markdown', content: mdContent });
      }
    }

    const tag = match[1];
    const attrs = match[2] || '';
    const inner = match[3] || '';

    const props: Record<string, string> = {};
    const attrRegex = /(\w+)=(?:"([^"]*)"|{([^}]*)}|'([^']*)')/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      props[attrMatch[1]] = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';
    }

    blocks.push({
      type: 'component',
      content: inner,
      component: tag,
      props,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining markdown
  if (lastIndex < remaining.length) {
    const mdContent = remaining.slice(lastIndex).trim();
    if (mdContent) {
      blocks.push({ type: 'markdown', content: mdContent });
    }
  }

  return blocks;
}

function dedentContent(text: string): string {
  const lines = text.split('\n');
  const nonEmptyLines = lines.filter(l => l.trim().length > 0);
  if (nonEmptyLines.length === 0) return text;
  const minIndent = Math.min(...nonEmptyLines.map(l => l.match(/^(\s*)/)?.[1]?.length ?? 0));
  return lines.map(l => l.slice(minIndent)).join('\n').trim();
}

function extractTabsAndContents(inner: string): { items: string[]; contents: ReactNode[] } {
  const items: string[] = [];
  const contents: ReactNode[] = [];
  const tabRegex = /<Tab\s+title="([^"]*)">([\s\S]*?)<\/Tab>/g;
  let tabMatch: RegExpExecArray | null;

  while ((tabMatch = tabRegex.exec(inner)) !== null) {
    items.push(tabMatch[1]);
    contents.push(<MarkdownRenderer content={dedentContent(tabMatch[2])} />);
  }

  return { items, contents };
}

function extractSteps(inner: string): Array<{ title: string; content: ReactNode }> {
  const steps: Array<{ title: string; content: ReactNode }> = [];
  const stepRegex = /<Step\s+title="([^"]*)">([\s\S]*?)<\/Step>/g;
  let stepMatch: RegExpExecArray | null;

  while ((stepMatch = stepRegex.exec(inner)) !== null) {
    steps.push({
      title: stepMatch[1],
      content: <MarkdownRenderer content={dedentContent(stepMatch[2])} />,
    });
  }

  return steps;
}

function extractCodeGroupTabs(inner: string): Array<{ title: string; code: string; language: string }> {
  const tabs: Array<{ title: string; code: string; language: string }> = [];
  const codeBlockRegex = /```(\w+)(?:\s+(.+?))?\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;

  while ((m = codeBlockRegex.exec(inner)) !== null) {
    const language = m[1] || 'text';
    const filename = m[2] || language;
    const code = m[3].trimEnd();
    tabs.push({ title: filename, code, language });
  }

  return tabs;
}

function extractCards(inner: string): ReactNode[] {
  const cards: ReactNode[] = [];
  const cardRegex = /<Card\s+([^>]*)>([\s\S]*?)<\/Card>/g;
  let cardMatch: RegExpExecArray | null;
  let idx = 0;

  while ((cardMatch = cardRegex.exec(inner)) !== null) {
    const attrStr = cardMatch[1];
    const cardContent = cardMatch[2];

    const props: Record<string, string> = {};
    const attrRegex = /(\w+)=(?:"([^"]*)"|{([^}]*)}|'([^']*)')/g;
    let am: RegExpExecArray | null;
    while ((am = attrRegex.exec(attrStr)) !== null) {
      props[am[1]] = am[2] ?? am[3] ?? am[4] ?? '';
    }

    cards.push(
      <Card key={idx} title={props.title || ''} icon={props.icon} href={props.href}>
        <span>{cardContent.trim()}</span>
      </Card>
    );
    idx++;
  }

  return cards;
}

function RenderBlock({ block }: { block: ParsedBlock }) {
  if (block.type === 'markdown') {
    return <MarkdownBlock content={block.content} />;
  }

  const { component, content, props = {} } = block;

  switch (component) {
    case 'Note':
      return <Callout type="note"><MarkdownRenderer content={content} /></Callout>;
    case 'Warning':
      return <Callout type="warning"><MarkdownRenderer content={content} /></Callout>;
    case 'Info':
      return <Callout type="info"><MarkdownRenderer content={content} /></Callout>;
    case 'Tip':
      return <Callout type="tip"><MarkdownRenderer content={content} /></Callout>;
    case 'Check':
      return <Callout type="check"><MarkdownRenderer content={content} /></Callout>;
    case 'Danger':
      return <Callout type="danger"><MarkdownRenderer content={content} /></Callout>;
    case 'Callout':
      return <Callout type={props.type as any} title={props.title} icon={props.icon} color={props.color}><MarkdownRenderer content={content} /></Callout>;
    case 'Badge':
      return <Badge color={props.color as any} size={props.size as any} shape={props.shape as any} stroke={props.stroke === 'true'} disabled={props.disabled === 'true'} icon={props.icon}><MarkdownRenderer content={content} /></Badge>;
    case 'Tooltip':
      return <Tooltip tip={props.tip || ''}><MarkdownRenderer content={content} /></Tooltip>;
    case 'Mermaid':
      return <Mermaid chart={props.chart || ''} />;
    case 'Columns':
      return <Columns cols={parseInt(props.cols || '2', 10)}><MarkdownRenderer content={content} /></Columns>;
    case 'Column':
      return <Column><MarkdownRenderer content={content} /></Column>;
    case 'Panel':
      return <Panel><MarkdownRenderer content={content} /></Panel>;
    case 'RequestExample':
      return <RequestExample><MarkdownRenderer content={content} /></RequestExample>;
    case 'ResponseExample':
      return <ResponseExample><MarkdownRenderer content={content} /></ResponseExample>;
    case 'Update': {
      let parsedTags: string[] = [];
      if (props.tags) {
        // Simple manual parsing of `["A", "B"]` style strings returned by regex
        parsedTags = props.tags.replace(/[[\]"]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
      return <Update label={props.label || ''} description={props.description} tags={parsedTags}><MarkdownRenderer content={content} /></Update>;
    }
    case 'Prompt':
      return <Prompt prompt={props.prompt || ''} response={props.response || ''} />;
    case 'Tree':
      return <Tree><MarkdownRenderer content={content} /></Tree>;
    case 'Tree.Folder':
    case 'TreeFolder':
      return <TreeFolder name={props.name || ''} defaultOpen={props.defaultOpen === 'true'}><MarkdownRenderer content={content} /></TreeFolder>;
    case 'Tree.File':
    case 'TreeFile':
      return <TreeFile name={props.name || ''} />;
    case 'Tile':
      return <Tile title={props.title || ''} description={props.description || ''} icon={props.icon} href={props.href} />;
    case 'Color':
      return <Color hex={props.hex || ''} name={props.name} />;
    case 'Color.Row':
    case 'ColorRow':
      return <ColorRow><MarkdownRenderer content={content} /></ColorRow>;
    case 'Color.Item':
    case 'ColorItem':
      return <ColorItem hex={props.hex || ''} name={props.name} />;

    case 'CodeGroup': {
      const codeTabs = extractCodeGroupTabs(content);
      return <CodeGroup tabs={codeTabs} />;
    }

    case 'CardGroup': {
      const cols = parseInt(props.cols || '2', 10);
      const cards = extractCards(content);
      return <CardGroup cols={cols}>{cards}</CardGroup>;
    }

    case 'Card':
      return (
        <Card title={props.title || ''} icon={props.icon} href={props.href} horizontal={props.horizontal === 'true'} img={props.img} cta={props.cta} arrow={props.arrow === 'true'}>
          <span>{content.trim()}</span>
        </Card>
      );

    case 'Steps': {
      const steps = extractSteps(content);
      return <Steps items={steps}>{null}</Steps>;
    }

    case 'Tabs': {
      const { items, contents } = extractTabsAndContents(content);
      return <Tabs items={items} contents={contents}>{null}</Tabs>;
    }

    case 'Accordion':
      return (
        <Accordion title={props.title || ''} defaultOpen={props.defaultOpen === 'true'}>
          <MarkdownRenderer content={content} />
        </Accordion>
      );

    case 'Expandable':
      return (
        <Expandable title={props.title || ''} defaultOpen={props.defaultOpen === 'true'}>
          <MarkdownRenderer content={content} />
        </Expandable>
      );

    case 'ParamField':
      return (
        <ParamField
          path={props.path}
          query={props.query}
          body={props.body}
          header={props.header}
          type={props.type}
          required={props.required === 'true' || props.required === ''}
        >
          <MarkdownRenderer content={content} />
        </ParamField>
      );

    case 'ResponseField':
      return (
        <ResponseField name={props.name || ''} type={props.type}>
          <MarkdownRenderer content={content} />
        </ResponseField>
      );

    default:
      return <MarkdownBlock content={content} />;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function HeadingWithAnchor({ level, children, ...props }: { level: 2 | 3; children: ReactNode; [key: string]: unknown }) {
  const text = typeof children === 'string' ? children : extractText(children);
  const id = slugify(text);
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag className="flex whitespace-pre-wrap group font-semibold scroll-mt-24" id={id} {...props}>
      <div className="absolute" tabIndex={-1}>
        <a
          aria-label="Navigate to header"
          className="-ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100 focus:opacity-100 focus:outline-0"
          href={`#${id}`}
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 bg-white dark:bg-background-dark dark:brightness-[1.35] ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </a>
      </div>
      <span className="cursor-pointer">{children}</span>
    </Tag>
  );
}

function MarkdownBlock({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        h2: ({ children, ...props }) => <HeadingWithAnchor level={2} {...props}>{children}</HeadingWithAnchor>,
        h3: ({ children, ...props }) => <HeadingWithAnchor level={3} {...props}>{children}</HeadingWithAnchor>,
        pre: ({ children }) => {
          return <>{children}</>;
        },
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            const language = className?.replace('language-', '') || 'text';
            const codeText = typeof children === 'string' ? children : String(children || '');
            const trimmed = codeText.replace(/\n$/, '');
            if (language === 'mermaid') {
              return <Mermaid chart={trimmed} />;
            }
            return <CodeBlock code={trimmed} language={language} />;
          }
          return <code className={className} {...props}>{children}</code>;
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="m-0 min-w-full w-full max-w-none [&_td]:min-w-[100px] [&_th]:text-left">
              {children}
            </table>
          </div>
        ),
        img: ({ className, src, alt, ...props }) => {
          // If the user specifies width via style or it's forced by className, we keep it, otherwise max-w-full.
          const hasNoZoom = ('noZoom' in props) || ('nozoom' in props);
          const userClass = className || (props as any).className || (props as any).class || '';
          return (
            <img 
              src={src} 
              alt={alt} 
              className={`max-w-full h-auto rounded-xl ${hasNoZoom ? '' : 'cursor-zoom-in'} ${userClass}`} 
              {...(props as any)} 
            />
          );
        },
        iframe: ({ className, ...props }) => {
          const userClass = className || (props as any).className || (props as any).class || '';
          return (
            <iframe 
              className={`w-full aspect-video rounded-xl ${userClass}`} 
              allowFullScreen 
              {...(props as any)} 
            />
          );
        },
        video: ({ className, ...props }) => {
          const userClass = className || (props as any).className || (props as any).class || '';
          return (
            <video 
              className={`w-full aspect-video rounded-xl ${userClass}`} 
              {...(props as any)} 
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [processedContent, setProcessedContent] = useState(() => processSyncFeatures(content));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const syncContent = processSyncFeatures(content);
    
    // Support import MySnippet from "/snippets/my-snippet.mdx";
    // or import { MyJSXSnippet } from "/components/my-jsx-snippet.jsx";
    const importRegex = /import\s+(?:{\s*([^}]+)\s*}|(\w+))\s+from\s+["']([^"']+)["'];?/g;
    const matches = Array.from(syncContent.matchAll(importRegex));

    if (matches.length > 0) {
      setIsLoading(true);
      
      async function fetchSnippets() {
        let finalContent = syncContent;
        const snippetMap: Record<string, string> = {};

        for (const match of matches) {
           const compName = match[1] || match[2];
           const importPath = match[3];

           try {
             // In local environment, fetch from public folder. E.g., "/content/snippets/..."
             const res = await fetch(importPath);
             if (res.ok) {
               let text = await res.text();
               // Strip frontmatter
               text = text.replace(/^---[\s\S]*?---/, '').trim();
               // If it's a JSX component export, attempt a quick regex extraction (very rudimental for demo)
               if (importPath.endsWith('.jsx')) {
                 const returnMatch = text.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
                 if (returnMatch) {
                   text = returnMatch[1];
                 }
               }
               snippetMap[compName.trim()] = text;
             }
           } catch(e) { console.warn("Failed to fetch snippet", importPath); }
        }

        // Remove import lines
        finalContent = finalContent.replace(importRegex, '');

        // Resolve instances of `<SnippetName />`
        for (const [compName, snippetText] of Object.entries(snippetMap)) {
          const tagRegex = new RegExp(`<${compName}\\s*([^>]*)/>`, 'g');
          finalContent = finalContent.replace(tagRegex, (m, attrs) => {
             const props: Record<string, string> = {};
             const attrRegex = /(\w+)=(?:"([^"]*)"|'([^']*)')/g;
             let am;
             while ((am = attrRegex.exec(attrs)) !== null) {
                props[am[1]] = am[2] || am[3] || '';
             }
             
             let replacedSnippet = snippetText;
             for (const [k, v] of Object.entries(props)) {
                replacedSnippet = replacedSnippet.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
             }
             return replacedSnippet;
          });
        }

        if (isMounted) {
           setProcessedContent(finalContent);
           setIsLoading(false);
        }
      }
      fetchSnippets();
    } else {
      setProcessedContent(syncContent);
      setIsLoading(false);
    }
    
    return () => { isMounted = false; };
  }, [content]);

  const blocks = useMemo(() => parseCustomComponents(processedContent), [processedContent]);

  if (isLoading) {
    return <div className="w-full flex justify-center py-20 animate-pulse text-gray-400">Loading snippets...</div>;
  }

  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
    </>
  );
}
