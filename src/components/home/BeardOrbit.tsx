"use client";

import Link from "next/link";
import { useState } from "react";

export type OrbitItem = {
  k: string;
  name: string;
  img: string;
  role: string;
  d: string;
  href: string;
};

/** Órbita de 8 pilares clínicos y estéticos en anillos giratorios; al elegir uno se muestra su ficha y el enlace a su guía. */
export default function BeardOrbit({
  items,
  center,
}: {
  items: OrbitItem[];
  center: string;
}) {
  const [active, setActive] = useState(0);
  const a = items[active];

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
      <div className="orbit mx-auto w-full max-w-[540px]">
        <div className="orbit-ring" />
        <div className="orbit-ring r2" />
        <div className="absolute inset-[24%] grid place-items-center overflow-hidden rounded-full border-4 border-emerald-200/80 bg-gradient-to-br from-[#021a19] via-[#042f2e] to-[#059669] p-2 shadow-[inset_0_10px_40px_rgba(0,0,0,0.45)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={center}
            alt="Crecimiento de barba y salud capilar en MásBarba.net"
            className="h-full w-full rounded-full object-cover shadow-xl"
          />
        </div>
        <div className="orbit-spin">
          {items.map((it, i) => {
            const ang = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(ang) * 44;
            const y = 50 + Math.sin(ang) * 44;
            const on = i === active;
            return (
              <div
                key={it.k}
                className="orbit-item absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={`Ver ${it.name}`}
                    className={`group grid h-14 w-14 place-items-center overflow-hidden rounded-full border-[3px] bg-white shadow-lg transition-all duration-300 sm:h-[76px] sm:w-[76px] cursor-pointer ${
                      on
                        ? "scale-110 border-[#059669] shadow-[0_12px_30px_-10px_rgba(5,150,105,0.85)]"
                        : "border-white hover:border-[#059669]/60"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={it.img}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold sm:block ${
                      on
                        ? "bg-[#059669] text-white"
                        : "bg-white/95 text-[#0f172a] shadow"
                    }`}
                  >
                    {it.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <span className="eyebrow">Ecosistema folicular de 360°</span>
        <h2 className="section-title mt-3">
          Los 8 pilares que <span className="text-[#059669]">pueblan tu barba y cabello</span>
        </h2>
        <p className="mt-3 text-[var(--muted)]">
          Toca cualquier nodo de la órbita: desde la fórmula en Crema-Gel de You Minox al 5%, el
          Dermaroller de 0.5 mm y la Biotina hasta el control de DHT y el perfilado en barbería.
        </p>
        <div
          key={active}
          className="card card-static spot mt-7 p-7"
          style={{ animation: "fadeup .5s ease both" }}
        >
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-emerald-200 bg-[#f4fbf8]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={a.img}
                alt={a.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold leading-tight">
                {a.name}
              </p>
              <p className="text-sm font-semibold text-[#059669]">{a.role}</p>
            </div>
          </div>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)]">{a.d}</p>
          <Link
            href={a.href}
            className="mt-5 inline-flex items-center gap-2 font-bold text-[#047857] hover:underline"
          >
            Explorar guía clínica: {a.name} →
          </Link>
        </div>
        <div
          className="mt-5 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Pilares de crecimiento de barba y cabello"
        >
          {items.map((it, i) => (
            <button
              key={it.k}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                i === active
                  ? "border-[#059669] bg-[#059669] text-white"
                  : "border-[var(--line)] bg-white hover:border-[#059669]"
              }`}
            >
              {it.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
