"use client";

import { useEffect, useState } from "react";
import {
  AmazonProductRecommendation,
  AmazonStoreRegion,
  buildAmazonUrl,
  detectUserAmazonRegion,
} from "@/lib/amazon";

interface AmazonAffiliateBoxProps {
  variant: "inline" | "showcase" | "sidebar";
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
}

function CategoryIcon({
  type,
}: {
  type: AmazonProductRecommendation["categoryType"];
}) {
  if (type === "microneedling") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-300/60">
        <span className="text-xl" aria-hidden>
          ⚡
        </span>
      </div>
    );
  }
  if (type === "supplement") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-300/60">
        <span className="text-xl" aria-hidden>
          💊
        </span>
      </div>
    );
  }
  if (type === "shampoo") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 border border-teal-300/60">
        <span className="text-xl" aria-hidden>
          🛡️
        </span>
      </div>
    );
  }
  if (type === "skincare") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 border border-sky-300/60">
        <span className="text-xl" aria-hidden>
          🧴
        </span>
      </div>
    );
  }
  if (type === "applicator") {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-300/60">
        <span className="text-xl" aria-hidden>
          🎯
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-amber-400 border border-amber-500/40 shadow-2xs">
      <span className="text-xl" aria-hidden>
        🧔
      </span>
    </div>
  );
}

export default function AmazonAffiliateBox({
  variant,
  sectionTitle,
  sectionSubtitle,
  products,
}: AmazonAffiliateBoxProps) {
  const [region, setRegion] = useState<AmazonStoreRegion>("US");

  useEffect(() => {
    setRegion(detectUserAmazonRegion());
  }, []);

  const primaryProduct = products[0];
  const storeName = region === "ES" ? "Amazon.es" : "Amazon.com";
  const tagName = region === "ES" ? "masbarba-21" : "masbarba-20";

  // 1. INLINE VARIANT (Appears mid-article for high mobile CTR)
  if (variant === "inline") {
    const url = buildAmazonUrl(primaryProduct, region);

    return (
      <aside
        aria-label="Recomendación destacada en Amazon"
        className="my-9 rounded-2xl border-2 border-amber-400/80 bg-gradient-to-br from-[#f0fdf4] via-[#fffbeb] to-[#ecfdf5] p-5 sm:p-6 shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-950 border border-amber-400/50">
            {primaryProduct.badge}
          </span>
          <div className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
            <span>Tienda:</span>
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`px-1.5 py-0.5 rounded-full transition cursor-pointer ${
                region === "US"
                  ? "bg-amber-500 text-slate-950 font-extrabold"
                  : "hover:text-slate-900"
              }`}
              title="Ver en Amazon USA / Latinoamérica (masbarba-20)"
            >
              🇺🇸 US
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setRegion("ES")}
              className={`px-1.5 py-0.5 rounded-full transition cursor-pointer ${
                region === "ES"
                  ? "bg-amber-500 text-slate-950 font-extrabold"
                  : "hover:text-slate-900"
              }`}
              title="Ver en Amazon España (masbarba-21)"
            >
              🇪🇸 ES
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <CategoryIcon type={primaryProduct.categoryType} />
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                {primaryProduct.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {primaryProduct.subtitle}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                <span className="font-bold text-amber-600">
                  ★★★★★ {primaryProduct.rating}/5
                </span>
                <span className="text-slate-500 font-medium">
                  ({primaryProduct.reviewsCount} valoraciones)
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                  ✓ Envío Prime en {storeName}
                </span>
              </div>
            </div>
          </div>

          <div className="sm:shrink-0">
            <a
              href={url}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-sm transition hover:from-amber-300 hover:to-amber-400 hover:shadow-md"
            >
              <span>{primaryProduct.ctaLabel}</span>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    );
  }

  // 2. SIDEBAR VARIANT (Sticky right column on desktop)
  if (variant === "sidebar") {
    return (
      <div className="rounded-2xl border-2 border-amber-400/70 bg-gradient-to-b from-[#fffdf8] to-[#f0fdf4] p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
            🛒 Recomendado en {storeName}
          </span>
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`cursor-pointer ${
                region === "US" ? "text-amber-700 font-extrabold underline" : ""
              }`}
            >
              🇺🇸 US
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setRegion("ES")}
              className={`cursor-pointer ${
                region === "ES" ? "text-amber-700 font-extrabold underline" : ""
              }`}
            >
              🇪🇸 ES
            </button>
          </div>
        </div>

        <div className="space-y-3.5">
          {products.slice(0, 2).map((prod) => {
            const url = buildAmazonUrl(prod, region);
            return (
              <div
                key={prod.id}
                className="rounded-xl border border-amber-200/80 bg-white p-3.5 shadow-2xs"
              >
                <span className="inline-block rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                  {prod.badge}
                </span>
                <h4 className="mt-1.5 text-xs font-extrabold text-slate-900 leading-snug">
                  {prod.title}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="font-bold text-amber-600">
                    ★★★★★ {prod.rating}
                  </span>
                  <span className="text-slate-400">({prod.reviewsCount})</span>
                </div>
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-extrabold text-slate-950 transition hover:bg-amber-300"
                >
                  <span>Ver en {storeName}</span>
                  <span>→</span>
                </a>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-slate-500 leading-tight text-center">
          Enlaces de afiliado oficial de Amazon ({tagName}).
        </p>
      </div>
    );
  }

  // 3. SHOWCASE VARIANT (Full 3-product comparison grid at bottom of page/article)
  return (
    <section
      aria-label="Selección de productos recomendados en Amazon"
      className="my-12 rounded-3xl border-2 border-amber-400/80 bg-gradient-to-br from-slate-950 via-[#042f2e] to-slate-900 p-6 sm:p-8 text-white shadow-xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-extrabold text-amber-300">
            🛒 Selección Oficial MásBarba.net · Disponible en {storeName}
          </span>
          <h2 className="mt-2.5 text-xl sm:text-2xl font-extrabold text-white">
            {sectionTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-300">
            {sectionSubtitle}
          </p>
        </div>

        {/* Store Switcher (Auto-detected + Manual Override) */}
        <div className="shrink-0 self-start sm:self-center rounded-xl bg-white/10 p-1.5 border border-white/15 text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setRegion("US")}
              className={`rounded-lg px-2.5 py-1.5 font-bold transition cursor-pointer ${
                region === "US"
                  ? "bg-amber-400 text-slate-950 shadow-2xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              🇺🇸 Amazon.com
            </button>
            <button
              type="button"
              onClick={() => setRegion("ES")}
              className={`rounded-lg px-2.5 py-1.5 font-bold transition cursor-pointer ${
                region === "ES"
                  ? "bg-amber-400 text-slate-950 shadow-2xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              🇪🇸 Amazon.es
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {products.map((product, index) => {
          const url = buildAmazonUrl(product, region);
          const isFeatured = index === 0;

          return (
            <div
              key={product.id}
              className={`flex flex-col justify-between rounded-2xl p-5 transition ${
                isFeatured
                  ? "bg-gradient-to-b from-amber-500/20 via-white/[0.08] to-white/[0.04] border-2 border-amber-400 shadow-lg"
                  : "bg-white/[0.05] border border-white/15 hover:border-amber-400/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[11px] font-extrabold ${
                      isFeatured
                        ? "bg-amber-400 text-slate-950"
                        : "bg-white/10 text-amber-300"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>

                <h3 className="mt-3.5 text-base sm:text-lg font-extrabold text-white leading-snug">
                  {product.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  {product.subtitle}
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="font-extrabold text-amber-400">
                    ★★★★★ {product.rating}/5
                  </span>
                  <span className="text-slate-400">
                    ({product.reviewsCount} reseñas)
                  </span>
                </div>

                <ul className="mt-4 space-y-2 border-t border-white/10 pt-3.5 text-xs text-slate-200">
                  {product.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-extrabold shrink-0">
                        ✓
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-2">
                <a
                  href={url}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs sm:text-sm font-extrabold transition ${
                    isFeatured
                      ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md hover:from-amber-300 hover:to-amber-400"
                      : "bg-white/15 text-white hover:bg-amber-400 hover:text-slate-950"
                  }`}
                >
                  <span>{product.ctaLabel}</span>
                  <span>↗</span>
                </a>
                <p className="mt-2 text-center text-[10px] text-slate-400">
                  Disponible con Envío Rápido en {storeName}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[11px] text-slate-400">
        💡 Como Afiliados de Amazon ({tagName}), MásBarba.net percibe una
        pequeña comisión por las compras calificadas sin ningún costo adicional
        para ti. ¿Buscas Minoxidil al 5% en Crema-Gel en el Perú? Pídelo en{" "}
        <a
          href="https://youminox.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-emerald-300 underline hover:text-white"
        >
          YouMinox.com
        </a>
        .
      </p>
    </section>
  );
}
