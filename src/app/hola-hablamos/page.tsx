import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL, YOU_MINOX_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "¡Hola! ¿Hablamos? Charlie Lingán — Fundador de You Minox & MásBarba.net",
  description:
    "Conoce a Charlie Lingán (Carlos Lingán), fundador de You Minox (youminox.com) y MásBarba.net, experto en ecommerce y crecimiento de barba.",
  alternates: { canonical: `${SITE_URL}/hola-hablamos/` },
};

export default function HolaHablamosPage() {
  const page = getPageBySlug("hola-hablamos");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Charlie Lingán",
      alternateName: "Carlos Lingán",
      url: `${SITE_URL}/hola-hablamos/`,
      image: `${SITE_URL}/images/brand/charlie-lingan.webp`,
      jobTitle: "Fundador de You Minox y MásBarba.net",
      sameAs: [YOU_MINOX_URL, "https://charlielingan.com/", "https://carloslingan.pe/"],
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Sobre Charlie Lingán & You Minox" },
            ]}
          />

          <div className="mt-6 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-[#042f2e] to-slate-900 p-8 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center gap-8">
            <img
              src="/images/brand/charlie-lingan.webp"
              alt="Charlie Lingán — Fundador de You Minox"
              className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
            />
            <div>
              <span className="inline-block rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-extrabold text-emerald-300">
                Fundador de You Minox & {SITE_NAME}
              </span>
              <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold leading-tight">
                ¡Hola! ¿Hablamos? Soy Charlie Lingán
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                Fundador de{" "}
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-emerald-400 underline"
                >
                  You Minox (youminox.com)
                </a>
                , la marca líder de Minoxidil al 5% en crema-gel con más de
                600,000 seguidores en redes sociales, y director editorial de{" "}
                <strong>masbarba.net</strong>.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-emerald-300 transition"
                >
                  Visitar YouMinox.com ↗
                </a>
                <a
                  href="https://charlielingan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Visitar charlielingan.com →
                </a>
                <Link
                  href="/minoxidil/"
                  className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Ver Guías de Minoxidil
                </Link>
              </div>
            </div>
          </div>

          {page && (
            <div
              className="article-content mt-10 max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
