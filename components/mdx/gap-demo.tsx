"use client";

import { useState } from "react";
import clsx from "clsx";

const PRESETS = { mobile: 8, desktop: 16 } as const;

const labels = {
  en: {
    heading: "Adjust the gap",
    token: "CSS variable",
    mobile: "Mobile (8px)",
    desktop: "Desktop (16px)",
    preview: "Mini bento preview",
  },
  zh: {
    heading: "調整間距",
    token: "CSS 變數",
    mobile: "手機 (8px)",
    desktop: "桌面 (16px)",
    preview: "迷你 bento 預覽",
  },
} as const;

type GapDemoProps = {
  locale?: "en" | "zh";
};

export function GapDemo({ locale = "en" }: GapDemoProps) {
  const t = labels[locale];
  const [gap, setGap] = useState<number>(PRESETS.mobile);

  return (
    <div className="border-border my-8 rounded-lg border p-5">
      <p className="text-ink-muted mb-4 text-xs font-bold uppercase tracking-[0.12em]">
        {t.heading}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setGap(PRESETS.mobile)}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
            gap === PRESETS.mobile
              ? "bg-accent text-paper"
              : "bg-accent-soft text-accent hover:opacity-90",
          )}
        >
          {t.mobile}
        </button>
        <button
          type="button"
          onClick={() => setGap(PRESETS.desktop)}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
            gap === PRESETS.desktop
              ? "bg-accent text-paper"
              : "bg-accent-soft text-accent hover:opacity-90",
          )}
        >
          {t.desktop}
        </button>
      </div>

      <label className="text-ink mb-2 block text-sm font-medium">
        {t.token}:{" "}
        <InlineCodeDisplay>{`--spacing-bento-gap: ${gap}px`}</InlineCodeDisplay>
      </label>
      <input
        type="range"
        min={4}
        max={24}
        step={1}
        value={gap}
        onChange={(e) => setGap(Number(e.target.value))}
        className="accent-accent mb-6 w-full"
        aria-label={t.heading}
      />

      <p className="text-ink-muted mb-3 text-xs font-bold uppercase tracking-[0.12em]">
        {t.preview}
      </p>
      <div className="rounded-lg bg-black" style={{ padding: gap }}>
        <div
          className="grid grid-cols-2 bg-black"
          style={{ gap }}
        >
          {["A", "B", "C", "D"].map((cell) => (
            <div
              key={cell}
              className="bg-bento-bg text-bento-ink flex aspect-square items-center justify-center font-bold"
            >
              {cell}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InlineCodeDisplay({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-surface text-ink font-mono rounded px-1.5 py-0.5 text-[0.875em]">
      {children}
    </code>
  );
}
