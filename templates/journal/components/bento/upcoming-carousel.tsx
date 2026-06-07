"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const INTERVAL_MS = 5000;

export type UpcomingSlide = {
  title: string;
  description: string;
  href?: string;
};

type Props = {
  slides: UpcomingSlide[];
  prevLabel: string;
  nextLabel: string;
  label: string;
};

export function UpcomingCarousel({ slides, prevLabel, nextLabel, label }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = slides.length || 1;
  const safeIndex = ((index % n) + n) % n;
  const slide = slides[safeIndex] ?? slides[0];

  const tick = useCallback(() => {
    if (paused || slides.length <= 1) return;
    setIndex((i) => i + 1);
  }, [paused, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = window.setInterval(tick, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length, tick]);

  const resumeAfterTouch = () => {
    window.setTimeout(() => setPaused(false), 500);
  };

  if (!slide) return null;

  return (
    <div
      className="relative flex h-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={resumeAfterTouch}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {/* Top-right carousel controls – styled as grid cells */}
      <div className="absolute top-0 right-0 z-10 flex gap-bento-gap bg-black">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label={prevLabel}
          className="border-bento-ink bg-bento-bg text-bento-ink hover:bg-bento-ink hover:text-bento-bg flex min-h-11 min-w-11 items-center justify-center p-2 transition-colors md:min-h-0 md:min-w-0 md:p-3"
          style={{ borderLeftWidth: 'var(--spacing-bento-gap)', borderBottomWidth: 'var(--spacing-bento-gap)' }}
        >
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label={nextLabel}
          className="border-bento-ink bg-bento-bg text-bento-ink hover:bg-bento-ink hover:text-bento-bg flex min-h-11 min-w-11 items-center justify-center p-2 transition-colors md:min-h-0 md:min-w-0 md:p-3"
          style={{ borderBottomWidth: 'var(--spacing-bento-gap)' }}
        >
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Label */}
      <div className="px-4 py-2 md:px-6 md:py-3">
        <p className="border-bento-ink text-bento-ink inline-block border-b-2 text-xs font-bold uppercase tracking-[0.15em]">
          {label}
        </p>
      </div>

      {/* Content */}
      <div
        key={safeIndex}
        className="flex min-h-[200px] flex-1 flex-col justify-center px-5 py-4 md:min-h-0 md:px-8 md:py-6"
        style={{ animation: "bento-tag-in 0.35s ease-out" }}
      >
        {slide.href ? (
          <Link
            href={slide.href}
            className="text-bento-ink font-(family-name:--font-serif-display) text-xl font-bold leading-tight transition-opacity hover:opacity-70 md:text-3xl"
          >
            {slide.title}
          </Link>
        ) : (
          <h3 className="text-bento-ink font-(family-name:--font-serif-display) text-xl font-bold leading-tight md:text-3xl">
            {slide.title}
          </h3>
        )}
        <p className="text-bento-ink mt-2 text-sm font-medium leading-snug opacity-80 md:mt-3 md:text-base">
          {slide.description}
        </p>
      </div>
    </div>
  );
}
