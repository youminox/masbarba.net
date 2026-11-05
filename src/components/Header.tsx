"use client";

import { useState } from "react";
import Link from "next/link";
import { YOU_MINOX_URL } from "@/lib/data";

const MAIN_NAV = [
  { label: "Minoxidil", href: "/minoxidil/" },
  { label: "Alopecia", href: "/alopecia/" },
  { label: "Biotina", href: "/biotina/" },
  { label: "Finasteride", href: "/finasteride/" },
  { label: "Estilos de Barba", href: "/estilo/" },
  { label: "Consejos", href: "/consejos/" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      {/* Top You Minox Official Brand Bar */}
      <div className="bg-slate-950 text-white text-[11px] sm:text-xs py-1.5 px-4 border-b border-emerald-500/20">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-300">
              Portal Oficial Creado por{" "}
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-emerald-400 hover:text-emerald-300 underline"
              >
                You Minox (youminox.com)
              </a>{" "}
              — Minoxidil al 5% en Crema-Gel sin Resequedad
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span>🎵 +500K en TikTok @You_minox</span>
            <span>·</span>
            <span>📸 +100K en Instagram @youminox</span>
            <span>·</span>
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-amber-400 hover:text-amber-300"
            >
              Visitar Tienda Oficial YouMinox.com ↗
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 font-black text-lg shadow-xs transition group-hover:bg-primary group-hover:text-white">
            🧔
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
              MásBarba<span className="text-primary">.net</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
              by You Minox • Barba & Capilar
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-bold text-slate-700 hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/hola-hablamos/"
            className="text-sm font-bold text-slate-500 hover:text-primary transition-colors"
          >
            Charlie Lingán
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <Link
            href="/#diagnosticador-barba"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-extrabold text-slate-800 transition hover:border-primary hover:text-primary"
          >
            🧔 Test de Barba
          </Link>
          <a
            href={YOU_MINOX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-xs transition hover:bg-primary-dark"
          >
            ✨ YouMinox.com ↗
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="inline-flex lg:hidden items-center justify-center rounded-xl p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Abrir menú de navegación"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <p className="px-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Especialidades Capilares y Barba
          </p>
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-slate-800 hover:bg-emerald-50 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/hola-hablamos/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-bold text-primary"
            >
              👤 Sobre Charlie Lingán & You Minox
            </Link>
            <Link
              href="/#diagnosticador-barba"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl bg-slate-900 px-4 py-2.5 text-center text-xs font-extrabold text-white"
            >
              🧔 Ir al Diagnosticador Interactivo de Barba
            </Link>
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl bg-primary px-4 py-2.5 text-center text-xs font-extrabold text-white"
            >
              ✨ Visitar Web Oficial YouMinox.com ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
