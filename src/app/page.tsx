import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSearch from "@/components/HeroSearch";
import BeardGrowthAdvisor from "@/components/BeardGrowthAdvisor";
import YouMinoxSpotlight from "@/components/YouMinoxSpotlight";
import BlogExplorerClient from "@/components/BlogExplorerClient";
import AdBanner from "@/components/AdBanner";
import {
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
  title: `${SITE_NAME} — Minoxidil para Barba y Cabello, You Minox en Crema, Biotina y Alopecia`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

const PILLAR_HUBS = [
  {
    slug: "minoxidil",
    tag: "Estímulo Folicular 5%",
    title: "Minoxidil para Barba y Cabello",
    desc: "Guías clínicas sobre Minoxidil en Crema-Gel You Minox vs. formato líquido o espuma, tiempos de resultados mes a mes, dermaroller y aplicación sin irritación.",
    badge: "287 guías",
    accent: "from-slate-900 to-emerald-950",
  },
  {
    slug: "alopecia",
    tag: "Regeneración Capilar",
    title: "Alopecia en Hombres, Mujeres y Barba",
    desc: "Causas y tratamientos efectivos para la alopecia androgenética, alopecia areata en la barba, entradas, coronilla, efluvio telógeno y salud del folículo piloso.",
    badge: "300 guías",
    accent: "from-emerald-950 to-slate-900",
  },
  {
    slug: "biotina",
    tag: "Nutrición & Queratina",
    title: "Biotina y Vitaminas para el Cabello",
    desc: "Dosis diaria recomendada de Biotina (Vitamina B7) según expertos, mejores suplementos, fuentes naturales y cómo combinarla con Minoxidil para acelerar resultados.",
    badge: "226 guías",
    accent: "from-slate-950 to-slate-900",
  },
  {
    slug: "finasteride",
    tag: "Control Hormonal DHT",
    title: "Finasteride y Bloqueadores de DHT",
    desc: "Cómo actúa el Finasteride frente a la caída capilar hereditaria, diferencias y sinergia con el Minoxidil al 5%, tiempos de respuesta y recomendaciones médicas.",
    badge: "72 guías",
    accent: "from-slate-900 to-teal-950",
  },
  {
    slug: "estilo",
    tag: "Diseño & Genética",
    title: "Estilos y Genética de la Barba",
    desc: "Descubre los tipos de barba según la forma de tu rostro, cómo influye la genética y las mejores técnicas para poblar y perfilar una barba densa y varonil.",
    badge: "43 guías",
    accent: "from-teal-950 to-slate-950",
  },
  {
    slug: "consejos",
    tag: "Cuidado Facial Diario",
    title: "Consejos y Rutinas para tu Barba",
    desc: "Cómo evitar granos, caspa o resequedad al usar minoxidil, qué aceites naturales y cepillos usar, y cómo mantener tu barba limpia, suave y bien peinada cada día.",
    badge: "30 guías",
    accent: "from-slate-900 to-slate-800",
  },
];

const HOME_FAQS = [
  {
    q: "¿Por qué You Minox en Crema-Gel es mejor para la barba que el Minoxidil líquido tradicional?",
    a: "El minoxidil líquido tradicional contiene altos niveles de alcohol y propilenglicol que resecan la piel del rostro, causando descamación blanca (parecida a la caspa), enrojecimiento, picazón y brotes de granos. You Minox (youminox.com) formuló el Minoxidil al 5% en una base de crema-gel dermo-hidratante que estimula los folículos con la misma potencia clínica pero cuidando tu piel y sin escurrirse.",
  },
  {
    q: "¿En cuánto tiempo se ven resultados reales usando Minoxidil al 5% en la barba?",
    a: "Durante las primeras 4 a 6 semanas comienzan a aparecer los primeros vellos finos (vellos vellosos) en las mejillas y zonas despobladas. Entre el mes 2 y el mes 4 el vello gana grosor y pigmentación, y para consolidar una barba terminal densa y permanente se recomienda un ciclo constante de 6 a 12 meses.",
  },
  {
    q: "¿Puedo combinar Minoxidil You Minox con Biotina y Dermaroller?",
    a: "Sí, es la tríada más efectiva para el crecimiento de la barba. El Minoxidil al 5% aumenta el flujo sanguíneo y nutrientes hacia el folículo; la Biotina (5,000 a 10,000 mcg diarios) aporta la vitamina esencial para sintetizar queratina fuerte; y el Dermaroller de 0.5 mm (1 a 2 veces por semana) activa la producción de colágeno en los huecos rebeldes.",
  },
  {
    q: "¿Quién creó MásBarba.net y qué relación tiene con You Minox?",
    a: "MásBarba.net es el portal educativo oficial creado por Charlie Lingán y el equipo de You Minox (youminox.com), la marca líder de Minoxidil en crema-gel con más de 600,000 seguidores en TikTok e Instagram. Nuestro objetivo es brindar guías verificadas y basadas en la experiencia real de miles de clientes.",
  },
];

export default function HomePage() {
  const youMinoxGuides = getYouMinoxFeaturedPosts(6);
  const beardGuides = getBeardAndCareGuides(6);
  const alopeciaGuides = getAlopeciaAndBiotinaGuides(6);
  const topSeoPosts = getTopSeoPosts(9);
  const categories = getAllCategories();

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
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        {/* Hero Section with Official You Minox Attribution & Instant Search */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#042f2e] to-slate-900 py-18 sm:py-24 text-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-emerald-400/15 border border-emerald-400/35 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-300 shadow-lg">
              <span>🧔 Portal Oficial de Barba y Salud Capilar</span>
              <span className="text-white/40">•</span>
              <span>
                Creado por{" "}
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-300 underline hover:text-white"
                >
                  You Minox (youminox.com)
                </a>
              </span>
            </div>

            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Mejora tu Imagen con{" "}
              <span className="text-emerald-400">Más Barba</span>: Guías de{" "}
              <span className="text-amber-300">You Minox</span>, Minoxidil,
              Biotina y Alopecia
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-base sm:text-lg text-slate-200 leading-relaxed">
              Explora más de{" "}
              <strong className="text-white">958 guías verificadas</strong>{" "}
              sobre crecimiento de barba desde cero,{" "}
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-300 underline hover:text-white"
              >
                Minoxidil al 5% en Crema-Gel You Minox
              </a>{" "}
              (sin resequedad ni caspa), suplementación con Biotina, Finasteride
              y tratamientos contra la caída del cabello.
            </p>

            {/* Instant Search Bar */}
            <div className="mt-9">
              <HeroSearch />
            </div>

            {/* Quick Category Pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              <Link
                href="/minoxidil/"
                className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-300 transition shadow-md"
              >
                💧 Minoxidil & You Minox (287)
              </Link>
              <Link
                href="/alopecia/"
                className="rounded-full bg-amber-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-amber-300 transition shadow-md"
              >
                💇‍♂️ Alopecia y Caída Capilar (300)
              </Link>
              <Link
                href="/biotina/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                💊 Biotina y Vitaminas (226)
              </Link>
              <Link
                href="/finasteride/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🧬 Finasteride y DHT (72)
              </Link>
              <Link
                href="/estilo/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🧔 Estilos y Tipos de Barba (43)
              </Link>
              <Link
                href="/consejos/"
                className="rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
              >
                🛡️ Consejos y Cuidado Diario (30)
              </Link>
            </div>
          </div>
        </section>

        {/* Authority & You Minox Community Bar */}
        <section className="bg-white border-b border-slate-200/80 py-8 px-4">
          <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                958+
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                Guías Clínicas y Prácticas
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                +600K
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                Seguidores de You Minox
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                5% Crema-Gel
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                Fórmula sin Alcohol Irritante
              </div>
            </div>
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 p-4 border border-emerald-200 transition group"
            >
              <div className="text-xl sm:text-2xl font-extrabold text-primary-dark group-hover:text-primary">
                YouMinox.com ↗
              </div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-primary mt-0.5">
                Visitar Web Oficial Creadora
              </div>
            </a>
          </div>
        </section>

        {/* Interactive Beard & Hair Growth Diagnostic Tool (High Retention) */}
        <section className="py-14 bg-light-bg border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <BeardGrowthAdvisor />
          </div>
        </section>

        {/* AdSense Banner #1 */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <AdBanner />
        </div>

        {/* Section 1: Flagship You Minox & Cream Minoxidil Comparisons */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary-dark mb-2">
                  ⭐ Especial Protagonista • You Minox (youminox.com)
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Todo sobre You Minox, Opiniones Reales y Comparativas vs.
                  Minoxidil Tradicional
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-extrabold text-primary hover:underline"
                >
                  Tienda Oficial YouMinox.com ↗
                </a>
                <span className="text-slate-300">|</span>
                <Link
                  href="/minoxidil/"
                  className="text-sm font-bold text-slate-700 hover:text-primary"
                >
                  Ver las 287 Guías de Minoxidil →
                </Link>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {youMinoxGuides.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                    <img
                      src={getImageUrl(post.featuredImageUrl)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-bold text-emerald-300">
                      ★ Destacado You Minox
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center gap-2 text-xs text-slate-400">
                      <span>⏱️ {post.readTime} de lectura</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">
                        ✓ Análisis Oficial
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      Leer análisis completo →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Flagship You Minox & Charlie Lingan Brand Spotlight Section */}
        <YouMinoxSpotlight variant="home" />

        {/* Section 2: 6 Major Pillar Hubs (Unlocking all 958 articles for Google SEO) */}
        <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Arquitectura Clínica Completa (958 Artículos)
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold">
                Explora Nuestras 6 Especialidades en Barba y Cabello
              </h2>
              <p className="mt-3 text-slate-300 text-sm sm:text-base">
                Accede directamente a nuestras bibliotecas especializadas en
                Minoxidil al 5%, regeneración contra la alopecia, suplementación
                con Biotina, Finasteride, diseño de barba y cuidado de la piel.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PILLAR_HUBS.map((card) => {
                const samplePosts = getPostsByCategory(card.slug).slice(0, 4);
                return (
                  <div
                    key={card.slug}
                    className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${card.accent} p-6 flex flex-col justify-between transition hover:border-emerald-500/60`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-extrabold text-emerald-300">
                          {card.tag}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {card.badge}
                        </span>
                      </div>
                      <Link href={`/${card.slug}/`}>
                        <h3 className="mt-4 text-xl font-extrabold text-white hover:text-emerald-300 transition-colors">
                          {card.title}
                        </h3>
                      </Link>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {card.desc}
                      </p>

                      <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
                        {samplePosts.map((sp) => (
                          <li key={sp.id}>
                            <Link
                              href={getPostUrl(sp)}
                              className="hover:text-emerald-300 transition-colors line-clamp-1 flex items-center gap-1.5"
                            >
                              <span className="text-emerald-400">›</span>
                              <span>{sp.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-3 border-t border-white/10">
                      <Link
                        href={`/${card.slug}/`}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 hover:text-emerald-300"
                      >
                        Explorar {card.badge} de {card.title} →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Essential Beard Growth, Styling & Skin Care Guides */}
        <section className="py-16 bg-light-bg border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                  🧔 Cuidado Diario, Estilos y Piel Saludable
                </span>
                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Los Mejores Consejos para Poblar, Peinar y Cuidar tu Barba
                </h2>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/estilo/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver Estilos de Barba (43) →
                </Link>
                <span className="text-slate-300">|</span>
                <Link
                  href="/consejos/"
                  className="text-sm font-bold text-primary hover:underline"
                >
                  Ver Consejos de Cuidado (30) →
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beardGuides.map((post) => (
                <Link
                  key={post.id}
                  href={getPostUrl(post)}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg hover:border-primary/40"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
                    <img
                      src={getImageUrl(post.featuredImageUrl)}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-bold text-emerald-300">
                      {post.categoryName}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="mt-4 inline-block text-xs font-extrabold text-primary">
                      Leer guía paso a paso →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* AdSense Banner #2 */}
        <div className="mx-auto max-w-5xl px-4 py-6">
          <AdBanner />
        </div>

        {/* Section 4: Interactive Tabbed Explorer */}
        <section className="py-16 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Buscador por Categoría
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Explora Nuestros Artículos de Minoxidil, Alopecia, Biotina y
                Finasteride
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Filtra en tiempo real por especialidad o accede al archivo
                completo de cada categoría.
              </p>
            </div>

            <BlogExplorerClient
              initialPosts={explorerPosts}
              categories={categories}
            />
          </div>
        </section>

        {/* Section 5: Home FAQs */}
        <section className="py-16 bg-light-bg">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                Preguntas Frecuentes Verificadas
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Respuestas Rápidas sobre You Minox, Barba y Salud Capilar
              </h2>
            </div>

            <div className="space-y-4">
              {HOME_FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
                >
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {faq.q}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
