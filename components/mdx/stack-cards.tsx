"use client";

import { useState } from "react";
import clsx from "clsx";

const STACK_EN = [
  {
    name: "Next.js 16",
    role: "App Router & RSC",
    detail:
      "File-based routing under app/[locale]/, static generation for posts, and server components for the bento home grid.",
  },
  {
    name: "MDX",
    role: "Content layer",
    detail:
      "@next/mdx with remark-gfm for tables and GFM syntax. Posts export postMeta and render as React components.",
  },
  {
    name: "Tailwind v4",
    role: "Styling",
    detail:
      "Design tokens in globals.css — paper, ink, accent for posts; bento-bg and bento-ink for the home grid.",
  },
  {
    name: "next-intl",
    role: "i18n",
    detail:
      "Locale-prefixed routes (/en, /zh), translated UI strings in messages/, and per-locale post content where available.",
  },
] as const;

const STACK_ZH = [
  {
    name: "Next.js 16",
    role: "App Router 與 RSC",
    detail:
      "在 app/[locale]/ 下以檔案路由組織頁面，文章靜態生成，首頁 bento 網格以 Server Component 渲染。",
  },
  {
    name: "MDX",
    role: "內容層",
    detail:
      "使用 @next/mdx 搭配 remark-gfm 支援表格與 GFM 語法。每篇文章匯出 postMeta 並作為 React 元件渲染。",
  },
  {
    name: "Tailwind v4",
    role: "樣式",
    detail:
      "在 globals.css 定義設計 token：文章用 paper、ink、accent；首頁 bento 用 bento-bg、bento-ink。",
  },
  {
    name: "next-intl",
    role: "多語系",
    detail:
      "路由帶語系前綴（/en、/zh），UI 字串放在 messages/，文章內容可為各語系分別撰寫。",
  },
] as const;

type StackCardsProps = {
  locale?: "en" | "zh";
};

export function StackCards({ locale = "en" }: StackCardsProps) {
  const STACK = locale === "zh" ? STACK_ZH : STACK_EN;
  const [active, setActive] = useState(0);

  return (
    <div className="my-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {STACK.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(i)}
            className={clsx(
              "border-border rounded-lg border p-4 text-left transition-colors",
              active === i
                ? "border-accent bg-accent-soft/50"
                : "bg-surface hover:border-accent/50",
            )}
            aria-pressed={active === i}
          >
            <p className="text-ink text-sm font-bold md:text-base">{item.name}</p>
            <p className="text-ink-muted mt-1 text-xs">{item.role}</p>
          </button>
        ))}
      </div>
      <p className="text-ink-muted mt-4 text-base leading-relaxed">
        {STACK[active].detail}
      </p>
    </div>
  );
}
