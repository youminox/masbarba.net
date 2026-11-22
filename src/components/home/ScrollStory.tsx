"use client";

import { useEffect, useRef } from "react";

const STEPS = [
  {
    n: "01",
    t: "Absorción Dermo-Hidratante en 3 Minutos (Crema-Gel 60 g)",
    d: "Sobre la piel limpia y seca, la base emoliente de You Minox penetra la epidermis sin el alcohol ni el propilenglicol que resecan y descaman las mejillas.",
  },
  {
    n: "02",
    t: "Activación Enzimática SULT1A1 y Vasodilatación del Bulbo",
    d: "El Minoxidil al 5% junto al Oxothiazolidinecarboxylate ensancha los microcapilares de la papila dérmica y despierta los folículos en reposo (fase telógena).",
  },
  {
    n: "03",
    t: "Maduración de Vello Velloso a Barba y Cabello Terminal",
    d: "Con constancia cada 12 horas (reforzada con Dermaroller 0.5 mm y Biotina), el vello fino gana queratina, grosor y pigmentación permanente entre el mes 3 y el mes 12.",
  },
];

/** Escena fijada con GSAP ScrollTrigger: la Crema-Gel penetra en la dermis, activa la microcirculación del bulbo y hace emerger el folículo terminal fuerte y denso. */
export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const init = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        const q = gsap.utils.selector(el);
        if (reduce) {
          gsap.set(q(".gel-drop-main"), { opacity: 1, y: 0, scale: 1 });
          gsap.set(q(".bulb-glow, .blood-flow, .terminal-hair, .night, .moon, .stars"), {
            opacity: 1,
          });
          gsap.set(q(".step"), { opacity: 1 });
          gsap.set(q(".bar"), { scaleX: 1 });
          return;
        }
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=2000",
            scrub: 0.7,
            pin: q(".pin")[0],
            anticipatePin: 1,
          },
        });

        tl.to(q(".step-0"), { opacity: 1, duration: 0.2 }, 0)
          .to(q(".step-0 .dot"), { backgroundColor: "#059669", color: "#fff", duration: 0.2 }, 0)
          .fromTo(
            q(".gel-drop-main"),
            { opacity: 0, scale: 0.65, y: -55 },
            { opacity: 1, scale: 1, y: 20, duration: 0.9, ease: "power2.out" },
            0
          )
          .to(q(".barrier-shield"), { opacity: 1, duration: 0.6 }, 0.35)
          .to(q(".step-0"), { opacity: 0.8, duration: 0.2 }, 1.05)
          .to(q(".step-1"), { opacity: 1, duration: 0.2 }, 1.05)
          .to(q(".step-1 .dot"), { backgroundColor: "#0f766e", color: "#fff", duration: 0.2 }, 1.05)
          .to(q(".gel-drop-main"), { y: 120, scale: 0.45, opacity: 0.3, duration: 0.7 }, 1.1)
          .to(q(".bulb-glow"), { opacity: 1, scale: 1.2, duration: 0.6 }, 1.25)
          .to(q(".blood-flow"), { opacity: 1, duration: 0.6 }, 1.45)
          .to(q(".step-1"), { opacity: 0.8, duration: 0.2 }, 2.2)
          .to(q(".step-2"), { opacity: 1, duration: 0.2 }, 2.2)
          .to(
            q(".step-2 .dot"),
            { backgroundColor: "#fbbf24", color: "#021a19", duration: 0.2 },
            2.2
          )
          .fromTo(
            q(".terminal-hair"),
            { scaleY: 0.25, opacity: 0.3, svgOrigin: "200 325" },
            { scaleY: 1, opacity: 1, svgOrigin: "200 325", duration: 0.8, ease: "power2.out" },
            2.25
          )
          .to(q(".follicle-waves"), { opacity: 1, duration: 0.45 }, 2.45)
          .to(q(".night"), { opacity: 1, duration: 0.6 }, 2.6)
          .fromTo(q(".moon"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 2.75)
          .to(q(".stars"), { opacity: 1, duration: 0.5 }, 2.85)
          .to(q(".done"), { opacity: 1, y: 0, duration: 0.4 }, 3.1)
          .to(q(".bar"), { scaleX: 1, duration: 3.5 }, 0);
      }, el);
    };

    io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io?.disconnect();
          init();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io?.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="como-actua-en-el-foliculo"
      ref={root}
      className="relative bg-gradient-to-b from-white via-[#f4fbf8] to-white"
    >
      <div className="pin flex min-h-[100svh] items-center overflow-hidden py-10 lg:py-14">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <span className="eyebrow">Del folículo dormido a la barba terminal</span>
            <h2 className="section-title mt-3">
              Tres pasos.{" "}
              <span className="text-[#059669]">La ciencia dermo-folicular real.</span>
            </h2>
            <div className="mt-4 h-1.5 w-full max-w-sm overflow-hidden rounded bg-[var(--line)]">
              <div className="bar h-full origin-left scale-x-0 bg-gradient-to-r from-[#059669] via-[#10b981] to-[#fbbf24]" />
            </div>
            <ol className="mt-6 space-y-3 sm:mt-8 sm:space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.n} className={`step step-${i} flex gap-4`} style={{ opacity: 0.8 }}>
                  <span className="dot grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white font-display font-extrabold text-[#0f172a] shadow-md">
                    {s.n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-xl">{s.t}</p>
                    <p className="text-sm text-[#475569] sm:text-base">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p
              className="done mt-6 hidden text-sm text-[var(--muted)] sm:block"
              style={{ opacity: 0, transform: "translateY(10px)" }}
            >
              Regla de oro clínica: “Un vehículo en Crema-Gel sin propilenglicol evita el 85% de
              los abandonos por caspa de barba y mantiene la piel receptiva los 12 meses.”
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[430px]">
            <svg
              viewBox="0 0 400 440"
              className="relative w-full drop-shadow-[0_30px_50px_rgba(4,47,46,0.28)]"
              role="img"
              aria-label="Animación clínica: You Minox en Crema-Gel penetra la barrera cutánea, activa la papila dérmica y hace crecer un folículo terminal fuerte"
            >
              <defs>
                <linearGradient id="mb-day" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#d1fae5" />
                  <stop offset="1" stopColor="#f4fbf8" />
                </linearGradient>
                <linearGradient id="mb-night" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#021a19" />
                  <stop offset="0.65" stopColor="#042f2e" />
                  <stop offset="1" stopColor="#064e3b" />
                </linearGradient>
                <linearGradient id="mb-dermis" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0f766e" />
                  <stop offset="0.5" stopColor="#042f2e" />
                  <stop offset="1" stopColor="#021a19" />
                </linearGradient>
                <radialGradient id="mb-bulb-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#34d399" stopOpacity="0.8" />
                  <stop offset="0.5" stopColor="#fbbf24" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                <clipPath id="mb-panel">
                  <rect x="0" y="0" width="400" height="440" rx="36" />
                </clipPath>
              </defs>

              <g clipPath="url(#mb-panel)">
                {/* Cielo Día / Noche (Ciclo cada 12h) */}
                <rect width="400" height="440" fill="url(#mb-day)" />
                <circle cx="330" cy="62" r="24" fill="#fbbf24" opacity="0.88" />
                <rect className="night" width="400" height="440" fill="url(#mb-night)" opacity="0" />
                <g className="stars" opacity="0" fill="#a7f3d0">
                  {[
                    [40, 38, 1.5],
                    [92, 76, 1.1],
                    [150, 28, 1.4],
                    [225, 62, 1],
                    [58, 118, 1.2],
                    [265, 32, 1.5],
                    [362, 115, 1.1],
                    [188, 92, 0.9],
                  ].map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} />
                  ))}
                </g>
                <g className="moon" opacity="0">
                  <circle cx="324" cy="64" r="24" fill="#fef3c7" />
                  <circle cx="335" cy="56" r="20" fill="#042f2e" />
                </g>

                {/* Capas de la Piel: Epidermis y Dermis Folicular */}
                <path
                  d="M0 175 Q100 165 200 175 T400 175 L400 440 L0 440 Z"
                  fill="url(#mb-dermis)"
                />
                {/* Escudo protector de la barrera cutánea (Ceramidas + Crema-Gel) */}
                <path
                  className="barrier-shield"
                  d="M25 173 Q110 163 200 173 T375 173"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="5"
                  strokeDasharray="10 5"
                  opacity="0.35"
                />

                {/* Etiquetas de capas dérmicas */}
                <g fontFamily="Inter, sans-serif" fontSize="10" fontWeight="800">
                  <rect x="20" y="192" width="118" height="22" rx="11" fill="rgba(52,211,153,0.18)" />
                  <text x="79" y="207" textAnchor="middle" fill="#a7f3d0">
                    EPIDERMIS HIDRATADA
                  </text>
                  <rect x="20" y="395" width="128" height="22" rx="11" fill="rgba(251,191,36,0.18)" />
                  <text x="84" y="410" textAnchor="middle" fill="#fde047">
                    PAPILA DÉRMICA · 5%
                  </text>
                </g>

                {/* Halo de activación en el bulbo piloso */}
                <circle
                  className="bulb-glow"
                  cx="200"
                  cy="335"
                  r="115"
                  fill="url(#mb-bulb-glow)"
                  opacity="0"
                />

                {/* Microcapilares sanguíneos nutriendo el bulbo */}
                <g
                  className="blood-flow"
                  opacity="0.2"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <path d="M75 375 C120 365 155 350 185 342" />
                  <path d="M325 375 C280 365 245 350 215 342" />
                  <path d="M110 415 C148 390 172 370 192 352" />
                  <path d="M290 415 C252 390 228 370 208 352" />
                </g>

                {/* Cavidad del Folículo Piloso */}
                <path
                  d="M174 175 C174 250 162 315 172 348 C180 372 220 372 228 348 C238 315 226 250 226 175 Z"
                  fill="#021312"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Gota de Crema-Gel You Minox 5% descendiendo al folículo */}
                <g className="gel-drop-main">
                  <path
                    d="M200 72 C216 96 226 112 226 128 A26 26 0 1 1 174 128 C174 112 184 96 200 72 Z"
                    fill="#34d399"
                    stroke="#ecfdf5"
                    strokeWidth="2"
                  />
                  <text
                    x="200"
                    y="134"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="900"
                    fill="#021a19"
                  >
                    5% GEL
                  </text>
                </g>

                {/* Tallo de Barba Terminal emergiendo fuerte y grueso */}
                <g className="terminal-hair">
                  <path
                    d="M190 342 C188 260 193 160 200 48 C207 160 212 260 210 342 C206 356 194 356 190 342 Z"
                    fill="#fbbf24"
                    stroke="#fef3c7"
                    strokeWidth="2"
                  />
                  <circle cx="200" cy="340" r="14" fill="#34d399" />
                </g>

                {/* Ondas de vitalidad folicular */}
                <g
                  className="follicle-waves steam"
                  opacity="0"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="4"
                  strokeLinecap="round"
                >
                  <path d="M145 135 C132 108 158 92 145 64" />
                  <path d="M255 135 C242 108 268 92 255 64" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
