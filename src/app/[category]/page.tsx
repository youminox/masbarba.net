import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import {
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
  getPostUrl,
  getImageUrl,
  SITE_NAME,
  SITE_URL,
  YOU_MINOX_URL,
} from "@/lib/data";

type Params = Promise<{ category: string }>;

export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) {
    return { title: `Categoría no encontrada | ${SITE_NAME}` };
  }

  const canonicalUrl = `${SITE_URL}/${cat.slug}/`;
  return {
    title: `${cat.name} — Guías Verificadas por You Minox`,
    description: cat.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${cat.name} | ${SITE_NAME}`,
      description: cat.description,
      url: canonicalUrl,
      type: "website",
      locale: "es_PE",
      siteName: SITE_NAME,
    },
  };
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) {
    notFound();
  }

  const posts = getPostsByCategory(slug);
  const allCategories = getAllCategories();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name} — ${SITE_NAME}`,
    description: cat.description,
    url: `${SITE_URL}/${cat.slug}/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 30).map((post, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}${getPostUrl(post)}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <main className="min-h-screen bg-light-bg pb-20">
        {/* Category Header Banner */}
        <section className="bg-gradient-to-br from-slate-950 via-[#042f2e] to-slate-900 py-14 text-white border-b border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Inicio", href: "/" },
                { label: cat.name },
              ]}
            />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-emerald-400/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
                🧔 {posts.length} Artículos Verificados
              </span>
              <a
                href={YOU_MINOX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-300 hover:underline"
              >
                Impulsado por You Minox (youminox.com) ↗
              </a>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {cat.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
              {cat.description}
            </p>

            {/* Other Categories Quick Navigation */}
            <div className="mt-8 flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}/`}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    c.slug === cat.slug
                      ? "bg-emerald-400 text-slate-950 font-extrabold"
                      : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                >
                  {c.name} ({c.count})
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10">
          <AdBanner className="mb-10" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={getPostUrl(post)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5"
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
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1.5 flex items-center gap-2 text-xs text-slate-400">
                    <span>⏱️ {post.readTime}</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">
                      ✓ Guía Verificada
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
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

          <AdBanner className="mt-12" />
        </div>
      </main>

      <Footer />
    </>
  );
}
