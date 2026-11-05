import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCategories, YOU_MINOX_URL } from "@/lib/data";

export default function NotFound() {
  const categories = getAllCategories();

  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center bg-light-bg py-20 px-4">
        <div className="max-w-2xl text-center bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-lg">
          <span className="inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold text-primary-dark">
            Error 404 — Guía no encontrada
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Esta página se ha movido o no existe
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Explora nuestras 6 categorías principales con más de 958 artículos
            sobre crecimiento de barba, Minoxidil en crema{" "}
            <strong className="text-slate-900">You Minox</strong>, Biotina,
            Finasteride y soluciones contra la alopecia.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}/`}
                className="rounded-full bg-slate-100 hover:bg-primary hover:text-white px-4 py-2 text-xs font-bold text-slate-800 transition"
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-extrabold text-white hover:bg-primary-dark transition"
            >
              ← Volver al Inicio y Buscador
            </Link>
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-extrabold text-emerald-400 hover:bg-slate-800 transition"
            >
              Visitar YouMinox.com ↗
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
