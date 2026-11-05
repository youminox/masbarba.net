"use client";

import { useState } from "react";
import Link from "next/link";
import { YOU_MINOX_URL } from "@/lib/data";

type GoalKey = "barba-cero" | "huecos-barba" | "caida-cabello" | "irritacion";
type SkinKey = "sensible" | "normal" | "grasa";

const GOALS: {
  key: GoalKey;
  icon: string;
  title: string;
  subtitle: string;
}[] = [
  {
    key: "barba-cero",
    icon: "🧔",
    title: "Poblar la Barba desde Cero",
    subtitle: "Tengo poco vello facial o solo bigote/mentón y busco barba completa",
  },
  {
    key: "huecos-barba",
    icon: "🎯",
    title: "Cerrar Huecos o Parches en Mejillas",
    subtitle: "Mi barba crece pero tiene espacios vacíos o falta de densidad",
  },
  {
    key: "caida-cabello",
    icon: "💇‍♂️",
    title: "Frenar Alopecia, Entradas o Coronilla",
    subtitle: "Busco engrosar el cabello débil y detener la caída androgenética",
  },
  {
    key: "irritacion",
    icon: "🛡️",
    title: "Evitar Resequedad, Caspa o Granos",
    subtitle: "El minoxidil líquido me irritó la piel y busco una alternativa suave",
  },
];

const SKIN_TYPES: { key: SkinKey; label: string; desc: string }[] = [
  {
    key: "sensible",
    label: "Piel Sensible o Seca",
    desc: "Se enrojece o descama fácilmente con lociones con alcohol",
  },
  {
    key: "normal",
    label: "Piel Normal / Mixta",
    desc: "Equilibrada, busco cómoda absorción diaria sin residuos",
  },
  {
    key: "grasa",
    label: "Piel con Tendencia a Granos",
    desc: "Necesito una base en gel/crema ligera que no obstruya los poros",
  },
];

const RECOMMENDATIONS: Record<
  GoalKey,
  {
    headline: string;
    protocol: string;
    youMinoxTip: string;
    duration: string;
    links: { title: string; href: string; tag: string }[];
  }
> = {
  "barba-cero": {
    headline: "Protocolo de Activación Folicular para Barba Completa (5%)",
    protocol:
      "Aplica Minoxidil al 5% dos veces al día (mañana y noche) sobre el rostro limpio y seco. Combínalo con Biotina diaria (5,000–10,000 mcg) para acelerar la queratinización de los vellos vellosos a terminales.",
    youMinoxTip:
      "Al iniciar desde cero, la constancia durante los primeros 90 días es clave. Usar You Minox en Crema-Gel evita que abandonas el tratamiento por la descamación o ardor que provoca el alcohol del minoxidil líquido.",
    duration: "Primeros vellos visibles: 4 a 8 semanas • Barba consolidada: 4 a 6 meses",
    links: [
      {
        tag: "Guía Principal",
        title: "You Minox Opiniones: Guía Completa y Análisis Detallado",
        href: "/minoxidil/you-minox-opiniones-vale-la-pena-la-compra-guia-completa/",
      },
      {
        tag: "Paso a Paso",
        title: "¿Cómo Hacer Crecer y Poblar la Barba desde Cero?",
        href: "/estilo/como-hacer-poblar-la-barba/",
      },
      {
        tag: "Tiempos Reales",
        title: "Minoxidil para Barba: Resultados y Tiempo Estimado",
        href: "/minoxidil/minoxidil-para-barba-resultados-en-cuanto-tiempo-opiniones/",
      },
    ],
  },
  "huecos-barba": {
    headline: "Protocolo Focalizado para Rellenar Huecos + Dermaroller",
    protocol:
      "Aplica Minoxidil al 5% en Crema-Gel directamente en las mejillas y zonas despobladas. Incorpora un Dermaroller de 0.5 mm de titanio 1 a 2 veces por semana (esperando 24 h antes de aplicar minoxidil) para activar el colágeno y despertar folículos dormidos.",
    youMinoxTip:
      "La textura en crema-gel de You Minox te permite focalizar el producto exactamente sobre el parche o hueco de la mejilla sin que gotee hacia el cuello o los labios.",
    duration: "Relleno progresivo de parches: 6 a 12 semanas de uso continuo",
    links: [
      {
        tag: "Sinergia Efectiva",
        title: "Minoxidil y Dermaroller: Combinación Efectiva, Pros y Contras",
        href: "/minoxidil/minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras/",
      },
      {
        tag: "Aplicación en Crema",
        title: "Minoxidil en Crema: Cómo Aplicar Correctamente en la Barba",
        href: "/minoxidil/minoxidil-en-crema-como-aplicar-correctamente/",
      },
      {
        tag: "Alopecia en Barba",
        title: "Avances Científicos para Tratar la Alopecia y Huecos en la Barba",
        href: "/alopecia/avances-cientificos-para-tratar-la-alopecia-en-la-barba/",
      },
    ],
  },
  "caida-cabello": {
    headline: "Protocolo Regenerativo Capilar (Entradas, Coronilla y Densidad)",
    protocol:
      "Aplica Minoxidil al 5% en las entradas y zona superior del cuero cabelludo cada 12 horas. Si existe alopecia androgenética hereditaria, evalúa con tu dermatólogo la sinergia entre estimulación folicular (Minoxidil) y bloqueo de DHT (Finasteride) junto con Biotina.",
    youMinoxTip:
      "You Minox en Crema-Gel no engrasa el cabello ni deja residuos blancos en la raíz, permitiendo peinarte con normalidad antes de ir a trabajar.",
    duration: "Reducción de caída: mes 1–2 • Engrosamiento capilar: mes 3–6",
    links: [
      {
        tag: "Soluciones Clínicas",
        title: "¿La Alopecia en Hombres Tiene Cura Definitiva? Soluciones Efectivas",
        href: "/alopecia/la-alopecia-en-hombres-tiene-cura-definitiva/",
      },
      {
        tag: "Comparativa Dual",
        title: "Finasteride vs Minoxidil para Alopecia: ¿Cuál Elegir o Cómo Combinarlos?",
        href: "/finasteride/finasteride-vs-minoxidil-para-alopecia/",
      },
      {
        tag: "Prevención",
        title: "7 Errores Comunes al Tratar la Caída del Cabello y Cómo Evitarlos",
        href: "/alopecia/errores-comunes-al-tratar-la-caida-del-cabello/",
      },
    ],
  },
  irritacion: {
    headline: "Transición Inmediata a Minoxidil en Crema-Gel Libre de Resequedad",
    protocol:
      "La caspa blanca, el picor intenso y los brotes de granos suelen ser causados por el propilenglicol y el exceso de alcohol etílico de las lociones líquidas tradicionales. Suspende el vehículo alcohólico irritante y pasa a una formulación en crema-gel dermo-hidratante al 5%.",
    youMinoxTip:
      "You Minox (youminox.com) fue creado específicamente para resolver este problema: mantiene toda la potencia vasodilatadora del Minoxidil al 5% en una base suave que protege la barrera cutánea.",
    duration: "Alivio de la irritación y descamación: desde la primera semana de cambio",
    links: [
      {
        tag: "Comparativa Clave",
        title: "Comparativa de Resultados Reales: Minoxidil Kirkland vs You Minox",
        href: "/minoxidil/minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales/",
      },
      {
        tag: "Cuidado Cutáneo",
        title: "Cómo Aplicar Minoxidil para Evitar Irritación y Descamación",
        href: "/minoxidil/como-aplicar-minoxidil-para-evitar-irritacion/",
      },
      {
        tag: "Solución a Granos",
        title: "¿Por Qué el Minoxidil Me Saca Granos o Caspa en la Barba?",
        href: "/consejos/por-que-el-minoxidil-me-saca-granos/",
      },
    ],
  },
};

export default function BeardGrowthAdvisor() {
  const [selectedGoal, setSelectedGoal] = useState<GoalKey>("barba-cero");
  const [selectedSkin, setSelectedSkin] = useState<SkinKey>("sensible");

  const rec = RECOMMENDATIONS[selectedGoal];

  return (
    <div
      id="diagnosticador-barba"
      className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-dark">
            🧔 Herramienta Interactiva • Impulsada por You Minox
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            Diagnosticador Personalizado de Crecimiento de Barba y Cabello
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Selecciona tu objetivo actual y tu tipo de piel para obtener tu
            rutina recomendada y las guías exactas verificadas por{" "}
            <strong className="text-slate-900">You Minox</strong>.
          </p>
        </div>
        <a
          href={YOU_MINOX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-extrabold text-emerald-400 hover:bg-slate-800 transition self-start lg:self-center"
        >
          <span>Ver Productos en YouMinox.com</span>
          <span>↗</span>
        </a>
      </div>

      {/* Step 1: Select Goal */}
      <div className="mt-7">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
          Paso 1: ¿Cuál es tu objetivo principal hoy?
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((g) => {
            const active = selectedGoal === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setSelectedGoal(g.key)}
                className={`text-left rounded-2xl border p-4 transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-emerald-50/70 ring-2 ring-primary/30 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{g.icon}</span>
                  {active && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-white">
                      Activo
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {g.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {g.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Select Skin Type */}
      <div className="mt-6">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
          Paso 2: ¿Cómo describirías tu piel facial o cuero cabelludo?
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {SKIN_TYPES.map((st) => {
            const active = selectedSkin === st.key;
            return (
              <button
                key={st.key}
                type="button"
                onClick={() => setSelectedSkin(st.key)}
                className={`text-left rounded-xl border px-4 py-3 transition cursor-pointer ${
                  active
                    ? "border-primary bg-emerald-50/60 font-bold text-slate-900"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {st.label}
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full ${
                      active ? "bg-primary" : "bg-slate-200"
                    }`}
                  />
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Result Box */}
      <div className="mt-8 rounded-2xl bg-gradient-to-br from-slate-950 via-[#062c28] to-slate-900 p-6 sm:p-8 text-white">
        <div className="grid gap-8 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-extrabold text-slate-950">
                ✓ Diagnóstico Listo
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                ⏱️ {rec.duration}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {rec.headline}
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              {rec.protocol}
            </p>
            <div className="rounded-xl bg-white/10 border border-emerald-400/30 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 mb-1">
                💡 Por qué recomendamos You Minox (youminox.com) para tu{" "}
                {selectedSkin === "sensible"
                  ? "piel sensible"
                  : selectedSkin === "grasa"
                  ? "piel con tendencia a granos"
                  : "rutina diaria"}
                :
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {rec.youMinoxTip}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-300 mb-3">
              📚 Tus 3 Guías Recomendadas para Empezar Hoy:
            </p>
            <ul className="space-y-3">
              {rec.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group block rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-white/10 hover:border-emerald-400/50 p-3.5 transition"
                  >
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 block mb-0.5">
                      {l.tag}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between gap-2">
                      <span className="line-clamp-2">{l.title}</span>
                      <span className="text-emerald-400 shrink-0">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-full rounded-xl bg-emerald-400 hover:bg-emerald-300 py-3 text-center text-xs font-extrabold text-slate-950 transition shadow-md"
            >
              Adquirir You Minox en Crema-Gel (YouMinox.com) ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
