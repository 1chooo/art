"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: { src: string; alt: string }[];
  prevLabel: string;
  nextLabel: string;
};

export function ImageCarousel({ images, prevLabel, nextLabel }: Props) {
  const [index, setIndex] = useState(0);
  const n = images.length || 1;
  const safeIndex = ((index % n) + n) % n;
  const current = images[safeIndex];

  if (!current) return null;

  return (
    <div className="relative flex aspect-[4/3] min-h-[240px] items-center justify-center md:aspect-auto md:h-full md:min-h-[320px]">
      <Image
        src={current.src}
        alt={current.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
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
    </div>
  );
}
