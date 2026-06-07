"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const INTERVAL_MS = 5000;

type Props = {
  images: { src: string; alt: string }[];
  prevLabel: string;
  nextLabel: string;
};

export function ImageCarousel({ images, prevLabel, nextLabel }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = images.length || 1;
  const safeIndex = ((index % n) + n) % n;
  const current = images[safeIndex];

  const tick = useCallback(() => {
    if (paused || images.length <= 1) return;
    setIndex((i) => i + 1);
  }, [paused, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(tick, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [images.length, tick]);

  const resumeAfterTouch = () => {
    window.setTimeout(() => setPaused(false), 500);
  };

  if (!current) return null;

  return (
    <div
      className="relative flex aspect-4/3 min-h-[240px] items-center justify-center md:aspect-auto md:h-full md:min-h-[320px]"
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
      <Image
        key={safeIndex}
        src={current.src}
        alt={current.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority={safeIndex === 0}
        style={{ animation: "bento-tag-in 0.35s ease-out" }}
      />
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
    </div>
  );
}
