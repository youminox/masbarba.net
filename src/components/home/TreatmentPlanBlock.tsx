"use client";

import Link from "next/link";
import { useState } from "react";
import OpenChatButton from "@/components/OpenChatButton";
import { YOU_MINOX_URL } from "@/lib/data";

export type TreatmentOption = {
  key: string;
  label: string;
  tier: string;
  durationMonths: number;
  tubesNeeded: number;
  formulaType: string;
  img: string;
  alt: string;
  desc: string;
  components: string;
  href: string;
};

/**
 * Planificador interactivo de Tratamiento Folicular y Calculadora de Ciclo You Minox 5%:
 * Alterna entre 3 objetivos (Despertar Folicular 3m, Cerrar Huecos 6m, Consolidación Terminal 12m)
 * y calcula cuántas aplicaciones y tubos de 60 g necesitas según tus meses de tratamiento.
 */
export default function TreatmentPlanBlock({
  options,
}: {
  options: TreatmentOption[];
}) {
  const [k, setK] = useState(options[0].key);
  const [monthsTarget, setMonthsTarget] = useState(6);

  const p = options.find((o) => o.key === k) || options[0];
  const applicationsTotal = monthsTarget * 60; // 2 veces al día × 30 días
  const tubesTotal = Math.max(1, Math.ceil(monthsTarget / 1.5)); // 1 tubo de 60g rinde ~45 días
  const microneedlingSessions = monthsTarget * 6; // ~1.5 sesiones por semana

  return (
    <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="card card-static spot relative overflow-hidden p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#10b981]/15 blur-3xl" />
        <div className="relative">
          <div
            className="inline-flex flex-wrap rounded-full bg-[#f4fbf8] border border-[var(--line)] p-1"
            role="tablist"
            aria-label="Objetivo de Tratamiento Folicular"
          >
            {options.map((o) => (
              <button
                key={o.key}
                role="tab"
                type="button"
                aria-selected={o.key === k}
                onClick={() => {
                  setK(o.key);
                  setMonthsTarget(o.durationMonths);
                }}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition cursor-pointer ${
                  o.key === k
                    ? "bg-[#059669] text-white shadow"
                    : "text-[var(--muted)] hover:text-[#0f172a]"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_1.15fr]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[250px] overflow-hidden rounded-2xl border border-[var(--line)] shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={p.img}
                src={p.img}
                alt={p.alt}
                className="h-full w-full object-cover"
                style={{ animation: "fadeup .45s ease both" }}
              />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
                {p.tier}
              </p>
              <p
                className="mt-1 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f172a]"
                aria-live="polite"
              >
                {p.durationMonths} Meses
              </p>
              <p className="mt-0.5 text-sm font-semibold text-[#047857]">
                Ciclo recomendado · {p.formulaType}
              </p>
              <p className="mt-2.5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {p.desc}
              </p>
              <p className="mt-2 rounded-xl bg-[#f4fbf8] border border-emerald-200/70 px-3 py-2 text-xs text-[#0f172a]">
                <strong>Sinergia recomendada:</strong> {p.components}
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-buy shine flex-1 text-sm"
              data-magnetic
            >
              Ver You Minox 5% Oficial →
            </a>
            <OpenChatButton
              label="Armar mi rutina con IA"
              prompt={`Quiero seguir el protocolo "${p.label}" (${p.components}) durante ${p.durationMonths} meses. ¿Cómo debo aplicarlo paso a paso?`}
              className="btn btn-ghost text-sm"
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#021a19] via-[#042f2e] to-[#064e3b] p-6 text-white sm:p-8">
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-[#34d399]/15 blur-3xl" />
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#fde047]">
          Calculadora Clínica de Ciclo Folicular
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
          Planifica tu transformación mes a mes
        </h3>
        <p className="mt-2 text-sm text-white/75">
          Desliza cuántos meses de tratamiento deseas planificar. Calculamos tus aplicaciones
          totales cada 12 horas, tubos de Crema-Gel de 60 g y sesiones con Dermaroller 0.5 mm.
        </p>

        <label
          htmlFor="mb-months"
          className="mt-6 flex items-center justify-between text-sm font-semibold"
        >
          <span>Duración de tu ciclo constante</span>
          <span className="rounded-full bg-white/10 px-3.5 py-1 font-display text-lg text-[#fde047]">
            {monthsTarget} {monthsTarget === 1 ? "mes" : "meses"}
          </span>
        </label>
        <input
          id="mb-months"
          type="range"
          min={1}
          max={12}
          step={1}
          value={monthsTarget}
          onChange={(e) => setMonthsTarget(Number(e.target.value))}
          className="mt-3 w-full accent-[#34d399]"
        />
        <div className="mt-1 flex justify-between text-[0.7rem] text-white/50">
          {[1, 3, 6, 9, 12].map((n) => (
            <span key={n}>{n}m</span>
          ))}
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            ["Dosis (cada 12h)", `${applicationsTotal}`],
            ["Tubos 60g estimados", `${tubesTotal} u.`],
            ["Sesiones Dermaroller", `${microneedlingSessions}`],
          ].map(([l, val], i) => (
            <div
              key={l}
              className={`glass flex flex-col-reverse p-3 ${
                i === 1 ? "border-[#34d399]/50 bg-[#34d399]/10" : ""
              }`}
            >
              <dt className="mt-1 text-[0.7rem] leading-tight text-white/65">{l}</dt>
              <dd
                className={`font-display font-extrabold ${
                  i === 1
                    ? "text-xl text-[#fde047] sm:text-2xl"
                    : "text-xl sm:text-2xl"
                }`}
              >
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-xs text-white/70">
          En un ciclo de <strong className="text-[#fde047]">{monthsTarget} meses</strong> realizas{" "}
          {applicationsTotal} aplicaciones tópicas y unas {microneedlingSessions} sesiones suaves de
          microneedling.{" "}
          <Link href={p.href} className="text-emerald-300 font-bold underline hover:text-white">
            Leer guía completa de tiempos de resultados →
          </Link>
        </p>
      </div>
    </div>
  );
}
