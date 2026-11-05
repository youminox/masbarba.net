import postsData from "../../data/posts.json";
import pagesData from "../../data/pages.json";
import categoriesData from "../../data/categories.json";

export const SITE_NAME = "MásBarba.net";
export const SITE_URL = "https://masbarba.net";
export const YOU_MINOX_URL = "https://youminox.com/";
export const SITE_DESCRIPTION =
  "Portal líder en español sobre crecimiento de barba, Minoxidil al 5% en crema-gel You Minox, biotina, finasteride y regeneración capilar contra la alopecia. Creado e impulsado por You Minox (youminox.com) y Charlie Lingán.";
export const ADSENSE_CLIENT = "ca-pub-1070738569472471";
export const GA_ID = "G-WR272JSC0X";

export interface PostCategory {
  slug: string;
  name: string;
}

export interface InlineRelatedLink {
  url: string;
  title: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  categoryName: string;
  categories: PostCategory[];
  date: string;
  modified: string;
  readTime: string;
  content: string;
  excerpt: string;
  featuredImageId: number | null;
  featuredImageUrl: string;
  inlineRelated?: InlineRelatedLink[];
  isTopSeo?: boolean;
  isYouMinox?: boolean;
  type: string;
  status: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  shortName?: string;
  parent: string;
  description: string;
  count: number;
}

const posts: Post[] = postsData as Post[];
const pages: Post[] = pagesData as Post[];
const categories: Category[] = categoriesData as Category[];

const postBySlugMap = new Map<string, Post>();
for (const p of posts) {
  postBySlugMap.set(p.slug, p);
}

const categoryBySlugMap = new Map<string, Category>();
for (const c of categories) {
  categoryBySlugMap.set(c.slug, c);
}

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return postBySlugMap.get(slug);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlugMap.get(slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter(
    (p) =>
      p.category === categorySlug ||
      p.categories.some((c) => c.slug === categorySlug)
  );
}

const PRIORITY_YOU_MINOX_SLUGS = [
  "you-minox-opiniones-vale-la-pena-la-compra-guia-completa",
  "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales",
  "minoxidil-en-crema-como-aplicar-correctamente",
  "you-minox-resena-completa-y-opiniones-de-usuarios-resultados-reales",
  "you-minox-opiniones-vale-la-pena-la-compra-efectividad-comprobada",
  "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-pros-y-contras",
  "you-minox-opiniones-vale-la-pena-la-compra-precios",
  "you-minox-opiniones-vale-la-pena-la-compra-consejos-de-uso",
  "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-guia-completa",
  "you-minox-opiniones-vale-la-pena-la-compra-beneficios",
];

export function getYouMinoxFeaturedPosts(limit = 6): Post[] {
  const result: Post[] = [];
  for (const slug of PRIORITY_YOU_MINOX_SLUGS) {
    const found = postBySlugMap.get(slug);
    if (found) {
      result.push(found);
    }
    if (result.length >= limit) break;
  }
  if (result.length < limit) {
    for (const p of posts) {
      if (p.isYouMinox && !result.some((r) => r.id === p.id)) {
        result.push(p);
        if (result.length >= limit) break;
      }
    }
  }
  return result;
}

const PRIORITY_BEARD_GUIDES_SLUGS = [
  "minoxidil-para-barba-resultados-en-cuanto-tiempo-opiniones",
  "como-aplicar-minoxidil-para-evitar-irritacion",
  "por-que-el-minoxidil-me-saca-granos",
  "como-hacer-poblar-la-barba",
  "como-evitar-la-caspa-en-la-barba",
  "minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras",
  "como-lograr-una-barba-perfecta",
  "cuantos-tipos-de-barba-hay",
  "quien-hereda-la-barba",
  "guia-para-peinar-tu-barba-todos-los-dias",
  "productos-naturales-para-el-cuidado-de-la-barba",
  "como-estimular-el-crecimiento-de-la-barba-con-biotina",
];

export function getBeardAndCareGuides(limit = 6): Post[] {
  const result: Post[] = [];
  for (const slug of PRIORITY_BEARD_GUIDES_SLUGS) {
    const found = postBySlugMap.get(slug);
    if (found) {
      result.push(found);
    }
    if (result.length >= limit) break;
  }
  return result;
}

const PRIORITY_ALOPECIA_AND_BIOTINA_SLUGS = [
  "la-alopecia-en-hombres-tiene-cura-definitiva",
  "avances-cientificos-para-tratar-la-alopecia-en-la-barba",
  "errores-comunes-al-tratar-la-caida-del-cabello",
  "cuanta-biotina-tomar-segun-expertos",
  "finasteride-vs-minoxidil-para-alopecia",
  "finasteride-sirve-para-la-barba",
  "que-pasa-si-tomo-minoxidil-y-finasteride-juntos",
  "alopecia-en-mujeres-causas-y-soluciones-efectivas",
  "minoxidil-natural-existe-una-alternativa-guia-completa",
];

export function getAlopeciaAndBiotinaGuides(limit = 6): Post[] {
  const result: Post[] = [];
  for (const slug of PRIORITY_ALOPECIA_AND_BIOTINA_SLUGS) {
    const found = postBySlugMap.get(slug);
    if (found) {
      result.push(found);
    }
    if (result.length >= limit) break;
  }
  return result;
}

export function getTopSeoPosts(limit = 12): Post[] {
  const topPosts = posts.filter((p) => p.isTopSeo);
  return topPosts.slice(0, limit);
}

export function getRelatedPosts(currentPost: Post, limit = 4): Post[] {
  const sameCategory = posts.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );
  const topInCat = sameCategory.filter((p) => p.isTopSeo);
  const regularInCat = sameCategory.filter((p) => !p.isTopSeo);
  const combined = [...topInCat, ...regularInCat];
  if (combined.length >= limit) {
    const result: Post[] = [];
    if (topInCat.length > 0) {
      result.push(topInCat[currentPost.id % topInCat.length]);
    }
    const startIdx = currentPost.id % Math.max(1, regularInCat.length);
    for (let i = 0; i < regularInCat.length && result.length < limit; i++) {
      const candidate = regularInCat[(startIdx + i) % regularInCat.length];
      if (!result.some((r) => r.id === candidate.id)) {
        result.push(candidate);
      }
    }
    return result.slice(0, limit);
  }
  return combined.slice(0, limit);
}

export function getContextualRelatedPosts(currentPost: Post, limit = 3): Post[] {
  const result: Post[] = [];

  if (currentPost.inlineRelated && currentPost.inlineRelated.length > 0) {
    for (const item of currentPost.inlineRelated) {
      const parts = item.url.replace(/^\/|\/$/g, "").split("/");
      const targetSlug = parts[parts.length - 1];
      const targetPost = postBySlugMap.get(targetSlug);
      if (
        targetPost &&
        targetPost.id !== currentPost.id &&
        !result.some((r) => r.id === targetPost.id)
      ) {
        result.push(targetPost);
      }
      if (result.length >= limit) return result;
    }
  }

  const sameCat = posts.filter(
    (p) => p.id !== currentPost.id && p.category === currentPost.category
  );
  if (sameCat.length > 0) {
    const offset = (currentPost.id * 7) % sameCat.length;
    for (let i = 0; i < sameCat.length && result.length < limit; i++) {
      const candidate = sameCat[(offset + i) % sameCat.length];
      if (!result.some((r) => r.id === candidate.id)) {
        result.push(candidate);
      }
    }
  }

  return result;
}

export function getPageBySlug(slug: string): Post | undefined {
  return pages.find((p) => p.slug === slug);
}

export function getPostUrl(post: Post): string {
  return `/${post.category}/${post.slug}/`;
}

export function getImageUrl(url: string): string {
  if (!url) {
    return "/images/brand/you-minox.webp";
  }
  if (url.startsWith("/images/")) {
    return url;
  }
  const filename = url.split("/").pop()?.split("?")[0] || "";
  return filename ? `/images/${filename}` : "/images/brand/you-minox.webp";
}

export function generateExcerpt(html: string, maxLength = 158): string {
  if (!html) return SITE_DESCRIPTION;
  const plain = html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= maxLength) return plain;
  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]+$/, "") + "...";
}
