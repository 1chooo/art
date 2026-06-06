"use client";

import createGlobe, { type Marker } from "cobe";
import { useEffect, useRef } from "react";
import type { LocationPoint } from "@/lib/locations";

type Props = {
  locations: LocationPoint[];
  labels: Record<string, string>;
};

export function CobeGlobe({ locations, labels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let phi = 0;
    let width = 0;

    const onResize = () => {
      width = wrapper.offsetWidth;
    };

    onResize();
    window.addEventListener("resize", onResize);

    const markers: Marker[] = locations.map((point) => ({
      id: point.id,
      location: point.location,
      size: point.current ? 0.06 : 0.04,
      color: point.current ? [0.12, 0.12, 0.12] : undefined,
    }));

    const arcs = [
      { from: locations[1].location, to: locations[2].location },
      { from: locations[2].location, to: locations[0].location },
    ];

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.97, 0.96, 0.93],
      markerColor: [0.45, 0.45, 0.45],
      glowColor: [0.97, 0.96, 0.93],
      markers,
      arcs,
      arcColor: [0.12, 0.12, 0.12],
      arcWidth: 0.35,
      arcHeight: 0.25,
    });

    let frame = 0;
    const animate = () => {
      phi += 0.004;
      globe.update({
        phi,
        width: width * 2,
        height: width * 2,
      });
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [locations]);

  return (
    <div className="mx-auto w-full max-w-lg">
      <div
        ref={wrapperRef}
        className="relative aspect-square w-full"
        aria-hidden
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full"
          style={{ contain: "layout paint size" }}
        />
        {locations.map((point) => (
          <div
            key={point.id}
            className="bg-ink text-paper pointer-events-none absolute rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap"
            style={{
              positionAnchor: `--cobe-${point.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% -8px",
              opacity: `var(--cobe-visible-${point.id}, 0)`,
              transition: "opacity 0.2s",
            }}
          >
            {labels[point.id]}
          </div>
        ))}
      </div>
    </div>
  );
}
