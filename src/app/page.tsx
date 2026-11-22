import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BeardGrowthAdvisor from "@/components/BeardGrowthAdvisor";
import YouMinoxSpotlight from "@/components/YouMinoxSpotlight";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import AmazonAffiliateBox from "@/components/AmazonAffiliateBox";
import ReadingProgress from "@/components/ReadingProgress";
import ClientEffects from "@/components/ClientEffects";
import SplitHeading from "@/components/SplitHeading";
import OpenChatButton from "@/components/OpenChatButton";
import Hero from "@/components/home/Hero";
import ScrollStory from "@/components/home/ScrollStory";
import FollicleScienceWave from "@/components/home/FollicleScienceWave";
import BeardOrbit, { type OrbitItem } from "@/components/home/BeardOrbit";
import ClinicalCounters, { type CounterItem } from "@/components/home/ClinicalCounters";
import DayNightSlider from "@/components/home/DayNightSlider";
import MomentsCarousel, { type Moment } from "@/components/home/MomentsCarousel";
import TreatmentPlanBlock, { type TreatmentOption } from "@/components/home/TreatmentPlanBlock";
import { getContextualAmazonProducts } from "@/lib/amazon";
import {
  getAllPosts,
  getYouMinoxFeaturedPosts,
  getBeardAndCareGuides,
  getAlopeciaAndBiotinaGuides,
  getTopSeoPosts,
  getPostsByCategory,
  getAllCategories,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  YOU_MINOX_URL,
} from "@/lib/data";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} — Minoxidil 5% para Barba y Cabello, You Minox Crema-Gel, Biotina y Alopecia`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const CLAIMS = [
  "You Minox 5% Crema-Gel 60 g",
  "Notificación Sanitaria DIGEMID",
  "0% Propilenglicol Irritante",
  "Cero Caspa de Barba",
  "Oxothiazolidinecarboxylate",
  "Absorción Rápida en 3 Minutos",
  "Dermaroller Titanio 0.5 mm",
  "Biotina 10,000 mcg & Zinc",
];

const CLAIMS_2 = [
  "1,161 Guías de Minoxidil",
  "440 Guías de Alopecia",
  "318 Guías de Biotina",
  "245 Guías de Estilos de Barba",
  "227 Guías de Cuidado Facial",
  "72 Guías de Finasteride & DHT",
  "+600K Comunidad You Minox",
  "Asesor Folicular IA 24/7",
];

const CATEGORY_ICONS: Record<string, string> = {
  minoxidil: "💧",
  alopecia: "💇‍♂️",
  biotina: "💊",
  estilo: "🧔",
  consejos: "🛡️",
  finasteride: "🧬",
};

const HOME_FAQS = [
  {
    q: "¿Por qué You Minox en Crema-Gel es mejor para la barba que el Minoxidil líquido tradicional?",
    a: "El minoxidil líquido tradicional contiene altos niveles de alcohol etílico y propilenglicol que resecan la piel del rostro, causando descamación blanca ('caspa de barba'), enrojecimiento, picazón y brotes de granos en más del 45% de los usuarios. You Minox (youminox.com) formuló el Minoxidil al 5% con Oxothiazolidinecarboxylate en una base de crema-gel dermo-hidratante de 60 g con Registro Sanitario DIGEMID que estimula los folículos con la misma potencia clínica, se absorbe en 3 minutos y no gotea ni reseca.",
  },
  {
    q: "¿En cuánto tiempo se ven resultados reales usando Minoxidil al 5% en la barba?",
    a: "Durante las primeras 4 a 8 semanas comienzan a aparecer los primeros vellos finos (vellos vellosos) en las mejillas y zonas despobladas. Entre el mes 3 y el mes 4 el vello gana grosor, queratina y pigmentación oscura, y para consolidar una barba terminal densa y permanente se recomienda un ciclo constante de 6 a 12 meses.",
  },
  {
    q: "¿Cómo funciona el Asesor Clínico y Folicular IA de MásBarba.net?",
    a: "Haz clic en el botón flotante 'Asesor IA Barba' en cualquier momento y pregúntale cómo cerrar huecos en las mejillas, cómo combinar You Minox con Dermaroller de 0.5 mm, cuánta Biotina tomar al día, cómo tratar las entradas o qué productos de cuidado elegir. Te responderá al instante y te guiará a las guías clínicas exactas de nuestra enciclopedia.",
  },
  {
    q: "¿Puedo combinar Minoxidil You Minox con Biotina y Dermaroller de 0.5 mm?",
    a: "Sí, es la tríada más efectiva para el crecimiento de la barba y regeneración capilar. El Minoxidil al 5% cada 12 horas aumenta la vasodilatación y nutrientes hacia el bulbo; el Dermaroller de titanio de 0.5 mm (1 a 2 veces por semana, esperando 24 horas antes del siguiente Minoxidil) activa el colágeno y la enzima SULT1A1; y la Biotina (5,000 a 10,000 mcg diarios) aporta la vitamina B7 esencial para sintetizar queratina fuerte.",
  },
  {
    q: "¿Cuánto tiempo debo esperar para lavarme la cara, dormir o ir a la barbería tras aplicar Minoxidil?",
    a: "Debes esperar al menos 4 horas antes de lavarte la cara, ducharte o sudar intensamente para garantizar más del 75% de absorción transfolicular. Para dormir, aplícalo 45 a 60 minutos antes de acostarte. Si acudes a la barbería para un perfilado con toalla caliente y navaja, espera de 4 a 6 horas antes de tu siguiente aplicación.",
  },
  {
    q: "¿Quién creó MásBarba.net y qué relación tiene con You Minox?",
    a: "MásBarba.net es el portal educativo oficial creado por Charlie Lingán (charlielingan.com) y el equipo de You Minox (youminox.com), la marca líder de Minoxidil al 5% en crema-gel en el Perú con más de 600,000 seguidores en TikTok e Instagram. Nuestro objetivo es brindar 2,463 guías verificadas basadas en evidencia dermatológica y experiencia real.",
  },
];

export default function HomePage() {
  const allPosts = getAllPosts();
  const youMinoxGuides = getYouMinoxFeaturedPosts(6);
  const beardGuides = getBeardAndCareGuides(6);
  const alopeciaGuides = getAlopeciaAndBiotinaGuides(6);
  const topSeoPosts = getTopSeoPosts(9);
  const categories = getAllCategories();
  const homeAmazon = getContextualAmazonProducts(
    "home-masbarba",
    "minoxidil",
    "Mejores Productos para Crecimiento de Barba, Dermaroller 0.5mm y Biotina"
  );

  // Balanced set of posts across all 6 categories for the interactive explorer
  const explorerPosts = [
    ...youMinoxGuides,
    ...beardGuides,
    ...alopeciaGuides,
    ...topSeoPosts,
    ...getPostsByCategory("minoxidil").slice(0, 12),
    ...getPostsByCategory("alopecia").slice(0, 12),
    ...getPostsByCategory("biotina").slice(0, 10),
    ...getPostsByCategory("finasteride").slice(0, 8),
    ...getPostsByCategory("estilo").slice(0, 8),
    ...getPostsByCategory("consejos").slice(0, 8),
  ].filter(
    (post, index, self) => self.findIndex((p) => p.id === post.id) === index
  );

  const orbit: OrbitItem[] = [
    {
      k: "you-minox-crema",
      name: "You Minox 5% Crema-Gel",
      img: "/images/Como-hacer-poblar-la-barba.jpg",
      role: "1,161 guías · Fórmula #1 en el Perú con DIGEMID",
      d: "Tubo de 60 g con Minoxidil al 5% y Oxothiazolidinecarboxylate en vehículo dermo-hidratante sin propilenglicol. Se absorbe en 3 minutos, no escurre y elimina la caspa de barba.",
      href: "/minoxidil/you-minox-opiniones-vale-la-pena-la-compra-guia-completa/",
    },
    {
      k: "dermaroller-titanio",
      name: "Dermaroller 0.5 mm",
      img: "/images/Como-aplicar-minoxidil-para-evitar-irritacion.jpg",
      role: "Microneedling de titanio · Multiplicador 3x",
      d: "Las 540 microagujas de 0.5 mm inducen colágeno y activan la enzima sulfotransferasa (SULT1A1) en mejillas con huecos y entradas rebeldes. Se usa 1–2 veces por semana.",
      href: "/minoxidil/minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras/",
    },
    {
      k: "alopecia-capilar",
      name: "Alopecia y Entradas",
      img: "/images/La-alopecia-en-hombres-tiene-cura-definitiva.jpg",
      role: "440 guías · Escala Norwood, Coronilla y Areata",
      d: "Protocolos clínicos para detener la miniaturización folicular en entradas y coronilla, diferenciar el efluvio telógeno de la alopecia androgenética y recuperar densidad.",
      href: "/alopecia/",
    },
    {
      k: "biotina-vitaminas",
      name: "Biotina 10,000 mcg",
      img: "/images/Cuanta-biotina-tomar-segun-expertos.jpg",
      role: "318 guías · Síntesis de Queratina y Zinc",
      d: "La Vitamina B7 (Biotina) combinada con Zinc, Colágeno y Vitamina D3 fortalece la estructura interna del nuevo vello velloso para que madure más rápido a barba terminal.",
      href: "/biotina/",
    },
    {
      k: "finasteride-dht",
      name: "Finasteride y DHT",
      img: "/images/Finasteride-vs-minoxidil-para-alopecia.jpg",
      role: "72 guías · Control Hormonal 5-Alfa-Reductasa",
      d: "Mientras el Minoxidil estimula el flujo sanguíneo, el Finasteride frena la hormona DHT en el cuero cabelludo. Descubre cuándo combinarlos y por qué actúan distinto en la barba.",
      href: "/finasteride/",
    },
    {
      k: "estilos-visagismo",
      name: "Visagismo y Estilos",
      img: "/images/Como-lograr-una-barba-perfecta.jpg",
      role: "245 guías · Diseño según tu Tipo de Rostro",
      d: "Barba cuadrada, candado italiano, degradado fade o barba espartana: cómo elegir las líneas de pómulo y cuello que estilizan tu mandíbula según la geometría de tu rostro.",
      href: "/estilo/",
    },
    {
      k: "cuidado-skincare",
      name: "Skincare & Cero Caspa",
      img: "/images/Por-que-el-minoxidil-me-saca-granos.jpg",
      role: "227 guías · Hidratación, Ceramidas y Aceites",
      d: "Cómo evitar granos, foliculitis y descamación durante el tratamiento: limpieza tibia, hidratantes con ceramidas no comedogénicas, cepillo de cerdas de jabalí y aceite de romero.",
      href: "/consejos/",
    },
    {
      k: "barberias-peru",
      name: "Perfilado en Barbería",
      img: "/images/barberias/barber-01.jpg",
      role: "Alianza Oficial con GuíaDeBarberías.com",
      d: "Cuándo realizar tu primer perfilado a navaja y tijera sin arrancar los vellos vellosos en transición, y cuáles son las mejores barberías verificadas en Lima y todo el Perú.",
      href: "/estilo/como-perfilar-barba-en-barberia-durante-tratamiento-minoxidil/",
    },
  ];

  const counters: CounterItem[] = [
    {
      v: allPosts.length,
      dec: 0,
      u: "guías",
      l: "Enciclopedia Total",
      pct: 100,
      note: "Artículos clínicos, comparativas y guías geolocalizadas",
    },
    {
      v: 1161,
      dec: 0,
      u: "guías",
      l: "Minoxidil & You Minox",
      pct: 96,
      note: "Protocolos al 5%, crema-gel vs. líquido y dermaroller",
    },
    {
      v: 440,
      dec: 0,
      u: "guías",
      l: "Alopecia y Cabello",
      pct: 88,
      note: "Entradas, coronilla, alopecia areata y regeneración",
    },
    {
      v: 318,
      dec: 0,
      u: "guías",
      l: "Biotina y Vitaminas",
      pct: 85,
      note: "Dosis en mcg, alimentos, zinc y síntesis de queratina",
    },
    {
      v: 472,
      dec: 0,
      u: "guías",
      l: "Estilo y Cuidado Diario",
      pct: 90,
      note: "245 de visagismo/barbería + 227 de skincare masculino",
    },
    {
      v: 600,
      dec: 0,
      u: "mil+",
      l: "Comunidad You Minox",
      pct: 98,
      note: "Seguidores y casos reales en TikTok e Instagram",
    },
  ];

  const moments: Moment[] = [
    {
      img: "/images/Como-hacer-poblar-la-barba.jpg",
      t: "Cerrar Huecos en Mejillas",
      d: "El protocolo exacto con You Minox 5% Crema-Gel y Dermaroller 0.5 mm para unir el bigote con el candado y poblar zonas rebeldes.",
      href: "/minoxidil/como-hacer-poblar-la-barba/",
      alt: "Cómo poblar la barba y cerrar huecos en las mejillas",
      tag: "Barba desde Cero",
    },
    {
      img: "/images/Por-que-el-minoxidil-me-saca-granos.jpg",
      t: "Adiós a la Caspa y Granos",
      d: "Por qué el propilenglicol del minoxidil líquido descama tu rostro y cómo cambiar a Crema-Gel repara tu barrera cutánea.",
      href: "/consejos/por-que-el-minoxidil-me-saca-granos/",
      alt: "Cómo evitar granos y caspa en la barba al usar minoxidil",
      tag: "Cero Irritación",
    },
    {
      img: "/images/Como-aplicar-minoxidil-para-evitar-irritacion.jpg",
      t: "Sinergia con Dermaroller",
      d: "Longitudes de aguja (0.5 mm vs 1.0 mm), cada cuántos días pasarlo y por qué esperar 24 horas antes del siguiente Minoxidil.",
      href: "/minoxidil/minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras/",
      alt: "Combinación de Minoxidil al 5% y Dermaroller de titanio",
      tag: "Microneedling 3x",
    },
    {
      img: "/images/La-alopecia-en-hombres-tiene-cura-definitiva.jpg",
      t: "Recuperar Entradas y Coronilla",
      d: "Cómo detener el avance de la escala Norwood combinando vasodilatación folicular, champú de Ketoconazol 1% y bloqueadores de DHT.",
      href: "/alopecia/la-alopecia-en-hombres-tiene-cura-definitiva/",
      alt: "Tratamiento clínico para entradas y alopecia masculina",
      tag: "Regeneración Capilar",
    },
    {
      img: "/images/Cuanta-biotina-tomar-segun-expertos.jpg",
      t: "Dosis Exacta de Biotina",
      d: "¿5,000 mcg o 10,000 mcg al día? Cómo tomar la Vitamina B7 junto a Zinc para acelerar el engrosamiento del vello facial.",
      href: "/biotina/cuanta-biotina-tomar-segun-expertos/",
      alt: "Guía de suplementación con Biotina para barba y cabello",
      tag: "Nutrición B7",
    },
    {
      img: "/images/barberias/barber-03.jpg",
      t: "Tu Primer Perfilado en Barbería",
      d: "En qué mes acudir al barbero, qué pedir para no perder densidad y cuánto esperar tras la toalla caliente y navaja.",
      href: "/estilo/como-perfilar-barba-en-barberia-durante-tratamiento-minoxidil/",
      alt: "Perfilado profesional de barba en barbería durante tratamiento",
      tag: "Visagismo",
    },
    {
      img: "/images/Finasteride-vs-minoxidil-para-alopecia.jpg",
      t: "Minoxidil vs. Finasteride",
      d: "Diferencias clínicas entre un vasodilatador de canales de potasio y un inhibidor de DHT: cuándo usar uno o ambos.",
      href: "/finasteride/finasteride-vs-minoxidil-para-alopecia/",
      alt: "Comparativa entre Finasteride y Minoxidil para alopecia",
      tag: "Comparativa Clínica",
    },
  ];

  const treatmentOptions: TreatmentOption[] = [
    {
      key: "despertar",
      label: "Fase 1: Despertar (3 Meses)",
      tier: "Ideal para activar folículos desde cero · Meses 1 a 3",
      durationMonths: 3,
      tubesNeeded: 2,
      formulaType: "You Minox 5% Crema-Gel (60 g) cada 12 horas",
      img: "/images/Como-hacer-poblar-la-barba.jpg",
      alt: "Primeros 3 meses de crecimiento de barba con You Minox",
      desc: "Durante los primeros 90 días la vasodilatación constante despierta los bulbos dormidos en mejillas y entradas. Verás brotar los primeros vellos vellosos finos entre la semana 4 y la 8 sin sufrir descamación blanca.",
      components: "2 tubos You Minox 5% Crema-Gel 60 g + Limpieza facial tibia + Cepillo de cerdas de jabalí.",
      href: "/minoxidil/minoxidil-para-barba-resultados-en-cuanto-tiempo-opiniones/",
    },
    {
      key: "consolidacion",
      label: "Fase 2: Huecos y Densidad (6 Meses)",
      tier: "El ciclo más elegido para cerrar parches · Meses 1 a 6",
      durationMonths: 6,
      tubesNeeded: 4,
      formulaType: "You Minox 5% Crema-Gel + Dermaroller 0.5 mm + Biotina",
      img: "/images/Como-aplicar-minoxidil-para-evitar-irritacion.jpg",
      alt: "Ciclo de 6 meses con You Minox, Dermaroller y Biotina",
      desc: "A los 6 meses el vello velloso sintetiza queratina gruesa, se oscurece y conecta las zonas difíciles entre el bigote, los pómulos y el mentón. Incluye microneedling semanal de 0.5 mm para triplicar la respuesta enzimática.",
      components: "4 tubos You Minox 5% Crema-Gel + Dermaroller Titanio 0.5 mm + Biotina 10,000 mcg & Zinc.",
      href: "/minoxidil/minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras/",
    },
    {
      key: "terminal",
      label: "Fase 3: Barba Terminal (12 Meses)",
      tier: "Consolidación definitiva y permanente · Ciclo Completo",
      durationMonths: 12,
      tubesNeeded: 8,
      formulaType: "Protocolo Completo de Maduración Folicular + Retiro Gradual",
      img: "/images/Como-lograr-una-barba-perfecta.jpg",
      alt: "Barba terminal densa y permanente tras 12 meses",
      desc: "Para quienes buscan una barba cerrada tipo leñador o recuperación capilar sostenida en entradas y coronilla. Al cumplir el año, el folículo terminal ya posee irrigación propia y los resultados se mantienen de por vida.",
      components: "You Minox 5% Crema-Gel + Derma Stamp Ajustable + Biotina 10,000 mcg + Recortadora de Precisión.",
      href: "/minoxidil/you-minox-opiniones-vale-la-pena-la-compra-guia-completa/",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <ReadingProgress />
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* 1–2. Hero 3D con Partículas, Buscador Instantáneo y Escenario Tilt */}
        <Hero totalPosts={allPosts.length} totalCategories={categories.length} />

        {/* 3. Doble Cinta Marquee de Fórmula Dermo-Folicular y Categorías */}
        <div className="relative border-b border-[var(--line)] bg-white py-5">
          <div className="marquee">
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track font-display text-lg font-bold text-[#0f172a]/85"
                aria-hidden={k === 1}
              >
                {CLAIMS.map((t) => (
                  <span key={t} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-gradient-to-br from-[#34d399] to-[#059669]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="marquee reverse mt-3" aria-hidden>
            {[0, 1].map((k) => (
              <div
                key={k}
                className="marquee-track text-sm font-semibold uppercase tracking-[0.14em] text-[#047857]/80"
              >
                {CLAIMS_2.map((t) => (
                  <span key={t} className="flex items-center gap-3 whitespace-nowrap">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 4. ¿Qué es MásBarba.net & You Minox? + Mosaico Spotlight */}
        <section id="que-es" className="wrap py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Rigor clínico y experiencia real
              </span>
              <SplitHeading
                text="Crecimiento de barba y salud capilar,"
                accent={{
                  text: "sin humo ni caspa facial",
                  className: "text-[#059669]",
                }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                <strong className="text-[#0f172a]">MásBarba.net</strong> es la enciclopedia oficial
                en español impulsada por{" "}
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#059669] underline"
                >
                  You Minox (youminox.com)
                </a>{" "}
                y su fundador{" "}
                <a
                  href="https://charlielingan.com/es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0f172a] underline"
                >
                  Charlie Lingán
                </a>
                . Reunimos{" "}
                <strong className="text-[#0f172a]">
                  {allPosts.length.toLocaleString("es-PE")} guías clínicas, comparativas y
                  protocolos
                </strong>{" "}
                para que puebles tu barba, cierres huecos en las mejillas y frenes la caída capilar
                cuidando tu piel.
              </p>
              <div
                className="mt-6 rounded-2xl border border-emerald-300/70 bg-emerald-50/80 p-5"
                data-reveal
              >
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-900">
                  🧔 Por qué miles de hombres prefieren nuestro protocolo
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.95rem] text-[#0f172a]">
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-emerald-700">•</span>
                    <strong>You Minox 5% en Crema-Gel (60 g):</strong> con Oxothiazolidinecarboxylate
                    y Notificación Sanitaria DIGEMID, libre del propilenglicol que causa caspa y ardor.
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-emerald-700">•</span>
                    <strong>Sinergia 360°:</strong> protocolos paso a paso para combinar Minoxidil con
                    Dermaroller 0.5 mm, Biotina 10,000 mcg, Finasteride y champú con Ketoconazol.
                  </li>
                  <li className="relative pl-4">
                    <span className="absolute left-0 top-0 font-bold text-emerald-700">•</span>
                    <strong>Asesor IA en Tiempo Real:</strong> entrenado con las 2,463 guías del
                    portal para resolver tus dudas clínicas y recomendarte los productos exactos.
                  </li>
                </ul>
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link href="/minoxidil/" className="btn btn-ghost" data-magnetic>
                  Explorar 1,161 Guías de Minoxidil
                </Link>
                <Link href="/alopecia/" className="btn btn-ghost" data-magnetic>
                  Ver 440 Guías de Alopecia
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="relative col-span-2 aspect-[16/8] overflow-hidden rounded-3xl shadow-[0_30px_60px_-35px_rgba(4,47,46,0.65)]"
                data-reveal
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/Como-lograr-una-barba-perfecta.jpg"
                  alt="Diseño de barba densa y tratamiento folicular con You Minox"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#047857]">
                  You Minox 5% Crema-Gel · Notificación Sanitaria DIGEMID
                </span>
              </div>
              {[
                [
                  "💧",
                  "Crema-Gel vs. Líquido",
                  "Por qué la base dermo-hidratante de 60 g evita la descamación blanca y los granos.",
                ],
                [
                  "⚡",
                  "Microneedling 0.5 mm",
                  "Cómo activar la enzima SULT1A1 y el colágeno en mejillas y entradas rebeldes.",
                ],
                [
                  "💊",
                  "Biotina, Zinc & DHT",
                  "Nutrición interna de queratina y bloqueadores de 5-alfa-reductasa para el cabello.",
                ],
                [
                  "💈",
                  "Visagismo y Barberías",
                  "Estilos según tu rostro y directorio conectado con las mejores barberías del Perú.",
                ],
              ].map(([e, t, d], i) => (
                <div
                  key={t}
                  className="card spot p-5"
                  data-reveal
                  data-reveal-delay={String(i)}
                >
                  <p className="text-2xl" aria-hidden>
                    {e}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight text-[#0f172a]">
                    {t}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Historia fijada GSAP: del folículo dormido a la barba terminal */}
        <ScrollStory />

        {/* 6. La ciencia dermo-folicular de la Crema-Gel (SVG animado) */}
        <section className="relative isolate overflow-hidden bg-[#021a19] py-24 text-white">
          <div className="pointer-events-none absolute -left-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[#10b981]/25 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[30rem] w-[30rem] rounded-full bg-[#0f766e]/40 blur-3xl" />
          <div className="hero-grid opacity-50" />
          <div className="wrap relative grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow !text-[#fde047]" data-reveal>
                Ingeniería cosmético-farmacéutica
              </span>
              <SplitHeading
                text="Por qué el vehículo en Crema-Gel"
                accent={{ text: "supera al gotero líquido", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-white/80" data-reveal>
                En cualquier tratamiento folicular de 6 a 12 meses,{" "}
                <strong className="text-white">
                  la constancia depende de cómo responde tu piel
                </strong>
                . Las lociones líquidas genéricas usan hasta un 50% de propilenglicol y alcohol que
                cristalizan sobre el rostro dejando residuos blancos.{" "}
                <strong className="text-emerald-300">You Minox 5% en Crema-Gel</strong> encapsula el
                Minoxidil junto a <strong className="text-white">Oxothiazolidinecarboxylate</strong>{" "}
                para lograr absorción limpia en 3 minutos sin irritar la epidermis.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3" data-reveal>
                {[
                  ["🛡️", "0% Caspa Facial"],
                  ["⏱️", "Seca en 3 Min"],
                  ["🇵🇪", "Registro DIGEMID"],
                ].map(([e, t]) => (
                  <div key={t} className="glass p-4 text-center">
                    <p className="text-2xl" aria-hidden>
                      {e}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{t}</p>
                  </div>
                ))}
              </div>
              <div className="glass mt-6 p-5 text-sm text-white/80" data-reveal>
                <strong className="text-[#fde047]">Tip clínico clave:</strong> aplica siempre tu
                dosis sobre el rostro o cuero cabelludo 100% seco tras la ducha. Aplicar Minoxidil
                sobre piel mojada diluye el vehículo y aumenta la irritación.
              </div>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <Link
                  href="/minoxidil/minoxidil-en-crema-como-aplicar-correctamente/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Cómo aplicar Minoxidil en Crema-Gel
                </Link>
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lime shine"
                  data-magnetic
                >
                  Pedir You Minox Oficial →
                </a>
              </div>
            </div>
            <div data-reveal>
              <FollicleScienceWave />
            </div>
          </div>
        </section>

        {/* 7. Órbita interactiva de los 8 pilares de MásBarba.net */}
        <section className="wrap py-24">
          <BeardOrbit
            items={orbit}
            center="/images/Como-hacer-poblar-la-barba.jpg"
          />
        </section>

        {/* 8. Contadores animados y Ficha Técnica Oficial de You Minox 5% */}
        <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#021a19] via-[#042f2e] to-[#064e3b] py-24 text-white">
          <div className="hero-aurora opacity-40" />
          <div className="wrap relative grid items-start gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="eyebrow !text-[#fde047]" data-reveal>
                La enciclopedia folicular en números reales
              </span>
              <SplitHeading
                text="Nuestro archivo clínico y comunidad,"
                accent={{ text: "cifra por cifra", className: "text-gradient" }}
                className="section-title mt-3"
              />
              <p className="mt-4 max-w-xl text-white/75" data-reveal>
                Desde protocolos dermatológicos por tipo de piel, edad y clima en cada distrito del
                Perú y ciudades de EE. UU., Latinoamérica y España hasta comparativas 1 a 1 de
                marcas y herramientas.
              </p>
              <div className="mt-8">
                <ClinicalCounters data={counters} />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/minoxidil/ranking-marcas-minoxidil-peru-vs-estados-unidos-cual-elegir/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Ranking de Marcas: Perú vs. EE. UU.
                </Link>
                <Link
                  href="/minoxidil/por-que-el-minoxidil-liquido-da-caspa-en-la-barba-y-como-evitarlo/"
                  className="btn btn-glass"
                  data-magnetic
                >
                  Cómo eliminar la caspa de barba
                </Link>
              </div>
            </div>

            {/* Ficha Técnica estilo Etiqueta Farmacéutica Oficial */}
            <div
              className="mx-auto w-full max-w-[430px] rounded-3xl bg-white p-6 text-[#0f172a] shadow-2xl"
              data-reveal
            >
              <div className="border-b-4 border-[#0f172a] pb-3">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[#059669]">
                  FICHA DERMO-FOLICULAR OFICIAL · DIGEMID PERÚ
                </p>
                <h3 className="mt-1 font-display text-2xl font-extrabold text-[#0f172a]">
                  You Minox 5% Crema-Gel
                </h3>
                <p className="text-xs text-slate-500">
                  MINOXIDIL PERU S.A.C. · Tubo Dermo-Hidratante de 60 g
                </p>
              </div>

              <dl className="mt-4 divide-y divide-slate-200 text-sm">
                {[
                  ["Principio Activo", "Minoxidil 5.0%", "Grado farmacéutico USP"],
                  [
                    "Co-Activo Energizante",
                    "Oxothiazolidinecarboxylate",
                    "Protección antioxidante del bulbo",
                  ],
                  ["Vehículo Cosmético", "Crema-Gel Emoliente", "0% propilenglicol irritante"],
                  ["Tiempo de Absorción", "3 Minutos", "Acabado mate sin goteo facial"],
                  ["Frecuencia Clínica", "Cada 12 Horas", "Mañana y noche (piel 100% seca)"],
                  ["Zonas de Aplicación", "Barba, Cabello y Cejas", "Mejillas, entradas y coronilla"],
                ].map(([k, val, sub]) => (
                  <div key={k} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <dt className="font-extrabold text-[#0f172a]">{k}</dt>
                      <dd className="text-xs text-slate-500">{sub}</dd>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-extrabold text-xs text-[#047857]">
                      {val}
                    </span>
                  </div>
                ))}
              </dl>

              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-950">
                <strong>✓ Disponible con envío rápido en Perú:</strong> Adquiérelo 100% original en{" "}
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold underline"
                >
                  youminox.com
                </a>{" "}
                y en Saga Falabella.
              </div>
            </div>
          </div>
        </section>

        {/* 9. Escena Interactiva Día ↔ Noche: Rutina Cada 12 Horas */}
        <section className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                El secreto está en el ciclo de 12 horas
              </span>
              <SplitHeading
                text="De la dosis de la mañana"
                accent={{
                  text: "a la regeneración nocturna",
                  className: "text-[#059669]",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-base sm:text-lg text-[var(--muted)]" data-reveal>
              Arrastra el control horario de la escena. Descubre cómo organizar tus dos
              aplicaciones diarias de You Minox, tu suplementación con Biotina y tus tiempos de
              espera antes de dormir.
            </p>
          </div>

          <div data-reveal>
            <DayNightSlider />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              [
                "08:00 AM · Aplicación Matutina",
                "Rostro limpio, Crema-Gel en 3 minutos y listo para salir sin brillo ni goteo",
                "/images/Como-hacer-poblar-la-barba.jpg",
                "/minoxidil/minoxidil-en-crema-como-aplicar-correctamente/",
              ],
              [
                "02:00 PM · Nutrición & Barbería",
                "Toma tu Biotina 10,000 mcg en el almuerzo; pasadas 4 h ya puedes entrenar o perfilar",
                "/images/Cuanta-biotina-tomar-segun-expertos.jpg",
                "/biotina/cuanta-biotina-tomar-segun-expertos/",
              ],
              [
                "09:30 PM · Dosis Nocturna",
                "Segunda aplicación 60 minutos antes de acostarte para nutrir el bulbo toda la noche",
                "/images/Como-aplicar-minoxidil-para-evitar-irritacion.jpg",
                "/minoxidil/como-aplicar-minoxidil-para-evitar-irritacion/",
              ],
            ].map(([t, d, src, href], i) => (
              <Link
                key={t}
                href={href}
                className="card spot overflow-hidden group"
                data-reveal
                data-reveal-delay={String(i)}
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={t}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-4 p-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] font-extrabold text-white">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="text-lg font-extrabold leading-tight text-[#0f172a] group-hover:text-[#059669] transition-colors">
                      {t}
                    </p>
                    <p className="text-sm text-[var(--muted)]">{d}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 10. Carrusel Horizontal 4:5 de Situaciones y Casos Reales */}
        <section className="overflow-hidden bg-[#f4fbf8] py-24">
          <div className="wrap">
            <div className="mb-10 max-w-2xl">
              <span className="eyebrow" data-reveal>
                Soluciones para cada etapa
              </span>
              <SplitHeading
                text="Situaciones reales y"
                accent={{
                  text: "protocolos paso a paso",
                  className: "text-[#047857]",
                }}
                className="section-title mt-3"
              />
            </div>
            <MomentsCarousel items={moments} />
          </div>
        </section>

        {/* 11. Planificador Interactivo de Ciclo Folicular (3, 6 y 12 Meses) */}
        <section id="planificador" className="wrap py-24">
          <div className="mb-10 grid items-end gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Tu hoja de ruta mes a mes
              </span>
              <SplitHeading
                text="Constancia cada 12 horas."
                accent={{
                  text: "Resultados que se quedan.",
                  className: "text-[#059669]",
                }}
                className="section-title mt-3"
              />
            </div>
            <p className="text-base sm:text-lg text-[var(--muted)]" data-reveal>
              Elige tu meta actual (despertar folículos desde cero, cerrar huecos a los 6 meses o
              consolidar una barba terminal en 12 meses) y calcula tu ciclo completo.
            </p>
          </div>
          <TreatmentPlanBlock options={treatmentOptions} />
        </section>

        {/* Test Interactivo de Diagnóstico de Barba + Spotlight You Minox */}
        <section className="bg-slate-50 py-20 border-y border-slate-200/80">
          <div className="wrap space-y-12">
            <BeardGrowthAdvisor />
            <YouMinoxSpotlight />
          </div>
        </section>

        {/* 12. Bento Grid de las 6 Categorías + Guías Destacadas + Explorador + Afiliados Amazon */}
        <section className="bg-white py-24">
          <div className="wrap">
            <div className="max-w-3xl mb-12">
              <span className="eyebrow" data-reveal>
                Arquitectura de las {allPosts.length.toLocaleString("es-PE")} Guías
              </span>
              <SplitHeading
                text="Explora nuestros 6 pilares"
                accent={{ text: "de barba y regeneración capilar", className: "text-[#059669]" }}
                className="section-title mt-3"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((c, idx) => {
                const big = idx === 0 || idx === 1;
                const sampleArticles = getPostsByCategory(c.slug).slice(0, 3);
                return (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}/`}
                    className={`card spot flex flex-col justify-between p-7 transition ${
                      big
                        ? "bg-gradient-to-br from-[#021a19] via-[#042f2e] to-[#064e3b] text-white border-emerald-500/40"
                        : ""
                    }`}
                    data-reveal
                    data-reveal-delay={String(idx % 3)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-3xl">{CATEGORY_ICONS[c.slug] || "🧔"}</span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                          big
                            ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                            : "bg-emerald-50 text-[#047857] border border-emerald-200"
                        }`}
                      >
                        {c.count.toLocaleString("es-PE")} guías
                      </span>
                    </div>
                    <h3
                      className={`mt-5 font-display font-extrabold ${
                        big ? "text-2xl sm:text-3xl text-white" : "text-2xl text-[#0f172a]"
                      }`}
                    >
                      {c.name}
                    </h3>
                    <p
                      className={`mt-2 text-sm ${
                        big ? "text-white/80" : "text-[var(--muted)]"
                      }`}
                    >
                      {c.description}
                    </p>
                    <ul
                      className={`mt-5 space-y-1.5 text-xs ${
                        big ? "text-emerald-200/90" : "text-slate-600"
                      }`}
                    >
                      {sampleArticles.map((a) => (
                        <li key={a.id} className="truncate">
                          → {a.title}
                        </li>
                      ))}
                    </ul>
                    <span
                      className={`mt-6 inline-block font-bold text-sm ${
                        big ? "text-[#fde047]" : "text-[#059669]"
                      }`}
                    >
                      Explorar categoría →
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Vitrina Oficial de Productos Recomendados en Amazon (masbarba-20 / masbarba-21) */}
            <div className="mt-16">
              <AmazonAffiliateBox
                variant="showcase"
                sectionTitle={homeAmazon.sectionTitle}
                sectionSubtitle={homeAmazon.sectionSubtitle}
                products={homeAmazon.products}
              />
            </div>

            {/* Guías Oficiales de You Minox en Crema-Gel */}
            <div className="mt-20">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="eyebrow" data-reveal>
                    ⭐ Especial You Minox (youminox.com)
                  </span>
                  <h3
                    className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a]"
                    data-reveal
                  >
                    Guías Destacadas de Minoxidil al 5% en Crema-Gel
                  </h3>
                </div>
                <Link
                  href="/minoxidil/"
                  className="text-sm font-bold text-[#059669] hover:underline"
                >
                  Ver las 1,161 guías de Minoxidil →
                </Link>
              </div>

              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {youMinoxGuides.map((post, idx) => (
                  <Link
                    key={post.id}
                    href={getPostUrl(post)}
                    className="card spot group flex flex-col overflow-hidden"
                    data-reveal
                    data-reveal-delay={String(idx % 3)}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImageUrl(post.featuredImageUrl)}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-[#021a19]/90 px-3 py-1 text-[11px] font-bold text-emerald-300">
                        ⭐ Guía Oficial You Minox
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                        <span>⏱️ {post.readTime} de lectura</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">
                          ✓ Verificado Clínicamente
                        </span>
                      </div>
                      <h4 className="font-display text-lg font-bold text-[#0f172a] group-hover:text-[#059669] transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3 flex-1">
                        {post.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#059669]">
                        Leer guía completa →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* AdSense Banner */}
            <div className="mx-auto max-w-5xl py-12">
              <AdBanner />
            </div>

            {/* Explorador Interactivo de Guías por Categoría */}
            <div className="mt-6">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="eyebrow" data-reveal>
                  Catálogo Interactivo ({allPosts.length.toLocaleString("es-PE")} Guías)
                </span>
                <h3
                  className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a]"
                  data-reveal
                >
                  Explora Nuestras Guías por Categoría
                </h3>
              </div>
              <BlogExplorerClient
                initialPosts={explorerPosts}
                categories={categories}
              />
            </div>
          </div>
        </section>

        {/* 13. Criterio Editorial + Autor E-E-A-T (Charlie Lingán) + Acordeón FAQ */}
        <section className="wrap py-24 border-t border-slate-200/80">
          <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="eyebrow" data-reveal>
                Transparencia dermo-folicular
              </span>
              <SplitHeading
                text="Protocolos con respaldo sanitario,"
                accent={{ text: "no promesas mágicas", className: "text-[#059669]" }}
                className="section-title mt-3"
              />
              <p className="mt-5 text-lg text-[var(--muted)]" data-reveal>
                Poblar una barba desde cero o frenar la alopecia androgenética requiere entender la
                biología del folículo, elegir un vehículo que no destruya tu barrera cutánea y ser
                constante cada 12 horas.
              </p>
              <div className="mt-7 flex flex-wrap gap-3" data-reveal>
                <OpenChatButton
                  label="Consultar una duda al Asesor IA"
                  className="btn btn-buy"
                  magnetic
                />
                <Link href="/hola-hablamos/" className="btn btn-ghost" data-magnetic>
                  Sobre Charlie Lingán
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card spot p-6" data-reveal>
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                  ✓ Estándar MásBarba.net & You Minox
                </span>
                <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
                  <li>• Fórmulas con Notificación Sanitaria DIGEMID en Perú</li>
                  <li>• Base en Crema-Gel de 60 g sin propilenglicol irritante</li>
                  <li>• Tiempos reales de absorción (4h ducha, 24h dermaroller)</li>
                  <li>• Asesor IA entrenado con las 2,463 guías del portal</li>
                </ul>
              </div>
              <div className="card spot p-6" data-reveal data-reveal-delay="1">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                  ⚠️ Lociones informales o sin guía
                </span>
                <ul className="mt-4 space-y-2.5 text-sm text-[var(--muted)]">
                  <li>• Goteros saturados de alcohol que causan caspa de barba</li>
                  <li>• Riesgo de falsificación en reventa sin registro sanitario</li>
                  <li>• Abandono al mes 2 por picazón, granos o falta de rutina</li>
                  <li>• Promesas irreales de barba completa en 7 días</li>
                </ul>
              </div>

              {/* Tarjeta de Autor E-E-A-T: Charlie Lingán */}
              <div
                className="card spot sm:col-span-2 p-6 sm:p-7 flex flex-col sm:flex-row items-center gap-6"
                data-reveal
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/charlie-lingan.jpg"
                  alt="Charlie Lingán — Fundador de You Minox y MásBarba.net"
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover shadow-md shrink-0 border-2 border-emerald-500"
                  loading="lazy"
                />
                <div className="text-center sm:text-left">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-[#047857]">
                    Fundador de You Minox & Editor General
                  </span>
                  <h3 className="mt-2 font-display text-xl font-extrabold text-[#0f172a]">
                    ¡Hola! Soy Charlie Lingán, creador de MásBarba.net
                  </h3>
                  <p className="mt-1.5 text-sm text-[var(--muted)] leading-relaxed">
                    Fundé{" "}
                    <a
                      href={YOU_MINOX_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#059669] underline"
                    >
                      You Minox (youminox.com)
                    </a>{" "}
                    para ofrecer el primer Minoxidil al 5% en Crema-Gel que cuida la piel mientras
                    puebla tu barba y cabello. Aquí compartimos toda la ciencia y experiencia de
                    nuestra comunidad de más de 600,000 seguidores.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-4">
                    <Link
                      href="/hola-hablamos/"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#059669] hover:underline"
                    >
                      Conoce mi historia y contáctame →
                    </Link>
                    <a
                      href="https://charlielingan.com/es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-700 hover:underline"
                    >
                      Visitar charlielingan.com ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preguntas Frecuentes (FAQ Schema) */}
          <div className="mt-20 mx-auto max-w-4xl">
            <div className="text-center mb-10">
              <span className="eyebrow">Dudas Frecuentes Resueltas</span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
                Preguntas Frecuentes sobre Minoxidil, You Minox, Biotina y Barba
              </h2>
            </div>

            <div className="space-y-4">
              {HOME_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group card p-6 open:border-emerald-400"
                  open={idx === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base sm:text-lg font-extrabold text-[#0f172a]">
                    <span>{faq.q}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[#059669] font-extrabold transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ClientEffects />
    </>
  );
}
