import Link from "next/link";
import { YOU_MINOX_URL } from "@/lib/data";

interface YouMinoxSpotlightProps {
  variant?: "home" | "article" | "sidebar";
}

export default function YouMinoxSpotlight({
  variant = "home",
}: YouMinoxSpotlightProps) {
  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-14 w-14 rounded-xl bg-white p-1.5 shrink-0 shadow-md">
            <img
              src="/images/brand/you-minox.webp"
              alt="You Minox Minoxidil al 5% en Crema-Gel"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          <div>
            <span className="inline-block rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
              Creador Oficial
            </span>
            <h3 className="text-base font-extrabold text-white leading-tight mt-0.5">
              You Minox 5%
            </h3>
            <p className="text-[11px] text-slate-300">
              Minoxidil en Crema-Gel
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          ¿El minoxidil líquido te reseca la cara o te saca caspa en la barba?{" "}
          <strong className="text-white">You Minox</strong> estimula los
          folículos al 5% en base crema-gel dermo-hidratante{" "}
          <strong className="text-emerald-300">sin resequedad ni goteo</strong>.
        </p>
        <ul className="space-y-1.5 text-xs text-emerald-200 mb-5">
          <li>✓ Sin picazón ni descamación</li>
          <li>✓ Ideal para barba, entradas y cejas</li>
          <li>✓ +600,000 seguidores en redes</li>
        </ul>
        <a
          href={YOU_MINOX_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-emerald-400 py-3 text-center text-xs font-extrabold text-slate-950 shadow-md transition hover:bg-emerald-300"
        >
          Visitar YouMinox.com ↗
        </a>
      </div>
    );
  }

  if (variant === "article") {
    return (
      <div className="my-10 rounded-2xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white p-2.5 flex-shrink-0 shadow-lg">
            <img
              src="/images/brand/you-minox.webp"
              alt="You Minox Minoxidil al 5% en Crema-Gel"
              width={200}
              height={200}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-grow text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                ✨ Recomendación Oficial • YouMinox.com
              </span>
              <span className="text-xs font-semibold text-amber-300">
                ★ +600,000 seguidores en TikTok e Instagram
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              ¿Buscas Crecer tu Barba y Cabello sin la Resequedad del Alcohol?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
              Esta guía fue elaborada por el equipo de{" "}
              <strong className="text-white">You Minox</strong>. A diferencia
              del minoxidil líquido tradicional con propilenglicol que irrita y
              descama la piel, la fórmula de{" "}
              <strong className="text-emerald-300">
                You Minox en Crema-Gel al 5%
              </strong>{" "}
              se absorbe suavemente nutriendo tus folículos.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg"
              >
                Conocer You Minox en YouMinox.com ↗
              </a>
              <Link
                href="/minoxidil/minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales/"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-3 text-xs sm:text-sm font-bold text-white transition"
              >
                Ver Comparativa: You Minox vs Kirkland →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-950 via-[#042f2e] to-slate-950 text-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl relative z-10">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 mb-4">
            ✨ Página Creada e Impulsada por You Minox (youminox.com)
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Conoce a <span className="text-emerald-400">You Minox</span>: Los
            Pioneros del Minoxidil al 5% en Crema-Gel
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            <strong>MásBarba.net</strong> nació gracias a la experiencia real de{" "}
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 font-bold underline hover:text-white"
            >
              You Minox (youminox.com)
            </a>{" "}
            y miles de clientes que buscaban poblar su barba y recuperar su
            cabello sin sufrir la irritación del minoxidil líquido tradicional.
          </p>
        </div>

        {/* 2-Column Showcase: You Minox Product + Charlie Lingan Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Card: You Minox Cream-Gel Advantage */}
          <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-white p-3 flex-shrink-0 shadow-2xl">
                <img
                  src="/images/brand/you-minox.webp"
                  alt="You Minox Minoxidil en Crema-Gel"
                  width={300}
                  height={236}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-2">
                  Innovación Dermatológica Capilar y Facial
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                  ¿Por Qué Elegir Minoxidil en Crema-Gel de You Minox?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                  Las lociones líquidas convencionales dependen de alcohol y
                  propilenglicol que dejan el rostro reseco, con descamación
                  blanca, picazón o brotes de granos.{" "}
                  <strong className="text-white">You Minox</strong> desarrolló
                  una fórmula en{" "}
                  <strong className="text-emerald-300">crema-gel al 5%</strong>{" "}
                  que hidrata la piel mientras estimula los folículos de la
                  barba y el cuero cabelludo.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30">
                    ✓ Cero Resequedad por Alcohol
                  </span>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30">
                    ✓ Especial para Barba y Cabello
                  </span>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30">
                    ✓ Rápida Absorción sin Goteo
                  </span>
                </div>
              </div>
            </div>

            {/* Social Proof Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  🎵
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white leading-tight">
                    +500K
                  </div>
                  <div className="text-xs text-slate-400">
                    TikTok @You_minox
                  </div>
                </div>
              </a>

              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-lg">
                  📸
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white leading-tight">
                    +100K
                  </div>
                  <div className="text-xs text-slate-400">
                    Instagram @youminox
                  </div>
                </div>
              </a>

              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900/80 hover:bg-slate-900 border border-white/10 rounded-2xl p-4 flex items-center gap-3.5 transition-all hover:-translate-y-0.5"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  🏆
                </div>
                <div>
                  <div className="text-lg font-extrabold text-white leading-tight">
                    #1 en Perú
                  </div>
                  <div className="text-xs text-slate-400">
                    y expansión internacional
                  </div>
                </div>
              </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="text-xs sm:text-sm text-slate-300">
                Descubre la tienda oficial, precios y resultados reales:
              </span>
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold px-7 py-3.5 rounded-xl text-sm shadow-lg transition-all hover:scale-[1.02]"
              >
                Ir a la Web Oficial: YouMinox.com ↗
              </a>
            </div>
          </div>

          {/* Right Card: Charlie Lingan Story */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-lg flex-shrink-0">
                  <img
                    src="/images/brand/charlie-lingan.webp"
                    alt="Charlie Lingán - Fundador de You Minox y MásBarba.net"
                    width={160}
                    height={160}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                    Mensaje del Fundador
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    Charlie Lingán
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fundador de You Minox (youminox.com) & MásBarba.net
                  </p>
                </div>
              </div>

              <blockquote className="text-slate-200 text-sm sm:text-base leading-relaxed italic border-l-4 border-emerald-400 pl-4 py-1 mb-6">
                &ldquo;Soy Charlie Lingán, fundador de la marca{" "}
                <strong>You Minox</strong>, la más posicionada en el Perú y con
                una comunidad de más de 600,000 seguidores. Con toda la
                experiencia real de nuestros clientes utilizando Minoxidil en
                crema-gel, creamos <strong>MásBarba.net</strong> para responder
                de manera honesta, clara y científica todas tus dudas sobre el
                crecimiento de la barba, el cuidado de la piel y la recuperación
                capilar.&rdquo;
              </blockquote>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Ecosistema Oficial de la Marca
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    Tienda Oficial You Minox
                  </div>
                </div>
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 underline"
                >
                  https://youminox.com →
                </a>
              </div>
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Conoce la historia de nuestro fundador
                  </div>
                  <div className="text-sm font-extrabold text-white">
                    Biografía y Contacto Directo
                  </div>
                </div>
                <Link
                  href="/hola-hablamos/"
                  className="text-xs font-extrabold text-amber-400 hover:text-amber-300 underline"
                >
                  Ver historia →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
