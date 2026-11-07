import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import AdBanner from "@/components/AdBanner";
import YouMinoxSpotlight from "@/components/YouMinoxSpotlight";
import {
  getAllPosts,
  getPostBySlug,
  getCategoryBySlug,
  getRelatedPosts,
  getContextualRelatedPosts,
  getYouMinoxFeaturedPosts,
  getBeardAndCareGuides,
  getTopSeoPosts,
  getPostUrl,
  getImageUrl,
  generateExcerpt,
  SITE_NAME,
  SITE_URL,
  YOU_MINOX_URL,
} from "@/lib/data";

type Params = Promise<{ category: string; slug: string }>;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    category: post.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: `Artículo no encontrado | ${SITE_NAME}` };
  }

  const description = post.excerpt || generateExcerpt(post.content, 158);
  const absoluteImageUrl = `${SITE_URL}${getImageUrl(post.featuredImageUrl)}`;
  const canonicalUrl = `${SITE_URL}/${post.category}/${post.slug}/`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "es_PE",
      siteName: SITE_NAME,
      authors: ["Charlie Lingán — You Minox"],
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

interface TocItem {
  id: string;
  text: string;
}

function addHeadingIdsAndExtractToc(html: string): {
  enhancedHtml: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  let index = 0;

  const enhancedHtml = html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (fullMatch, attrs, inner) => {
      const plainText = inner
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (!plainText) return fullMatch;
      index += 1;
      const id = `seccion-${index}`;
      toc.push({ id, text: plainText });
      if (/id=/i.test(attrs)) {
        return fullMatch;
      }
      return `<h2 id="${id}"${attrs}>${inner}</h2>`;
    }
  );

  return { enhancedHtml, toc };
}

function splitContentAtThirdH2(htmlContent: string): [string, string | null] {
  const h2Matches = [...htmlContent.matchAll(/<h2[^>]*>/gi)];
  if (h2Matches.length < 3) {
    return [htmlContent, null];
  }
  const splitIndex = h2Matches[2].index;
  if (splitIndex === undefined || splitIndex <= 0) {
    return [htmlContent, null];
  }
  return [htmlContent.slice(0, splitIndex), htmlContent.slice(splitIndex)];
}

function extractFaqPairs(
  htmlContent: string
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const regex =
    /<h[23][^>]*>\s*(?:<[^>]+>)*\s*(¿[^<]+\?)\s*(?:<\/[^>]+>)*\s*<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(htmlContent)) !== null && faqs.length < 6) {
    const question = match[1]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const answer = match[2]
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (question.length > 10 && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { category: categorySlug, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    const validCat = getCategoryBySlug(categorySlug);
    if (validCat) {
      permanentRedirect(`/${categorySlug}/`);
    }
    notFound();
  }

  if (categorySlug !== post.category) {
    permanentRedirect(`/${post.category}/${post.slug}/`);
  }

  const category = getCategoryBySlug(post.category);
  const relatedPosts = getRelatedPosts(post, 4);
  const contextualPosts = getContextualRelatedPosts(post, 3);
  const youMinoxGuides = getYouMinoxFeaturedPosts(5).filter(
    (p) => p.id !== post.id
  );
  const beardGuides = getBeardAndCareGuides(5).filter((p) => p.id !== post.id);
  const topSeoPosts = getTopSeoPosts(8).filter((p) => p.id !== post.id);

  const { enhancedHtml, toc } = addHeadingIdsAndExtractToc(post.content);
  const [firstHalfContent, secondHalfContent] =
    splitContentAtThirdH2(enhancedHtml);
  const faqPairs = extractFaqPairs(post.content);

  const breadcrumbItems = [
    { label: "Inicio", href: "/" },
    { label: category?.name || post.categoryName, href: `/${post.category}/` },
    { label: post.title },
  ];

  const absoluteImageUrl = `${SITE_URL}${getImageUrl(post.featuredImageUrl)}`;
  const canonicalUrl = `${SITE_URL}/${post.category}/${post.slug}/`;
  const freshIsoDate = new Date().toISOString().split("T")[0];

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || generateExcerpt(post.content, 160),
    image: absoluteImageUrl,
    datePublished: post.date.split(" ")[0] || freshIsoDate,
    dateModified: freshIsoDate,
    inLanguage: "es",
    author: {
      "@type": "Person",
      name: "Charlie Lingán",
      url: `${SITE_URL}/hola-hablamos/`,
    },
    publisher: {
      "@type": "Organization",
      name: `${SITE_NAME} — Powered by You Minox`,
      url: SITE_URL,
      sameAs: [YOU_MINOX_URL],
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const faqSchema =
    faqPairs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqPairs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* Dinamica.pe Article Page Layout adapted for MasBarba.net & You Minox */}
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:gap-12">
            {/* Main Article Column */}
            <article className="min-w-0 flex-1 lg:max-w-3xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <Link
                  href={`/${post.category}/`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-primary"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                  </svg>
                  Volver a {category?.name || post.categoryName}
                </Link>
              </div>

              <Breadcrumbs items={breadcrumbItems} />

              {/* Category Pill & Verification Meta (Dinamica.pe style) */}
              <div className="mt-4 mb-5 flex flex-wrap items-center gap-3">
                <Link
                  href={`/${post.category}/`}
                  className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary hover:bg-primary hover:text-white transition"
                >
                  {category?.name || post.categoryName}
                </Link>
                <span className="text-sm font-medium text-gray-400">
                  ⏱️ {post.readTime} de lectura
                </span>
                <span className="text-sm text-gray-300">·</span>
                <a
                  href={YOU_MINOX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition"
                >
                  ✓ Verificado por You Minox (youminox.com)
                </a>
              </div>

              {/* H1 Title */}
              <h1 className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
                {post.title}
              </h1>

              {/* Featured Image — Dinamica.pe rounded-2xl shadow-md */}
              {post.featuredImageUrl && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 shadow-md">
                  <img
                    src={getImageUrl(post.featuredImageUrl)}
                    alt={post.title}
                    className="w-full max-h-[430px] object-cover"
                  />
                </div>
              )}

              {/* Above-the-fold AdSense Banner */}
              <AdBanner className="my-8" />

              {/* Automatic Table of Contents (TOC) */}
              {toc.length >= 2 && (
                <nav
                  aria-label="Tabla de contenidos"
                  className="my-8 rounded-2xl border border-slate-200 bg-light-bg/80 p-6"
                >
                  <p className="text-sm font-extrabold uppercase tracking-wider text-primary-dark mb-3 flex items-center gap-2">
                    <span>🧔</span> Contenido de esta guía clínica
                  </p>
                  <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {toc.map((item, idx) => (
                      <li key={item.id} className="truncate">
                        <a
                          href={`#${item.id}`}
                          className="text-slate-700 hover:text-primary font-medium transition-colors"
                        >
                          <span className="font-bold text-primary mr-1.5">
                            {idx + 1}.
                          </span>
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Content Part 1 */}
              <div
                className="article-content mt-8 max-w-none"
                dangerouslySetInnerHTML={{ __html: firstHalfContent }}
              />

              {/* Mid-Article Contextual Internal Links + You Minox Spotlight + AdSense */}
              {secondHalfContent && (
                <>
                  {contextualPosts.length > 0 && (
                    <aside className="my-10 rounded-2xl border-l-4 border-primary bg-emerald-50/70 p-6 shadow-xs">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-primary-dark mb-3">
                        📚 También te puede interesar en{" "}
                        {category?.name || post.categoryName}
                      </p>
                      <ul className="space-y-2.5">
                        {contextualPosts.map((cp) => (
                          <li key={cp.id}>
                            <Link
                              href={getPostUrl(cp)}
                              className="text-sm sm:text-base font-bold text-slate-900 hover:text-primary transition-colors flex items-start gap-2"
                            >
                              <span className="text-primary font-extrabold">
                                →
                              </span>
                              <span>{cp.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  )}

                  {/* In-Article You Minox Protagonist Card */}
                  <YouMinoxSpotlight variant="article" />

                  <AdBanner className="my-8" />

                  <div
                    className="article-content max-w-none"
                    dangerouslySetInnerHTML={{ __html: secondHalfContent }}
                  />
                </>
              )}

              {!secondHalfContent && <YouMinoxSpotlight variant="article" />}

              {/* You Minox Comparison Hub */}
              <section className="my-12 rounded-2xl border border-slate-200 bg-light-bg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                      ⭐ Especial You Minox (youminox.com)
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Comparativas y Guías de Minoxidil al 5% en Crema-Gel
                    </h2>
                  </div>
                  <a
                    href={YOU_MINOX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-extrabold text-primary hover:underline"
                  >
                    Visitar YouMinox.com ↗
                  </a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {youMinoxGuides.slice(0, 4).map((guide) => (
                    <Link
                      key={guide.id}
                      href={getPostUrl(guide)}
                      className="group flex gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-primary hover:shadow-md"
                    >
                      <img
                        src={getImageUrl(guide.featuredImageUrl)}
                        alt={guide.title}
                        className="h-16 w-20 shrink-0 rounded-lg object-cover bg-slate-100"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                          {guide.title}
                        </h3>
                        <span className="mt-1 inline-block text-[11px] font-bold text-primary">
                          Leer análisis →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* End-of-Article AdSense Banner */}
              <AdBanner className="my-10" />

              {/* CTA Banner inside article — Dinamica.pe style adapted for You Minox & MasBarba.net */}
              <div className="mt-14 rounded-2xl bg-gradient-to-br from-primary-dark to-primary p-8 sm:p-10 text-center text-white shadow-lg">
                <span className="inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-100 mb-3">
                  ✨ Creado e Impulsado por You Minox (youminox.com)
                </span>
                <h3 className="text-2xl font-extrabold">
                  ¿Listo para lograr una barba más densa y recuperar tu cabello
                  sin irritación?
                </h3>
                <p className="mt-2 text-emerald-50 max-w-xl mx-auto text-sm sm:text-base">
                  Descubre por qué más de 600,000 seguidores eligen{" "}
                  <strong>You Minox en Crema-Gel al 5%</strong> para estimular
                  los folículos de la barba y el cuero cabelludo sin la
                  resequedad ni caspa del alcohol líquido.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                  <a
                    href={YOU_MINOX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-extrabold text-gray-900 transition hover:brightness-105 shadow-md"
                  >
                    Ir a la Tienda Oficial: YouMinox.com ↗
                  </a>
                  <Link
                    href="/#diagnosticador-barba"
                    className="inline-block rounded-xl bg-slate-950/80 border border-white/25 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-950"
                  >
                    Hacer Test Interactivo de Barba
                  </Link>
                </div>
              </div>

              {/* Author Box (E-E-A-T — Charlie Lingán & You Minox) */}
              <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50/70 p-6 flex flex-col sm:flex-row items-center gap-5">
                <img
                  src="/images/brand/charlie-lingan.webp"
                  alt="Charlie Lingán — Fundador de You Minox y MásBarba.net"
                  className="h-20 w-20 rounded-2xl object-cover shrink-0 border-2 border-primary shadow-xs"
                  loading="lazy"
                />
                <div className="text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Link
                      href="/hola-hablamos/"
                      className="text-base font-extrabold text-gray-900 hover:text-primary"
                    >
                      Charlie Lingán
                    </Link>
                    <a
                      href="https://charlielingan.com/es"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-primary hover:underline"
                    >
                      (charlielingan.com ↗)
                    </a>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-primary-dark">
                      Fundador de You Minox & MásBarba.net
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Creador y fundador de{" "}
                    <a
                      href={YOU_MINOX_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-primary hover:underline"
                    >
                      You Minox (youminox.com)
                    </a>
                    , la marca líder de Minoxidil en crema-gel con más de
                    600,000 seguidores en redes sociales. Conoce su historia y casos de estudio como fundador en{" "}
                    <a
                      href="https://charlielingan.com/es/emprendedor/como-cree-you-minox-minoxidil-en-crema-numero-1-del-peru"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-gray-900 underline hover:text-primary"
                    >
                      CharlieLingán.com ↗
                    </a>
                    .
                  </p>
                </div>
              </div>

              {/* Bottom Related Posts Grid */}
              {relatedPosts.length > 0 && (
                <section className="mt-14 pt-10 border-t border-gray-200">
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                    Más guías sobre {category?.name || post.categoryName}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedPosts.map((rp) => (
                      <Link
                        key={rp.id}
                        href={getPostUrl(rp)}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg hover:border-primary/40"
                      >
                        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(rp.featuredImageUrl)}
                            alt={rp.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-primary uppercase">
                              {rp.categoryName}
                            </span>
                            <h3 className="mt-1 text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                              {rp.title}
                            </h3>
                          </div>
                          <span className="mt-3 inline-block text-xs font-bold text-primary">
                            Leer guía completa →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Sticky Sidebar — Exact Dinamica.pe style + You Minox Protagonist */}
            <aside className="mt-12 lg:mt-0 lg:w-80 lg:flex-shrink-0">
              <div className="sticky top-28 space-y-8">
                {/* Official You Minox Sidebar Card */}
                <YouMinoxSpotlight variant="sidebar" />

                {/* Related Articles Box (Exact Dinamica.pe style) */}
                {relatedPosts.length > 0 && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6">
                    <h3 className="mb-4 text-base font-bold text-gray-900">
                      Artículos Relacionados
                    </h3>
                    <div className="space-y-4">
                      {relatedPosts.map((p) => (
                        <Link
                          key={p.id}
                          href={getPostUrl(p)}
                          className="group flex gap-3 rounded-xl p-2 transition hover:bg-white"
                        >
                          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                            <img
                              src={getImageUrl(p.featuredImageUrl)}
                              alt={p.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="line-clamp-2 text-xs font-bold text-gray-900 transition-colors group-hover:text-primary">
                              {p.title}
                            </h4>
                            <span className="mt-1 block text-[11px] text-gray-400">
                              ⏱️ {p.readTime}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Featured Guides Box (Exact Dinamica.pe style) */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-4 text-base font-bold text-gray-900">
                    Guías Destacadas
                  </h3>
                  <div className="space-y-3">
                    {topSeoPosts.slice(0, 5).map((tp) => (
                      <Link
                        key={tp.id}
                        href={getPostUrl(tp)}
                        className="block border-b border-gray-100 pb-3 last:border-b-0 last:pb-0 group"
                      >
                        <p className="text-xs font-semibold text-primary mb-0.5">
                          {tp.categoryName}
                        </p>
                        <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                          {tp.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Beard Care & Tips Box */}
                <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6">
                  <h3 className="mb-4 text-base font-bold text-gray-900">
                    🧔 Consejos de Barba Más Leídos
                  </h3>
                  <ul className="space-y-3">
                    {beardGuides.slice(0, 4).map((bg) => (
                      <li
                        key={bg.id}
                        className="border-b border-gray-200/70 pb-2.5 last:border-0 last:pb-0"
                      >
                        <Link
                          href={getPostUrl(bg)}
                          className="text-xs font-bold text-gray-800 hover:text-primary transition-colors line-clamp-2"
                        >
                          → {bg.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sidebar Sticky AdSense Unit */}
                <AdBanner format="vertical" className="min-h-[250px]" />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
