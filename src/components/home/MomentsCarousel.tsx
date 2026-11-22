"use client";

import Link from "next/link";
import { useRef } from "react";

export type Moment = {
  img: string;
  t: string;
  d: string;
  href: string;
  alt: string;
  tag?: string;
};

/** Carrusel horizontal con snap de tarjetas 4:5 que enlazan a situaciones reales de crecimiento de barba y cabello. */
export default function MomentsCarousel({ items }: { items: Moment[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("a") as HTMLElement | null;
    el.scrollBy({
      left: dir * ((card?.offsetWidth || 300) + 20),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="absolute -top-20 right-0 hidden gap-2 sm:flex">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => go(d as 1 | -1)}
            className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line)] bg-white text-xl text-[#0f172a] shadow-sm transition hover:border-[#059669] hover:text-[#059669] cursor-pointer"
            aria-label={d < 0 ? "Anterior" : "Siguiente"}
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
      <div
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto scroll-smooth px-4 pb-4"
        data-lenis-prevent-horizontal
      >
        {items.map((m, i) => (
          <Link
            key={m.t}
            href={m.href}
            className="card group relative w-[76%] shrink-0 snap-start overflow-hidden sm:w-[44%] lg:w-[calc(25%-15px)]"
            data-reveal
            data-reveal-delay={String(Math.min(i, 3))}
          >
            <div className="relative aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.img}
                alt={m.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021a19]/95 via-[#021a19]/25 to-transparent" />
              <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-2">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#047857] backdrop-blur">
                  0{i + 1}
                </span>
                {m.tag && (
                  <span className="rounded-full bg-[#059669]/90 px-2.5 py-1 text-[11px] font-bold text-emerald-100 backdrop-blur">
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-2xl font-extrabold leading-tight">
                  {m.t}
                </p>
                <p className="mt-1.5 text-sm text-white/80 line-clamp-3">{m.d}</p>
                <span className="mt-3 inline-block text-sm font-bold text-[#fde047]">
                  Leer guía clínica →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
