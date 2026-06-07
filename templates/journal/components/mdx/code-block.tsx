"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
};

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="border-border my-8 overflow-hidden rounded-lg border">
      {(title || language) ? (
        <div className="border-border bg-surface flex items-center justify-between border-b px-4 py-2">
          <span className="text-ink-muted text-xs font-medium uppercase tracking-wide">
            {title ?? language}
          </span>
          <CopyButton copied={copied} onCopy={handleCopy} />
        </div>
      ) : (
        <div className="border-border flex justify-end border-b px-2 py-1">
          <CopyButton copied={copied} onCopy={handleCopy} />
        </div>
      )}
      <pre className="bg-surface text-ink font-mono overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

function CopyButton({
  copied,
  onCopy,
}: {
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="text-ink-muted hover:text-accent flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5" aria-hidden />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" aria-hidden />
          Copy
        </>
      )}
    </button>
  );
}
