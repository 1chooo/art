"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type UpcomingSlide = {
  title: string;
  description: string;
};

type Props = {
  slides: UpcomingSlide[];
  prevLabel: string;
  nextLabel: string;
  label: string;
};

export function UpcomingCarousel({ slides, prevLabel, nextLabel, label }: Props) {
  const [index, setIndex] = useState(0);
  const n = slides.length || 1;
  const safeIndex = ((index % n) + n) % n;
  const slide = slides[safeIndex] ?? slides[0];

  if (!slide) return null;

  return (
    <div className="relative flex h-full flex-col">
      {/* Top-right carousel controls – styled as grid cells */}
      <div className="absolute top-0 right-0 z-10 flex gap-2 bg-black md:gap-4">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label={prevLabel}
          className="border-bento-ink bg-bento-bg text-bento-ink hover:bg-bento-ink hover:text-bento-bg flex items-center justify-center p-2 transition-colors md:p-3 border-l-8 border-b-8"
        >
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label={nextLabel}
          className="border-bento-ink bg-bento-bg text-bento-ink hover:bg-bento-ink hover:text-bento-bg flex items-center justify-center p-2 transition-colors md:p-3 border-b-8"
        >
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Label */}
      <div className="px-4 py-2 md:px-6 md:py-3">
        <p className="border-bento-ink inline-block border-b-2 text-xs font-bold uppercase tracking-[0.15em]">
          {label}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-center px-5 py-4 md:px-8 md:py-6">
        <h3 className="text-bento-ink font-[family-name:var(--font-serif-display)] text-xl font-bold leading-tight md:text-3xl">
          {slide.title}
        </h3>
        <p className="text-bento-ink mt-2 text-sm font-medium leading-snug opacity-80 md:mt-3 md:text-base">
          {slide.description}
        </p>
      </div>
    </div>
  );
}
