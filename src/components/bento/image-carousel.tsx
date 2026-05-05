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
      {/* Bottom-left carousel controls */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-1 md:bottom-6 md:left-6">
        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label={prevLabel}
          className="border-bento-ink bg-bento-bg/90 text-bento-ink hover:bg-bento-ink hover:text-bento-bg border-2 p-1.5 backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label={nextLabel}
          className="border-bento-ink bg-bento-bg/90 text-bento-ink hover:bg-bento-ink hover:text-bento-bg border-2 p-1.5 backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="size-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
