"use client";

import { useState } from "react";
import Link from "next/link";
import type { Post, Category } from "@/lib/data";

interface BlogExplorerProps {
  initialPosts: Post[];
  categories: Category[];
}

export default function BlogExplorerClient({
  initialPosts,
  categories,
}: BlogExplorerProps) {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const filtered =
    selectedCat === "all"
      ? initialPosts
      : initialPosts.filter(
          (p) =>
            p.category === selectedCat ||
            p.categories.some((c) => c.slug === selectedCat)
        );

  const displayed = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* Category Filter Pills */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSelectedCat("all");
            setVisibleCount(12);
          }}
          className={`rounded-full px-4 py-2 text-xs font-extrabold transition cursor-pointer ${
            selectedCat === "all"
              ? "bg-primary text-white shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Todas las Especialidades (958)
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => {
              setSelectedCat(cat.slug);
              setVisibleCount(12);
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition cursor-pointer ${
              selectedCat === cat.slug
                ? "bg-primary text-white shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayed.map((post) => (
          <Link
            key={post.id}
            href={`/${post.category}/${post.slug}/`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div className="aspect-[16/9] overflow-hidden bg-slate-100 relative">
              <img
                src={post.featuredImageUrl || "/images/brand/you-minox.webp"}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 rounded-full bg-slate-900/90 px-3 py-1 text-[10px] font-bold text-emerald-300">
                {post.categoryName}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-400">
                <span>⏱️ {post.readTime}</span>
                <span>·</span>
                <span className="text-emerald-700 font-semibold">
                  ✓ Verificada por You Minox
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 flex-1">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-primary">
                Leer guía completa →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More / Category CTA */}
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {visibleCount < filtered.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="rounded-xl bg-slate-900 px-6 py-3 text-xs sm:text-sm font-extrabold text-white hover:bg-primary transition cursor-pointer"
          >
            Mostrar más guías ({filtered.length - visibleCount} disponibles en vista rápida)
          </button>
        )}
        {selectedCat !== "all" && (
          <Link
            href={`/${selectedCat}/`}
            className="rounded-xl border border-primary bg-emerald-50 px-6 py-3 text-xs sm:text-sm font-extrabold text-primary hover:bg-primary hover:text-white transition"
          >
            Ver archivo completo de esta categoría →
          </Link>
        )}
      </div>
    </div>
  );
}
