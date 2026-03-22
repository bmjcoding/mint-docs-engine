import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  AlertCircle, AlertTriangle, Info, Lightbulb, CheckCircle, XCircle,
  ChevronRight, Copy, Check, Link as LinkIcon
} from 'lucide-react';
import { highlight } from '@/lib/highlighter';
import mermaid from 'mermaid';

/* ─── Callout ─── */
interface CalloutProps {
  type: 'note' | 'warning' | 'info' | 'tip' | 'check' | 'danger';
  children: ReactNode;
  title?: string;
}

const calloutConfig: Record<string, {
  icon: typeof AlertCircle;
  border: string; bg: string; text: string;
  darkBorder: string; darkBg: string; darkText: string;
  iconSize: string;
}> = {
  note: {
    icon: AlertCircle, iconSize: 'size-4',
    border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-800',
    darkBorder: 'dark:border-blue-900', darkBg: 'dark:bg-blue-600/20', darkText: 'dark:text-blue-300',
  },
  warning: {
    icon: AlertTriangle, iconSize: 'size-5',
    border: 'border-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-800',
    darkBorder: 'dark:border-yellow-900', darkBg: 'dark:bg-yellow-600/20', darkText: 'dark:text-yellow-300',
  },
  info: {
    icon: Info, iconSize: 'size-5',
    border: 'border-neutral-200', bg: 'bg-neutral-50', text: 'text-neutral-800',
    darkBorder: 'dark:border-neutral-700', darkBg: 'dark:bg-white/10', darkText: 'dark:text-neutral-300',
  },
  tip: {
    icon: Lightbulb, iconSize: 'size-4',
    border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-800',
    darkBorder: 'dark:border-green-900', darkBg: 'dark:bg-green-600/20', darkText: 'dark:text-green-300',
  },
  check: {
    icon: CheckCircle, iconSize: 'size-4',
    border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-800',
    darkBorder: 'dark:border-green-900', darkBg: 'dark:bg-green-600/20', darkText: 'dark:text-green-300',
  },
  danger: {
    icon: XCircle, iconSize: 'size-4',
    border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-800',
    darkBorder: 'dark:border-red-900', darkBg: 'dark:bg-red-600/20', darkText: 'dark:text-red-300',
  },
};

export function Callout({ type, children, title }: CalloutProps) {
  const cfg = calloutConfig[type] || calloutConfig.info;
  const Icon = cfg.icon;

  return (
    <div
      className={`callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border ${cfg.border} ${cfg.bg} ${cfg.darkBorder} ${cfg.darkBg}`}
      data-callout-type={type}
    >
      <Icon className={`flex-none ${cfg.iconSize} ${cfg.text} ${cfg.darkText} mt-0.5`} />
      <div
        className={`text-sm min-w-0 w-full ${cfg.text} ${cfg.darkText} [&_a]:!text-current [&_a]:border-current [&_strong]:!text-current [&_code]:!text-current`}
        data-component-part="callout-content"
      >
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/* ─── Card / CardGroup ─── */
interface CardProps {
  title: string;
  icon?: string;
  href?: string;
  children?: ReactNode;
}

export function Card({ title, href, children }: CardProps) {
  const isLinked = !!href;

  const handleClick = () => {
    if (href) {
      window.location.hash = href;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && href) {
      window.location.hash = href;
    }
  };

  return (
    <div
      className={`card block font-normal group relative my-2 ring-2 ring-transparent rounded-2xl bg-white dark:bg-background-dark border border-gray-950/10 dark:border-white/10 overflow-hidden w-full min-w-0 ${isLinked ? 'cursor-pointer hover:!border-primary dark:hover:!border-primary-light' : ''}`}
      role={isLinked ? 'link' : undefined}
      tabIndex={isLinked ? 0 : undefined}
      onClick={isLinked ? handleClick : undefined}
      onKeyDown={isLinked ? handleKeyDown : undefined}
    >
      <div className="px-6 py-5 relative" data-component-part="card-content-container">
        {isLinked && (
          <div className="absolute text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-light top-5 right-5">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        )}
        <h3 className="font-semibold text-sm text-gray-800 dark:text-white mt-0" data-component-part="card-title">
          {title}
        </h3>
        {children && (
          <div className="mt-1 font-normal text-sm leading-6 text-gray-600 dark:text-gray-400" data-component-part="card-content">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

interface CardGroupProps {
  cols?: number;
  children: ReactNode;
}

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  return (
    <div
      className={`columns card-group max-w-none gap-4 my-4 grid-cols-1 ${cols >= 2 ? 'sm:grid-cols-2' : ''} ${cols >= 3 ? 'lg:grid-cols-3' : ''} ${cols >= 4 ? 'xl:grid-cols-4' : ''}`}
      style={{ '--cols': cols, display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/* ─── CodeBlock ─── */
interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'text', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');

  useEffect(() => {
    highlight(code, language).then(setHighlightedHtml);
  }, [code, language]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyButton = (className: string) => (
    <button
      onClick={handleCopy}
      className={`h-[26px] w-[26px] flex items-center justify-center rounded-md backdrop-blur group/copy-button ${className}`}
      aria-label="Copy the contents from the code block"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400 group-hover/copy-button:text-gray-500 dark:text-white/40 dark:group-hover/copy-button:text-white/60" />
      )}
    </button>
  );

  return (
    <div
      className={`code-block mt-5 mb-8 not-prose rounded-2xl relative group min-w-0 text-gray-950 dark:text-gray-50 border border-gray-950/10 dark:border-white/10 ${filename ? 'bg-gray-50 dark:bg-white/5 p-0.5' : 'bg-transparent'}`}
    >
      {filename && (
        <div className="flex text-gray-400 text-xs rounded-t-[14px] leading-6 font-medium pl-4 pr-2.5 py-1" data-component-part="code-block-header">
          <div className="flex-grow-0 flex items-center gap-1.5 text-gray-700 dark:text-gray-300 min-w-0" data-component-part="code-block-header-filename">
            <span className="truncate min-w-0" title={filename}>{filename}</span>
          </div>
          <div className="flex-1 flex items-center justify-end gap-1.5">
            {copyButton('')}
          </div>
        </div>
      )}

      <div className={`w-0 min-w-full max-w-full py-3.5 px-4 h-full dark:bg-codeblock relative text-sm leading-6 code-block-background ${filename ? 'rounded-b-[14px] rounded-t-xl' : 'rounded-2xl'} bg-white dark:bg-[#1a1a1e] overflow-x-auto`} data-component-part="code-block-root">
        {!filename && (
          <div className="absolute top-3 right-4 flex items-center gap-1.5 z-10">
            {copyButton('opacity-0 group-hover:opacity-100 transition-opacity')}
          </div>
        )}
        {highlightedHtml ? (
          <div
            className="shiki-wrapper font-mono whitespace-pre leading-6 [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="font-mono whitespace-pre leading-6">
            <code data-language={language}>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/* ─── CodeGroup ─── */
interface CodeGroupProps {
  tabs: Array<{ title: string; code: string; language?: string }>;
}

export function CodeGroup({ tabs }: CodeGroupProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [highlightedTabs, setHighlightedTabs] = useState<string[]>([]);

  useEffect(() => {
    Promise.all(
      tabs.map(tab => highlight(tab.code, tab.language || 'text'))
    ).then(setHighlightedTabs);
  }, [tabs]);

  const activeCode = tabs[activeTab]?.code || '';
  const activeHtml = highlightedTabs[activeTab] || '';

  return (
    <div className="code-block mt-5 mb-8 not-prose rounded-2xl relative group min-w-0 text-gray-950 dark:text-gray-50 bg-gray-50 dark:bg-white/5 border border-gray-950/10 dark:border-white/10 p-0.5">
      <div className="flex text-gray-400 text-xs rounded-t-[14px] leading-6 font-medium pl-1 pr-2.5 py-1" data-component-part="code-block-header">
        <div className="flex items-center gap-0">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-3 py-0.5 rounded-md text-xs font-medium transition-colors ${i === activeTab ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      <div className="w-0 min-w-full max-w-full py-3.5 px-4 h-full dark:bg-codeblock relative text-sm leading-6 code-block-background rounded-b-[14px] rounded-t-xl bg-white dark:bg-[#1a1a1e] overflow-x-auto" data-component-part="code-block-root">
        {activeHtml ? (
          <div
            className="shiki-wrapper font-mono whitespace-pre leading-6 [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: activeHtml }}
          />
        ) : (
          <pre className="font-mono whitespace-pre leading-6">
            <code data-language={tabs[activeTab]?.language || 'text'}>{activeCode}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/* ─── Tabs / Tab ─── */
interface TabsProps {
  children: ReactNode;
  items: string[];
  contents: ReactNode[];
}

export function Tabs({ items, contents }: TabsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="my-4">
      <ul role="tablist" className="flex border-b border-gray-200 dark:border-gray-700 gap-x-4 list-none pl-0 m-0">
        {items.map((label, i) => (
          <li
            key={i}
            role="tab"
            aria-selected={i === activeIdx}
            tabIndex={i === activeIdx ? 0 : -1}
            className="cursor-pointer"
            onClick={() => setActiveIdx(i)}
            onKeyDown={(e) => { if (e.key === 'Enter') setActiveIdx(i); }}
          >
            <div
              className={`flex text-sm items-center gap-1.5 leading-6 font-semibold whitespace-nowrap pt-3 pb-2.5 -mb-px max-w-max border-b ${i === activeIdx ? 'text-primary dark:text-primary-light border-current' : 'text-gray-900 border-transparent hover:border-gray-300 dark:text-gray-200 dark:hover:border-gray-700'}`}
              data-active={i === activeIdx ? 'true' : 'false'}
              data-component-part="tab-button"
            >
              {label}
            </div>
          </li>
        ))}
      </ul>
      <div role="tabpanel" className="mt-2">
        {contents[activeIdx]}
      </div>
    </div>
  );
}

/* ─── Steps / Step ─── */
interface StepsProps {
  children: ReactNode;
  items: Array<{ title: string; content: ReactNode }>;
}

export function Steps({ items }: StepsProps) {
  return (
    <div className="steps ml-3.5 mt-10 mb-6" role="list">
      {items.map((item, i) => (
        <div
          key={i}
          className="step group/step step-container relative flex items-start pb-5"
          role="listitem"
        >
          {/* Vertical line */}
          {i < items.length - 1 ? (
            <div
              className="absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem] bg-gray-200/70 dark:bg-white/10"
              data-component-part="step-line"
            />
          ) : (
            <div
              className="absolute w-px h-[calc(100%-2.75rem)] top-[2.75rem] bg-transparent bg-gradient-to-b from-gray-200 dark:from-white/10 via-80% to-transparent"
              data-component-part="step-line"
            />
          )}

          {/* Step number */}
          <div className="absolute ml-[-13px] py-2" data-component-part="step-number">
            <div className="relative size-7 shrink-0 rounded-full bg-gray-50 dark:bg-white/10 text-xs text-gray-900 dark:text-gray-50 font-semibold flex items-center justify-center">
              <div>{i + 1}</div>
            </div>
          </div>

          {/* Step content */}
          <div className="w-full overflow-hidden pl-8 pr-px">
            <p className="mt-2 font-semibold text-gray-900 dark:text-gray-200" data-component-part="step-title">
              {item.title}
            </p>
            <div className="prose dark:prose-invert mt-2" data-component-part="step-content">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Accordion ─── */
interface AccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  return (
    <details
      className="accordion border-standard rounded-2xl mb-3 overflow-hidden bg-white dark:bg-[#1a1a1e] cursor-default"
      open={defaultOpen}
    >
      <summary
        className="relative not-prose flex flex-row items-center content-center w-full cursor-pointer py-4 px-5 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-t-xl [&::-webkit-details-marker]:hidden"
        data-component-part="accordion-button"
      >
        <div className="mr-0.5" data-component-part="accordion-caret-right">
          <ChevronRight className="h-3 w-3 transition duration-75 text-gray-700 dark:text-gray-400 [[open]>&]:rotate-90" />
        </div>
        <div className="leading-tight text-left w-full" data-component-part="accordion-title-container">
          <p className="m-0 font-medium text-gray-900 dark:text-gray-200" data-component-part="accordion-title">
            {title}
          </p>
        </div>
      </summary>
      <div className="px-5 pb-4 prose dark:prose-invert text-sm">
        {children}
      </div>
    </details>
  );
}

/* ─── HeadingAnchor ─── */
interface HeadingAnchorProps {
  id: string;
  level: number;
  children: ReactNode;
}

export function HeadingAnchor({ id, level, children }: HeadingAnchorProps) {
  const className = "flex whitespace-pre-wrap group font-semibold scroll-mt-24";
  const inner = (
    <>
      <div className="absolute" tabIndex={-1}>
        <a
          aria-label="Navigate to header"
          className="-ml-10 flex items-center opacity-0 border-0 group-hover:opacity-100 focus:opacity-100 focus:outline-0 group/link"
          href={`#${id}`}
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center shadow-sm text-gray-400 dark:text-white/50 dark:bg-background-dark dark:brightness-[1.35] dark:ring-1 bg-white ring-1 ring-gray-400/30 dark:ring-gray-700/25 hover:ring-gray-400/60 dark:hover:ring-white/20">
            <LinkIcon className="w-3 h-3" />
          </div>
        </a>
      </div>
      <span className="cursor-pointer">{children}</span>
    </>
  );

  if (level === 2) return <h2 className={className} id={id}>{inner}</h2>;
  if (level === 3) return <h3 className={className} id={id}>{inner}</h3>;
  if (level === 4) return <h4 className={className} id={id}>{inner}</h4>;
  return <h2 className={className} id={id}>{inner}</h2>;
}

/* ─── Badge ─── */
interface BadgeProps {
  children: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

export function Badge({ children, color = 'blue' }: BadgeProps) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

/* ─── Frame ─── */
interface FrameProps {
  children: ReactNode;
  caption?: string;
}

export function Frame({ children, caption }: FrameProps) {
  return (
    <div className="my-4">
      <div className="frame p-2 not-prose relative bg-gray-50/50 rounded-2xl overflow-hidden dark:bg-gray-800/25" data-name="frame">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        <div className="relative rounded-xl overflow-hidden flex justify-center">
          {children}
        </div>
        <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-2xl dark:border-white/5" />
      </div>
      {caption && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{caption}</p>
      )}
    </div>
  );
}

/* ─── Tooltip ─── */
interface TooltipProps {
  children: ReactNode;
  tip: string;
}

export function Tooltip({ children, tip }: TooltipProps) {
  return (
    <span className="relative group/tooltip inline-block">
      <span className="border-b border-dotted border-gray-400 cursor-help">{children}</span>
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
        {tip}
      </span>
    </span>
  );
}

/* ─── Mermaid ─── */
let mermaidInitialized = false;

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });
      mermaidInitialized = true;
    }

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    mermaid.render(id, chart).then(({ svg: rendered }) => {
      setSvg(rendered);
    }).catch(() => {
      setSvg(`<pre class="text-red-500 text-sm">Failed to render Mermaid diagram</pre>`);
    });
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center not-prose [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/* ─── Expandable ─── */
interface ExpandableProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Expandable({ title, children, defaultOpen = false }: ExpandableProps) {
  return (
    <details
      className="my-3 border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden"
      open={defaultOpen}
    >
      <summary
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 [&::-webkit-details-marker]:hidden"
      >
        <ChevronRight className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 transition-transform [[open]>&]:rotate-90" />
        <span className="font-medium text-sm text-gray-800 dark:text-gray-200">{title}</span>
      </summary>
      <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
        {children}
      </div>
    </details>
  );
}

/* ─── ParamField ─── */
interface ParamFieldProps {
  path?: string;
  query?: string;
  body?: string;
  header?: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}

export function ParamField({ path, query, body, header, type, required, children }: ParamFieldProps) {
  const name = path || query || body || header || '';
  const location = path ? 'path' : query ? 'query' : body ? 'body' : header ? 'header' : '';

  return (
    <div className="param-field border-b border-gray-100 dark:border-gray-800 py-4 first:pt-0 last:border-b-0">
      <div className="flex items-baseline gap-2 flex-wrap">
        <code className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-transparent p-0">{name}</code>
        {type && <span className="text-xs text-gray-500 dark:text-gray-400">{type}</span>}
        {required && <span className="text-xs font-medium text-red-500">required</span>}
        {location && <span className="text-xs text-gray-400 dark:text-gray-500">{location}</span>}
      </div>
      {children && (
        <div className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── ResponseField ─── */
interface ResponseFieldProps {
  name: string;
  type?: string;
  children?: ReactNode;
}

export function ResponseField({ name, type, children }: ResponseFieldProps) {
  return (
    <div className="response-field border-b border-gray-100 dark:border-gray-800 py-4 first:pt-0 last:border-b-0">
      <div className="flex items-baseline gap-2">
        <code className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-transparent p-0">{name}</code>
        {type && <span className="text-xs text-gray-500 dark:text-gray-400">{type}</span>}
      </div>
      {children && (
        <div className="mt-1.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
