"use client";

import { useCallback, useRef, useState } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Escena arrastrable día ↔ noche: cambia la luz sobre la ciudad y el baño masculino, mostrando la rutina de aplicación cada 12 horas (Mañana · Tarde · Noche). */
export default function DayNightSlider() {
  const [v, setV] = useState(20);
  const [touched, setTouched] = useState(false);
  const scene = useRef<HTMLDivElement>(null);

  const t = v / 100;
  const dusk = clamp(1 - Math.abs(t - 0.5) * 2.4);
  const night = clamp((t - 0.45) / 0.45);
  const stars = clamp((t - 0.62) / 0.3);
  const sunX = 110 + t * 520;
  const sunY = 95 + Math.pow(t, 1.6) * 330;
  const sunO = 1 - clamp((t - 0.55) / 0.2);
  const moonY = 420 - clamp((t - 0.5) / 0.5) * 320;
  const hour = 7 + t * 15.5;
  const hh = Math.floor(hour);
  const mm = Math.round(((hour - hh) * 60) / 15) * 15;
  const time = `${String((hh + (mm === 60 ? 1 : 0)) % 24).padStart(2, "0")}:${String(
    mm === 60 ? 0 : mm
  ).padStart(2, "0")}`;

  const phase =
    t < 0.34
      ? "Mañana · Dosis #1 (You Minox Crema-Gel)"
      : t < 0.67
      ? "Tarde · Hidratación, Biotina & Barbería"
      : "Noche · Dosis #2 (60 min antes de dormir)";

  const ritualNote =
    t < 0.34
      ? "Lava tu rostro, seca al 100% y aplica You Minox 5%: absorbe en 3 min sin escurrir ni brillar"
      : t < 0.67
      ? "Pasadas 4 h ya puedes entrenar o ir al barbero; toma tu Biotina 10,000 mcg con el almuerzo"
      : "Aplica tu segunda dosis cada 12 h (1 h antes de acostarte) para regenerar el folículo de noche";

  const fromPointer = useCallback((clientX: number) => {
    const el = scene.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setV(Math.round(clamp((clientX - r.left) / r.width) * 100));
    setTouched(true);
  }, []);

  return (
    <div className="daynight bg-[#021a19] shadow-[0_40px_80px_-40px_rgba(4,47,46,0.75)]">
      <div
        ref={scene}
        className="relative aspect-[4/5] cursor-ew-resize select-none sm:aspect-[16/9]"
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") e.preventDefault();
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          fromPointer(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1 || e.pointerType === "touch") {
            if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId))
              fromPointer(e.clientX);
          }
        }}
      >
        <svg
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="mb-dn-day" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6ee7b7" />
              <stop offset="1" stopColor="#ecfdf5" />
            </linearGradient>
            <linearGradient id="mb-dn-dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f766e" />
              <stop offset="0.52" stopColor="#d97706" />
              <stop offset="1" stopColor="#fde047" />
            </linearGradient>
            <linearGradient id="mb-dn-night" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#010e0d" />
              <stop offset="0.7" stopColor="#022422" />
              <stop offset="1" stopColor="#042f2e" />
            </linearGradient>
            <radialGradient id="mb-dn-sun" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff7d1" />
              <stop offset="0.5" stopColor="#ffd166" />
              <stop offset="1" stopColor="#ffd166" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="mb-dn-lamp" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#34d399" stopOpacity="0.55" />
              <stop offset="1" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="450" fill="url(#mb-dn-day)" />
          <rect width="800" height="450" fill="url(#mb-dn-dusk)" opacity={dusk} />
          <rect width="800" height="450" fill="url(#mb-dn-night)" opacity={night} />

          {/* Estrellas */}
          <g opacity={stars} fill="#a7f3d0">
            {[
              [60, 40, 1.6],
              [140, 90, 1.1],
              [230, 30, 1.4],
              [320, 70, 1],
              [410, 25, 1.5],
              [500, 85, 1.1],
              [590, 35, 1.3],
              [690, 70, 1],
              [760, 30, 1.4],
              [100, 160, 1],
              [380, 140, 0.9],
              [720, 150, 1.2],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r} />
            ))}
          </g>

          {/* Sol */}
          <g opacity={sunO}>
            <circle cx={sunX} cy={sunY} r="90" fill="url(#mb-dn-sun)" />
            <circle cx={sunX} cy={sunY} r="30" fill="#ffe08a" />
          </g>

          {/* Luna */}
          <g transform={`translate(640 ${moonY})`} opacity={clamp((t - 0.5) / 0.25)}>
            <circle r="30" fill="#fdf3d8" />
            <circle cx="12" cy="-8" r="26" fill="#022422" opacity={0.9 * night + 0.1} />
          </g>

          {/* Horizonte de Lima / Ciudad */}
          <path
            d="M0 330 C120 290 210 300 300 320 C400 280 520 290 620 315 C700 300 760 305 800 310 L800 450 L0 450 Z"
            fill={night > 0.5 ? "#032221" : "#6ea899"}
            opacity="0.9"
          />
          <path
            d="M0 330 C120 290 210 300 300 320 C400 280 520 290 620 315 C700 300 760 305 800 310 L800 450 L0 450 Z"
            fill="#021716"
            opacity={night}
          />
          <g fill={t > 0.5 ? "#031c1b" : "#4b8577"}>
            {[
              [40, 300, 40, 150],
              [90, 270, 36, 180],
              [135, 310, 50, 140],
              [520, 285, 40, 165],
              [565, 255, 46, 195],
              [618, 300, 36, 150],
              [660, 275, 44, 175],
              [712, 305, 48, 145],
            ].map(([x, y, w, h], i) => (
              <rect key={i} x={x} y={y} width={w} height={h} rx="3" />
            ))}
          </g>
          <g fill="#fde047" opacity={night}>
            {[
              [100, 285],
              [112, 310],
              [100, 335],
              [150, 325],
              [530, 300],
              [578, 270],
              [590, 300],
              [578, 330],
              [672, 290],
              [684, 320],
              [725, 318],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="7" height="9" rx="1" />
            ))}
          </g>

          {/* Luz de tocador nocturno */}
          <circle cx="400" cy="335" r="205" fill="url(#mb-dn-lamp)" opacity={night} />

          {/* Encimera de grooming masculino */}
          <rect x="0" y="392" width="800" height="58" fill={night > 0.5 ? "#063735" : "#8ab5a8"} />
          <rect x="0" y="392" width="800" height="58" fill="#021e1d" opacity={night * 0.72} />
          <rect x="0" y="388" width="800" height="6" fill="#ffffff" opacity="0.25" />

          {/* Tubo de You Minox 5% Crema-Gel 60g en el centro */}
          <g transform="translate(345 278)">
            <rect
              x="16"
              y="0"
              width="78"
              height="94"
              rx="12"
              fill="#042f2e"
              stroke="#34d399"
              strokeWidth="2.5"
            />
            <rect x="33" y="94" width="44" height="18" rx="4" fill="#fbbf24" />
            <text x="55" y="34" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff">
              YOU
            </text>
            <text x="55" y="50" textAnchor="middle" fontSize="12" fontWeight="900" fill="#34d399">
              MINOX
            </text>
            <text x="55" y="68" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fde047">
              5% CREMA-GEL
            </text>
            <text x="55" y="81" textAnchor="middle" fontSize="7" fontWeight="700" fill="#a7f3d0">
              60 g · DIGEMID
            </text>
          </g>

          {/* Dermaroller 0.5mm a la izquierda */}
          <g transform="translate(245 316)">
            <rect x="18" y="24" width="12" height="54" rx="5" fill="#1e293b" stroke="#94a3b8" />
            <rect x="6" y="4" width="36" height="22" rx="6" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />
          </g>

          {/* Frasco de Biotina 10,000 mcg a la derecha */}
          <g transform="translate(495 318)">
            <rect x="0" y="14" width="54" height="60" rx="8" fill="#065f46" stroke="#6ee7b7" strokeWidth="2" />
            <rect x="8" y="2" width="38" height="12" rx="3" fill="#fbbf24" />
            <text x="27" y="44" textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff">
              BIOTINA
            </text>
            <text x="27" y="56" textAnchor="middle" fontSize="7" fontWeight="800" fill="#fde047">
              10,000 mcg
            </text>
          </g>

          {/* Ondas de absorción */}
          <g
            className="steam"
            fill="none"
            stroke="#34d399"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          >
            <path d="M372 262 C360 238 386 222 372 196" />
            <path d="M402 258 C390 232 416 214 402 184" />
            <path d="M432 262 C420 238 446 222 432 196" />
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 rounded-2xl border border-white/30 bg-black/40 px-4 py-2 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-emerald-300">
            {phase}
          </p>
          <p className="font-display text-3xl font-extrabold tabular-nums">{time}</p>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 max-w-[54%] rounded-2xl border border-white/30 bg-black/40 px-4 py-3 text-right text-white backdrop-blur-md sm:right-6 sm:top-6">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#fde047]">
            Protocolo Clínico Cada 12 Horas
          </p>
          <p className="font-display text-xs font-bold leading-snug sm:text-base">{ritualNote}</p>
        </div>

        {!touched && (
          <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 animate-pulse whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#021a19] shadow-lg sm:bottom-5 sm:px-4 sm:py-2 sm:text-sm">
            ← Arrastra para ver la rutina de mañana, tarde y noche →
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 bg-[#021a19] px-5 py-4 text-white sm:px-7">
        <span aria-hidden>☀️</span>
        <label className="sr-only" htmlFor="mb-dn-range">
          Hora del día en tu rutina de barba y cabello
        </label>
        <input
          id="mb-dn-range"
          type="range"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            setV(Number(e.target.value));
            setTouched(true);
          }}
          aria-valuetext={`${phase}, ${time}`}
        />
        <span aria-hidden>🌙</span>
      </div>
    </div>
  );
}
