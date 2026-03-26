import { useState, useRef } from 'react';
import { Copy, Check, ExternalLink, ArrowRight, Info } from 'lucide-react';

const INSTALL_METHODS = {
  mac: { label: 'macOS / Linux', cmd: 'curl -fsSL https://claude.ai/install.sh | bash', prompt: '$' },
  win: { label: 'Windows', cmd: 'irm https://claude.ai/install.ps1 | iex', prompt: '>' },
  brew: { label: 'Homebrew', cmd: 'brew install --cask claude-code', prompt: '$' },
  winget: { label: 'WinGet', cmd: 'winget install Anthropic.ClaudeCode', prompt: '>' },
} as const;

const WIN_CMD = 'curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd';

type InstallKey = keyof typeof INSTALL_METHODS;

const TARGETS = [
  { key: 'terminal', label: 'Terminal' },
  { key: 'desktop', label: 'Desktop' },
  { key: 'vscode', label: 'VS Code' },
  { key: 'jetbrains', label: 'JetBrains' },
] as const;

const ALT_INFO: Record<string, { name: string; installLabel: string; installHref: string; guideHref: string; altCmd?: string }> = {
  desktop: { name: 'Desktop', installLabel: 'Download the app', installHref: '#', guideHref: '/desktop-quickstart' },
  vscode: { name: 'VS Code', installLabel: 'Install from Marketplace', installHref: '#', guideHref: '/vs-code', altCmd: 'code --install-extension anthropic.claude-code' },
  jetbrains: { name: 'JetBrains', installLabel: 'Install from Marketplace', installHref: '#', guideHref: '/jetbrains' },
};

const PROVIDERS = [
  { key: 'anthropic', label: 'Anthropic' },
  { key: 'bedrock', label: 'Amazon Bedrock' },
  { key: 'foundry', label: 'Microsoft Foundry' },
  { key: 'vertex', label: 'Google Vertex AI' },
] as const;

const PROVIDER_NOTICES: Record<string, string> = {
  bedrock: 'Configure your AWS account first. Running on Bedrock requires model access enabled in the AWS console and IAM credentials.',
  vertex: 'Configure your GCP project first. Running on Vertex AI requires the Vertex API enabled and a service account with the right permissions.',
  foundry: 'Configure your Azure resources first. Running on Microsoft Foundry requires an Azure subscription with a Foundry resource and model deployments provisioned.',
};

export function InstallConfigurator() {
  const [target, setTarget] = useState<string>('terminal');
  const [pkg, setPkg] = useState<InstallKey>('mac');
  const [team, setTeam] = useState(false);
  const [provider, setProvider] = useState('anthropic');
  const [useCmdPrompt, setUseCmdPrompt] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    setCopied(key);
    copyTimer.current = setTimeout(() => setCopied(null), 1800);
  };

  const isWin = pkg === 'win';
  const cmd = isWin && useCmdPrompt ? WIN_CMD : INSTALL_METHODS[pkg].cmd;
  const prompt = isWin ? (useCmdPrompt ? '>' : '>') : INSTALL_METHODS[pkg].prompt;
  const alt = ALT_INFO[target];
  const showProviderNotice = team && provider !== 'anthropic';

  return (
    <div className="my-6 text-sm not-prose">
      {/* Target tabs: Terminal / Desktop / VS Code / JetBrains */}
      <div className="inline-flex gap-0.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-x-auto max-w-full">
        {TARGETS.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTarget(t.key)}
            className={`px-4 py-2.5 text-[15px] font-normal rounded-lg whitespace-nowrap transition-colors ${
              target === t.key
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Team toggle */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => setTeam(!team)}
          className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg border transition-colors w-fit ${
            team
              ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/25'
              : 'bg-neutral-100 dark:bg-neutral-800 border-transparent dark:border-neutral-700/50 hover:border-neutral-200 dark:hover:border-neutral-600'
          }`}
        >
          <span className={`flex items-center justify-center w-4 h-4 rounded border flex-shrink-0 ${
            team
              ? 'bg-[#c6613f] border-[#c6613f]'
              : 'bg-white dark:bg-transparent border-neutral-300 dark:border-neutral-500'
          }`}>
            {team && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </span>
          <span className="text-neutral-600 dark:text-neutral-300">
            I'm buying for a team or company (SSO, AWS/Azure/GCP, central billing)
          </span>
        </button>
      </div>

      {/* Team reveal: sales CTA + provider selector */}
      {team && (
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg flex-wrap">
            <div className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed flex-1 min-w-[200px]">
              <strong className="font-semibold text-neutral-900 dark:text-neutral-100">Set up your team:</strong> self-serve or talk to sales.
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <a href="#" className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700">
                Get started
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-white bg-[#c6613f] hover:bg-[#d97757] rounded-lg">
                Contact sales <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-[13px] flex-wrap">
            <span className="text-neutral-500 dark:text-neutral-400 flex-shrink-0">Run on</span>
            <div className="flex gap-1 flex-wrap">
              {PROVIDERS.map(p => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setProvider(p.key)}
                  className={`px-3 py-1.5 rounded-md text-[13px] whitespace-nowrap ${
                    provider === p.key
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 font-medium shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {showProviderNotice && (
            <div className="flex gap-3.5 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg items-start">
              <Info className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {PROVIDER_NOTICES[provider]?.split('.')[0]}.
                </strong>{' '}
                {PROVIDER_NOTICES[provider]?.split('.').slice(1).join('.').trim()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Terminal install card */}
      {target === 'terminal' && (
        <>
          <div className="bg-[#141413] rounded-xl overflow-hidden">
            {/* Sub-tabs: macOS/Linux, Windows, Homebrew, WinGet */}
            <div className="flex items-center bg-[#1a1918] border-b border-white/[0.08] px-2 overflow-x-auto">
              {(Object.keys(INSTALL_METHODS) as InstallKey[]).map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setPkg(k)}
                  className={`relative px-4 py-3 text-xs whitespace-nowrap ${
                    pkg === k ? 'text-white' : 'text-white/50 hover:text-white/75'
                  }`}
                >
                  {INSTALL_METHODS[k].label}
                  {pkg === k && (
                    <span className="absolute left-3 right-3 bottom-0 h-0.5 bg-[#d97757]" />
                  )}
                </button>
              ))}
              <span className="flex-1" />
              {isWin && (
                <button
                  type="button"
                  onClick={() => setUseCmdPrompt(!useCmdPrompt)}
                  className="flex items-center gap-2 px-3 text-[11px] text-white/50 hover:text-white/75 whitespace-nowrap"
                >
                  <span className={`flex items-center justify-center w-3 h-3 rounded-[3px] border flex-shrink-0 ${
                    useCmdPrompt ? 'bg-[#c6613f] border-[#c6613f]' : 'border-white/30'
                  }`}>
                    {useCmdPrompt && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                  </span>
                  CMD instead of PowerShell
                </button>
              )}
            </div>

            {/* Command body */}
            <div className="flex items-start gap-3.5 px-6 py-6">
              <span className="text-[#d97757] font-mono text-[17px] select-none pt-0.5">{prompt}</span>
              <div className="flex-1 font-mono text-[17px] text-[#f0eee6] leading-relaxed whitespace-pre-wrap break-words">
                {cmd}
              </div>
              <button
                type="button"
                onClick={() => handleCopy(cmd, 'term')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium flex-shrink-0 border transition-colors ${
                  copied === 'term'
                    ? 'bg-[#c6613f] border-[#c6613f] text-white'
                    : 'bg-white/[0.08] border-white/[0.12] text-white/85 hover:bg-white/[0.14]'
                }`}
              >
                {copied === 'term' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'term' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Below-card notes */}
          <div className="mt-3 text-[13px] text-neutral-500 dark:text-neutral-400 flex gap-4 flex-wrap items-baseline">
            {isWin && (
              <span>Requires <a href="https://git-scm.com/downloads/win" target="_blank" rel="noopener" className="text-neutral-600 dark:text-neutral-300 border-b border-neutral-300 dark:border-neutral-600 hover:text-[#c6613f] hover:border-[#c6613f]">Git for Windows</a>.</span>
            )}
            {(pkg === 'brew' || pkg === 'winget') && (
              <span>
                Does not auto-update. Run{' '}
                <code className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">
                  {pkg === 'brew' ? 'brew upgrade claude-code' : 'winget upgrade Anthropic.ClaudeCode'}
                </code>{' '}
                periodically.
              </span>
            )}
            <a href="#/troubleshooting" className="text-neutral-600 dark:text-neutral-300 border-b border-neutral-300 dark:border-neutral-600 hover:text-[#c6613f] hover:border-[#c6613f]">Troubleshooting</a>
          </div>
        </>
      )}

      {/* Alt target handoff (Desktop, VS Code, JetBrains) */}
      {alt && (
        <div className="p-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
          <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 mb-3.5">
            <strong className="font-semibold text-neutral-900 dark:text-neutral-100">The steps below use the command line.</strong>{' '}
            Prefer {alt.name}? Install here, then follow the {alt.name} guide instead.
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <a href={alt.installHref} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-white bg-[#c6613f] hover:bg-[#d97757] rounded-lg">
              {alt.installLabel} <ExternalLink className="w-3 h-3" />
            </a>
            <a href={`#${alt.guideHref}`} className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700">
              {alt.name} guide <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          {alt.altCmd && (
            <div className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              or run{' '}
              <code className="text-[11px] font-mono bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-300">{alt.altCmd}</code>
              <button
                type="button"
                onClick={() => handleCopy(alt.altCmd!, 'alt')}
                className={`inline-flex items-center justify-center w-5 h-5 ml-1 align-middle rounded transition-colors ${
                  copied === 'alt'
                    ? 'bg-[#c6613f] text-white'
                    : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {copied === 'alt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
