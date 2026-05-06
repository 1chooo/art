"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { BentoLabel } from "@/components/bento/bento-label";

const INTERVAL_MS = 3000;

type Props = {
  tags: string[];
  label: string;
  tagFallback: string;
};

export function TagCarousel({ tags, label, tagFallback }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = tags.length;
  const safeIndex = n > 0 ? ((index % n) + n) % n : 0;
  const currentTag = n > 0 ? tags[safeIndex] : null;

  const tick = useCallback(() => {
    if (paused || tags.length === 0) return;
    setIndex((i) => i + 1);
  }, [paused, tags.length]);

  useEffect(() => {
    if (tags.length <= 1) return;
    const id = window.setInterval(tick, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [tags.length, tick]);

  return (
    <section
      className="bg-bento-bg flex flex-col items-center justify-center p-4 text-center md:col-span-3 md:p-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <BentoLabel>{label}</BentoLabel>
      {currentTag ? (
        <Link
          key={currentTag}
          href={`/posts?tag=${encodeURIComponent(currentTag)}`}
          className="font-[family-name:var(--font-serif-display)] text-bento-ink text-xl font-bold transition-opacity hover:opacity-70 md:text-2xl"
          style={{ animation: "bento-tag-in 0.35s ease-out" }}
        >
          {currentTag}
        </Link>
      ) : (
        <p className="font-[family-name:var(--font-serif-display)] text-bento-ink text-xl font-bold md:text-2xl">
          {tagFallback}
        </p>
      )}
    </section>
  );
}
