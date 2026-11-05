import Link from "next/link";
import { getAllCategories, SITE_NAME, YOU_MINOX_URL } from "@/lib/data";

export default function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & You Minox Official Attribution */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black">
                🧔
              </div>
              <span className="text-xl font-extrabold text-white">
                MásBarba<span className="text-emerald-400">.net</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Enciclopedia clínica y práctica sobre crecimiento de barba,{" "}
              <strong className="text-white">Minoxidil al 5% en crema-gel</strong>,
              biotina, finasteride y soluciones efectivas contra la alopecia.
              Página creada e impulsada oficialmente por{" "}
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-400 hover:underline"
              >
                You Minox (youminox.com)
              </a>
              .
            </p>
            <div className="pt-1 flex flex-col gap-1.5">
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 hover:text-amber-300"
              >
                ✨ Tienda Oficial: YouMinox.com ↗
              </a>
              <Link
                href="/hola-hablamos/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Fundador & Editor: Charlie Lingán →
              </Link>
            </div>
          </div>

          {/* Column 2: All 6 Categories */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Especialidades Capilares (958 Guías)
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}/`}
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-slate-400">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Flagship You Minox & Beard Guides */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Protagonistas You Minox & Barba
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link
                  href="/minoxidil/you-minox-opiniones-vale-la-pena-la-compra-guia-completa/"
                  className="hover:text-emerald-400 transition-colors font-semibold text-emerald-300"
                >
                  ★ You Minox Opiniones: Guía Completa y Resultados
                </Link>
              </li>
              <li>
                <Link
                  href="/minoxidil/minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales/"
                  className="hover:text-emerald-400 transition-colors font-semibold text-amber-300"
                >
                  ★ Comparativa: Minoxidil Kirkland vs You Minox
                </Link>
              </li>
              <li>
                <Link
                  href="/minoxidil/minoxidil-en-crema-como-aplicar-correctamente/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Minoxidil en Crema: Cómo Aplicar Correctamente
                </Link>
              </li>
              <li>
                <Link
                  href="/minoxidil/como-aplicar-minoxidil-para-evitar-irritacion/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cómo Aplicar Minoxidil sin Irritación ni Resequedad
                </Link>
              </li>
              <li>
                <Link
                  href="/consejos/por-que-el-minoxidil-me-saca-granos/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  ¿Por Qué el Minoxidil Líquido Saca Granos o Caspa?
                </Link>
              </li>
              <li>
                <Link
                  href="/estilo/como-hacer-poblar-la-barba/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cómo Poblar la Barba Paso a Paso
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Alopecia, Biotina & Legal */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
              Salud Capilar & Legal
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link
                  href="/alopecia/la-alopecia-en-hombres-tiene-cura-definitiva/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  ¿La Alopecia en Hombres Tiene Cura Definitiva?
                </Link>
              </li>
              <li>
                <Link
                  href="/biotina/cuanta-biotina-tomar-segun-expertos/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cuánta Biotina Tomar al Día Según Expertos
                </Link>
              </li>
              <li>
                <Link
                  href="/finasteride/finasteride-vs-minoxidil-para-alopecia/"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Finasteride vs Minoxidil para la Alopecia
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <Link
                  href="/hola-hablamos/"
                  className="hover:text-white transition-colors"
                >
                  ¡Hola! ¿Hablamos? (Sobre Charlie Lingán)
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidad/"
                  className="hover:text-white transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/aviso-legal/"
                  className="hover:text-white transition-colors"
                >
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-cookies/"
                  className="hover:text-white transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {SITE_NAME} — Página creada e impulsada por{" "}
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 font-bold hover:underline"
            >
              You Minox (youminox.com)
            </a>
            . Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-slate-300">
              Mapa del Sitio (XML)
            </Link>
            <span>·</span>
            <a
              href={YOU_MINOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              YouMinox.com
            </a>
            <span>·</span>
            <Link href="/hola-hablamos/" className="hover:text-slate-300">
              Charlie Lingán
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
