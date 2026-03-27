import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  AlertCircle, AlertTriangle, Info, Lightbulb, CheckCircle, XCircle,
  ChevronRight, Copy, Check, Link as LinkIcon, Folder, File, Terminal
} from 'lucide-react';
import { highlight } from '@/lib/highlighter';
import mermaid from 'mermaid';
import Icon from '@/components/Icon';

/* ─── Callout ─── */
interface CalloutProps {
  type?: 'note' | 'warning' | 'info' | 'tip' | 'check' | 'danger';
  children: ReactNode;
  title?: string;
  icon?: string | ReactNode;
  color?: string;
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

export function Callout({ type, children, title, icon, color }: CalloutProps) {
  if (color || (icon && !type)) {
    // Custom callout
    return (
      <div
        className="callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border"
        style={{ borderColor: color, backgroundColor: color ? `${color}20` : undefined, color }}
        data-callout-type="custom"
      >
        {icon && <div className="flex-none size-5 mt-0.5" style={{ color }}><Icon name={icon} className="w-5 h-5" /></div>}
        <div
          className="text-sm min-w-0 w-full [&>:first-child]:!mt-0 [&>:last-child]:!mb-0 [&_p]:!text-current [&_li]:!text-current [&_a]:!text-current [&_a]:!decoration-current [&_strong]:!text-current [&_code]:!text-current"
          data-component-part="callout-content"
          style={{ color }}
        >
          {title && <p className="font-semibold mb-1">{title}</p>}
          {children}
        </div>
      </div>
    );
  }

  const cfg = calloutConfig[type || 'info'] || calloutConfig.info;
  const IconComponent = cfg.icon;

  return (
    <div
      className={`callout my-4 px-5 py-4 overflow-hidden rounded-2xl flex gap-3 border ${cfg.border} ${cfg.bg} ${cfg.darkBorder} ${cfg.darkBg}`}
      data-callout-type={type}
    >
      <IconComponent className={`flex-none ${cfg.iconSize} ${cfg.text} ${cfg.darkText} mt-0.5`} />
      <div
        className={`text-sm min-w-0 w-full [&>:first-child]:!mt-0 [&>:last-child]:!mb-0 ${cfg.text} ${cfg.darkText} [&_p]:!text-current [&_li]:!text-current [&_a]:!text-current [&_a]:!decoration-current [&_strong]:!text-current [&_code]:!text-current`}
        data-component-part="callout-content"
      >
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
}

/* ─── Card / CardGroup / Columns ─── */
interface CardProps {
  title: string;
  icon?: string | ReactNode;
  href?: string;
  horizontal?: boolean;
  img?: string;
  cta?: string;
  arrow?: boolean;
  children?: ReactNode;
}

export function Card({ title, icon, href, horizontal, img, cta, arrow, children }: CardProps) {
  const isLinked = !!href;
  const showArrow = arrow ?? isLinked; // By default show arrow if linked

  const handleClick = () => {
    if (href) {
      if (href.startsWith('http')) {
        window.open(href, '_blank', 'noreferrer');
      } else {
        window.location.hash = href;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isLinked) {
      handleClick();
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
      {img && (
        <img alt={title} className="w-full object-cover object-center not-prose min-h-[160px]" data-component-part="card-image" src={img} />
      )}
      <div className={`px-6 py-5 relative ${horizontal ? 'flex items-center gap-x-4' : ''}`} data-component-part="card-content-container">
        {showArrow && (
          <div className="absolute text-gray-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary-light top-5 right-5 hidden md:block" id="card-link-arrow-icon">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        )}
        {icon && (
          <div className="h-6 w-6 fill-gray-800 dark:fill-primary-light text-gray-800 dark:text-primary-light shrink-0" data-component-part="card-icon">
            <Icon name={icon} className="w-6 h-6" />
          </div>
        )}
        <div className="w-full">
          <h3 className={`font-semibold text-base text-gray-800 dark:text-white ${!horizontal && icon ? 'mt-4' : 'mt-0'}`} data-component-part="card-title">
            {title}
          </h3>
          {children && (
            <div className={`prose font-normal text-base leading-6 text-gray-600 dark:text-gray-400 ${!horizontal ? 'mt-1' : 'mt-0'}`} data-component-part="card-content">
              <span>{children}</span>
            </div>
          )}
          {cta && (
            <div className="mt-4 font-semibold text-primary dark:text-primary-light text-sm flex items-center gap-1">
              {cta} <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
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
      className="card-group grid gap-4 my-6 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      style={{ '--cols': cols } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function Columns({ cols = 2, children }: CardGroupProps) {
  return (
    <div
      className="layout-columns grid gap-4 my-6 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))]"
      style={{ '--cols': cols } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

export function Column({ children }: { children: ReactNode }) {
  return <div className="layout-column min-w-0">{children}</div>;
}

/* ─── CodeBlock ─── */
interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  title?: string;
  icon?: string;
  wrap?: boolean;
  expandable?: boolean;
}

export function CodeBlock({ code, language = 'text', filename, title, icon, wrap, expandable }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(!expandable);
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

  const displayTitle = title || filename;

  return (
    <div
      className={`code-block mt-5 mb-8 not-prose rounded-2xl relative group min-w-0 text-gray-950 dark:text-gray-50 border border-gray-950/10 dark:border-white/10 overflow-hidden ${displayTitle ? 'bg-gray-50 dark:bg-white/5 p-0.5' : 'bg-transparent dark:bg-transparent'}`}
    >
      {displayTitle && (
        <div className="flex text-gray-400 text-xs rounded-t-[14px] leading-6 font-medium pl-4 pr-2.5 py-1" data-component-part="code-block-header">
          <div className="flex-grow-0 flex items-center gap-2 text-gray-700 dark:text-gray-300 min-w-0" data-component-part="code-block-header-filename">
            {icon && <Icon name={icon} className="size-3.5 opacity-80" />}
            <span className="truncate min-w-0" title={displayTitle}>{displayTitle}</span>
          </div>
          <div className="flex-1 flex items-center justify-end gap-1.5">
            {copyButton('')}
          </div>
        </div>
      )}

      <div className={`w-0 min-w-full max-w-full py-3.5 px-4 h-full relative text-sm leading-6 code-block-background overflow-x-auto rounded-2xl bg-white dark:bg-codeblock ${expandable && !isExpanded ? 'max-h-64' : ''}`} data-component-part="code-block-root">
        {highlightedHtml ? (
          <div
            className={`shiki-wrapper font-mono whitespace-pre leading-6 [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent ${wrap ? '[&_pre]:!whitespace-pre-wrap [&_pre]:!break-words' : ''}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className={`font-mono leading-6 ${wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
            <code data-language={language}>{code}</code>
          </pre>
        )}
      </div>
      {!displayTitle && (
        <div className="absolute top-0 right-0 bottom-0 z-10 flex items-start pt-3 pr-3 rounded-r-2xl code-block-button-fade">
          {copyButton('')}
        </div>
      )}
      {expandable && (
        <div className="flex items-center justify-center p-2 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 relative z-20">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {isExpanded ? 'Collapse code' : 'Expand code'}
          </button>
        </div>
      )}
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
    <div className="code-block mt-5 mb-8 not-prose rounded-2xl relative group min-w-0 text-gray-950 dark:text-gray-50 border border-gray-950/10 dark:border-white/10 overflow-hidden bg-gray-50 dark:bg-white/5 p-0.5">
      <div className="flex text-gray-400 text-sm bg-transparent px-4" data-component-part="code-block-header">
        <div className="flex items-center gap-4">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`relative py-3 px-1 text-sm font-medium transition-colors ${i === activeTab ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {tab.title}
              {i === activeTab && <div className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-gray-900 dark:bg-white rounded-t-md" />}
            </button>
          ))}
        </div>
      </div>
      <div className="w-0 min-w-full max-w-full py-3.5 px-4 h-full relative text-sm leading-6 code-block-background overflow-x-auto rounded-2xl bg-white dark:bg-codeblock" data-component-part="code-block-root">
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
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <details
      className="accordion accordion-item border border-gray-200 dark:border-white/10 rounded-xl cursor-default"
      open={defaultOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary
        className="relative not-prose flex flex-row items-center content-center w-full cursor-pointer py-3.5 px-4 space-x-2.5 rounded-[inherit] hover:bg-gray-100 dark:hover:bg-white/[0.05] [&::-webkit-details-marker]:hidden list-none"
        data-component-part="accordion-button"
      >
        <div className="flex-none" data-component-part="accordion-caret-right">
          <svg className={`h-2.5 w-2.5 text-gray-500 dark:text-gray-400 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 10 10" fill="currentColor">
            <path d="M2 1.5l6 3.5-6 3.5z" />
          </svg>
        </div>
        <div className="leading-tight text-left w-full" data-component-part="accordion-title-container">
          <p className="m-0 font-medium text-gray-900 dark:text-gray-200" data-component-part="accordion-title">
            {title}
          </p>
        </div>
      </summary>
      <div className="px-4 pl-9 pb-4 prose dark:prose-invert text-sm">
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
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = new URL(window.location.href);
    url.hash = `/${url.hash.replace('#/', '').split('#')[0]}#${id}`;
    
    // Update window hash visually without completely resetting page
    window.history.replaceState(null, '', url.hash);
    
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseClassName = "flex whitespace-pre-wrap group/heading scroll-mt-24 items-center";
  const getClassName = (lvl: number) => `${baseClassName} ${lvl === 2 ? 'font-normal' : 'font-semibold'}`;
  const inner = (
    <>
      <div className="absolute -ml-10" tabIndex={-1}>
        <button
          aria-label="Copy link to header"
          onClick={handleCopyLink}
          className="flex items-center invisible border-0 group-hover/heading:visible focus:visible focus:outline-0"
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:bg-[#1a1a1e] dark:ring-1 bg-white ring-1 ring-gray-200 dark:ring-white/10 hover:ring-gray-300 dark:hover:ring-white/30 transition-all">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <LinkIcon className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>
      <span className="cursor-pointer" onClick={handleCopyLink}>{children}</span>
    </>
  );

  if (level === 2) return <h2 className={getClassName(2)} id={id}>{inner}</h2>;
  if (level === 3) return <h3 className={getClassName(3)} id={id}>{inner}</h3>;
  if (level === 4) return <h4 className={getClassName(4)} id={id}>{inner}</h4>;
  return <h2 className={getClassName(2)} id={id}>{inner}</h2>;
}

/* ─── Badge ─── */
interface BadgeProps {
  children: ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'purple' | 'gray' | 'white' | 'surface' | 'white-destructive' | 'surface-destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill';
  stroke?: boolean;
  disabled?: boolean;
  icon?: string | ReactNode;
}

export function Badge({ children, color = 'blue', size = 'md', shape = 'rounded', stroke = false, disabled = false, icon }: BadgeProps) {
  const bgColors: Record<string, string> = {
    blue: stroke ? 'text-blue-800 dark:text-blue-300 border-blue-500 bg-transparent' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-transparent',
    green: stroke ? 'text-green-800 dark:text-green-300 border-green-500 bg-transparent' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-transparent',
    yellow: stroke ? 'text-yellow-800 dark:text-yellow-300 border-yellow-500 bg-transparent' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-transparent',
    orange: stroke ? 'text-orange-800 dark:text-orange-300 border-orange-500 bg-transparent' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-transparent',
    red: stroke ? 'text-red-800 dark:text-red-300 border-red-500 bg-transparent' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-transparent',
    purple: stroke ? 'text-purple-800 dark:text-purple-300 border-purple-500 bg-transparent' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-transparent',
    gray: stroke ? 'text-gray-800 dark:text-gray-300 border-gray-500 bg-transparent' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-transparent',
    white: stroke ? 'text-gray-900 border-gray-200 bg-transparent' : 'bg-white text-gray-900 border-gray-200 shadow-sm',
    surface: stroke ? 'text-gray-900 border-gray-200 bg-transparent' : 'bg-gray-50 text-gray-900 border-gray-200',
  };

  const sizes: Record<string, string> = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const radius = shape === 'pill' ? 'rounded-full' : 'rounded-md';
  const borderClass = stroke ? 'border' : 'border';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <span className={`inline-flex items-center gap-1 ${sizes[size]} font-medium ${radius} ${borderClass} ${bgColors[color] || bgColors.blue} ${disabledClass}`}>
      {icon && (
        <span className="shrink-0 flex items-center"><Icon name={icon} className="w-3.5 h-3.5" /></span>
      )}
      {children}
    </span>
  );
}

/* ─── Examples and Panel ─── */
export function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="panel grid min-w-0 grid-cols-1 lg:grid-cols-2 xl:gap-12 gap-8 items-start">
      {children}
    </div>
  );
}

export function RequestExample({ children }: { children: ReactNode }) {
  return (
    <div className="request-example relative sticky top-24 pt-4 lg:pt-0 -mt-4 min-w-0">
      {children}
    </div>
  );
}

export function ResponseExample({ children }: { children: ReactNode }) {
  return (
    <div className="response-example relative lg:pt-4 min-w-0">
      {children}
    </div>
  );
}

/* ─── Update ─── */
interface UpdateProps {
  label: string;
  description?: string;
  tags?: string[];
  children: ReactNode;
}

export function Update({ label, description, tags, children }: UpdateProps) {
  return (
    <div className="update relative sm:pl-10 lg:pl-0 lg:flex lg:gap-8 mt-12 overflow-hidden lg:overflow-visible">
      {/* Date/Version Sidebar (Desktop) */}
      <div className="hidden lg:block lg:w-48 lg:shrink-0 lg:text-right relative">
        <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
        {description && <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</div>}
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 lg:justify-end">
            {tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* The Node Circle & Line aligned to the right edge of this column */}
        <div className="absolute top-1.5 -right-[21px] size-2.5 rounded-full border-2 border-primary bg-white dark:bg-background-dark z-10" />
        <div className="absolute top-4 -bottom-12 -right-[17px] w-px bg-gray-200 dark:bg-gray-800 last-update-line" />
      </div>

      {/* Mobile Dateline */}
      <div className="lg:hidden relative">
        <div className="absolute top-1.5 -left-[28px] size-2.5 rounded-full border-2 border-primary bg-white dark:bg-background-dark z-10" />
        <div className="absolute top-4 -bottom-12 -left-[24px] w-px bg-gray-200 dark:bg-gray-800 last-update-line" />
        <div className="font-semibold text-gray-900 dark:text-gray-100">{label}</div>
        {description && <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</div>}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose w-full flex-1 min-w-0 mt-4 lg:mt-0 pb-12">
        {children}
      </div>
    </div>
  );
}

/* ─── Prompt ─── */
interface PromptProps {
  prompt: string;
  response: string;
}

export function Prompt({ prompt, response }: PromptProps) {
  return (
    <div className="prompt my-6 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#f9fafb] dark:bg-[#1a1a1e] text-sm font-mono shadow-sm">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-start gap-4">
        <Terminal className="size-5 shrink-0 text-gray-400 mt-0.5" />
        <div className="flex-1 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{prompt}</div>
      </div>
      <div className="px-5 py-4 bg-gray-50 dark:bg-white/5 border-l-2 border-primary/20 text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
        {response}
      </div>
    </div>
  );
}

/* ─── Tree ─── */
export function Tree({ children }: { children: ReactNode }) {
  return (
    <div className="tree font-mono text-sm leading-6 border border-gray-200 dark:border-gray-800 rounded-xl my-4 py-2 bg-white dark:bg-[#1a1a1e]">
      {children}
    </div>
  );
}

export function TreeFolder({ name, defaultOpen = false, children }: { name: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details className="tree-folder group" open={defaultOpen}>
      <summary className="flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 list-none [&::-webkit-details-marker]:hidden">
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 transition-transform group-open:rotate-90" />
        <Folder className="w-4 h-4 text-blue-400 fill-blue-400/20" />
        <span className="font-semibold text-gray-800 dark:text-gray-200">{name}</span>
      </summary>
      <div className="tree-children border-l border-gray-200 dark:border-gray-800 ml-6 pl-2 my-1 hidden group-open:block">
        {children}
      </div>
    </details>
  );
}

export function TreeFile({ name }: { name: string }) {
  return (
    <div className="tree-file flex items-center gap-2 px-4 py-1.5 ml-5 hover:bg-gray-50 dark:hover:bg-white/5">
      <File className="w-4 h-4 text-gray-400" />
      <span className="text-gray-600 dark:text-gray-300">{name}</span>
    </div>
  );
}

/* ─── Tile ─── */
interface TileProps {
  icon?: string | ReactNode;
  title: string;
  description: string;
  href?: string;
}

export function Tile({ icon, title, description, href }: TileProps) {
  const isLinked = !!href;
  const Wrapper = isLinked ? 'a' : 'div';
  return (
    <Wrapper 
      href={href} 
      className={`tile block p-5 my-4 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#1a1a1e] min-w-0 ${isLinked ? 'hover:border-primary dark:hover:border-primary-light transition-colors group cursor-pointer' : ''}`}
    >
      {icon && (
        <div className={`mb-4 size-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 ${isLinked ? 'group-hover:bg-primary/5 group-hover:text-primary transition-colors' : ''}`}>
          <Icon name={icon} className="w-6 h-6" />
        </div>
      )}
      <h3 className="font-semibold text-gray-900 dark:text-white m-0 tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-0">{description}</p>
    </Wrapper>
  );
}

/* ─── Color ─── */
export function Color({ hex, name }: { hex: string; name?: string }) {
  return (
    <div className="color-swatch flex items-center gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 min-w-[200px]">
      <div className="size-10 rounded-lg shadow-inner ring-1 ring-inset ring-black/10" style={{ backgroundColor: hex }} />
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{name || hex}</div>
        {name && <code className="text-xs text-gray-500 bg-transparent p-0">{hex}</code>}
      </div>
    </div>
  );
}

export function ColorRow({ children }: { children: ReactNode }) {
  return <div className="color-row flex flex-wrap gap-x-8 gap-y-2 my-4">{children}</div>;
}

export function ColorItem({ hex, name }: { hex: string; name?: string }) {
  return <Color hex={hex} name={name} />;
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

// Removed `mermaidInitialized` variable
import { useTheme } from '@/hooks/useTheme';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: resolvedTheme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        setSvg(rendered);
      } catch (e) {
        setSvg(`<pre class="text-red-500 text-sm">Failed to render Mermaid diagram.</pre>`);
      }
    };
    renderChart();
  }, [chart, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="my-6 flex justify-center not-prose [&_svg]:max-w-full [&_svg]:min-w-0"
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
