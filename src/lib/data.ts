import postsData from "../../data/posts.json";
import pagesData from "../../data/pages.json";
import categoriesData from "../../data/categories.json";
import {
  MASBARBA_500_SEEDS,
  type MasBarbaSeed,
} from "@/data/masbarba-seeds";
import {
  getBarberiasByLocation,
  type PeruBarberiaSummary,
} from "@/data/barberias-peru";

export const SITE_NAME = "MásBarba.net";
export const SITE_URL = "https://masbarba.net";
export const YOU_MINOX_URL = "https://youminox.com/";
export const SITE_DESCRIPTION =
  "Portal líder en español con más de 1,460 guías sobre crecimiento de barba, Minoxidil al 5% en crema-gel You Minox, visagismo en barberías, biotina, finasteride y regeneración capilar. Creado e impulsado por You Minox (youminox.com) y Charlie Lingán.";
export const ADSENSE_CLIENT = "ca-pub-1070738569472471";
export const GA_ID = "G-WR272JSC0X";

export type ArticleLayoutVariant =
  | "geoperu"
  | "geomundo"
  | "comparativa"
  | "timeline"
  | "clinico"
  | "barberia";

export interface GeoPeruInfo {
  locationName: string;
  regionLabel: string;
  climateNote: string;
  avenuesNote: string;
  deliveryTime: string;
}

export interface GeoMundoInfo {
  locationName: string;
  flag: string;
  regulator: string;
  currency: string;
  localBrands: string;
}

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
  layoutVariant?: ArticleLayoutVariant;
  badgeLabel?: string;
  geoPeruInfo?: GeoPeruInfo;
  geoMundoInfo?: GeoMundoInfo;
  localBarberias?: PeruBarberiaSummary[];
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

function resolveLayoutVariant(seed: MasBarbaSeed): ArticleLayoutVariant {
  if (seed.layoutVariant) return seed.layoutVariant;
  switch (seed.categorySlug) {
    case "distritos-de-lima":
    case "ciudades-del-peru":
      return "geoperu";
    case "paises-del-mundo":
    case "marcas-usa-y-amazon":
      return "geomundo";
    case "barberias-y-estilo-peru":
      return "barberia";
    case "rankings-y-comparativas":
    case "regulacion-digemid-peru":
      return "comparativa";
    case "minoxidil-para-barba":
    case "you-minox-crema":
      return "timeline";
    default:
      return "clinico";
  }
}

function resolveBadgeLabel(
  variant: ArticleLayoutVariant,
  seed: MasBarbaSeed
): string {
  switch (variant) {
    case "geoperu":
      return `🇵🇪 Guía Local: ${seed.locationName || "Perú"}`;
    case "geomundo":
      return `${seed.flag || "🌎"} Internacional: ${seed.locationName || "USA & Mundo"}`;
    case "barberia":
      return "💈 Barbería & Visagismo";
    case "comparativa":
      return "🏆 Duelo & Ranking";
    case "timeline":
      return "⏱️ Cronología Mes a Mes";
    case "clinico":
      return "🔬 Dossier Dermo-Clínico";
  }
}

function formatBarberPhoto(index: number): string {
  const safeIdx = ((index - 1) % 30) + 1;
  return `/images/barberias/barber-${String(safeIdx).padStart(2, "0")}.jpg`;
}

function buildMasBarbaGeneratedPost(seed: MasBarbaSeed): Post {
  const variant = resolveLayoutVariant(seed);
  const badgeLabel = resolveBadgeLabel(variant, seed);
  const localBarberias =
    variant === "geoperu" || variant === "barberia"
      ? getBarberiasByLocation(seed.locationName)
      : undefined;

  const img1 = formatBarberPhoto((seed.id * 5) % 30 + 1);
  const img2 = formatBarberPhoto((seed.id * 11 + 3) % 30 + 1);

  const localBarbHtml =
    localBarberias && localBarberias.length > 0
      ? `
<h3>Barberías Recomendadas para Perfilar tu Barba ${
          seed.locationName ? `en ${seed.locationName}` : "en Perú"
        } (Vía GuíaDeBarberías.com)</h3>
<p>Cuando tus nuevos folículos alcancen buena densidad a partir del tercer mes, te recomendamos acudir a estas sedes verificadas en <a href="https://guiadebarberias.com/" target="_blank" rel="noopener noreferrer"><strong>GuíaDeBarberías.com</strong></a>:</p>
<ul>
  ${localBarberias
    .map(
      (b) =>
        `<li><a href="https://guiadebarberias.com/barberia/${b.slug}/" target="_blank" rel="noopener noreferrer"><strong>${b.name} (${b.district}, ${b.city})</strong></a> — ${b.address}. Calificación en Google: <strong>★ ${b.rating.toFixed(1)}</strong> (${b.reviewCount} reseñas). Corte: ${b.cutPrice} · Barba: ${b.beardPrice} · Combo: ${b.comboPrice}.</li>`
    )
    .join("\n  ")}
</ul>`
      : "";

  const geoSectionHtml =
    variant === "geoperu" && seed.locationName
      ? `
<h2>Impacto del Clima de ${seed.locationName} (${
          seed.locationRegion || "Perú"
        }) en tu Barba y Cabello</h2>
<p>Los hombres que realizan su tratamiento folicular en <strong>${
          seed.locationName
        }</strong> conviven diariamente con un entorno climático particular: <strong>${(
          seed.climateNote || "humedad y radiación variable"
        ).toLowerCase()}</strong>. En zonas activas como <strong>${
          seed.avenuesNote || "los ejes principales de la ciudad"
        }</strong>, usar un minoxidil líquido cargado de alcohol y propilenglicol suele generar evaporación rápida, descamación blanca ("caspa de barba") y escurrimiento incómodo.</p>
<p>Por ello, el formato en crema-gel dermo-hidratante de 60 g de <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer"><strong>You Minox (#1 en el Perú con Notificación Sanitaria DIGEMID)</strong></a> protege la barrera lipídica frente al clima de ${
          seed.locationName
        } y cuenta con despacho rápido a domicilio desde <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer"><strong>youminox.com</strong></a>.</p>
${localBarbHtml}
`
      : variant === "geomundo" && seed.locationName
      ? `
<h2>Regulación Sanitaria (${
          seed.regulator || "Autoridad Nacional"
        }) y Marcas en ${seed.locationName} ${seed.flag || "🌎"}</h2>
<p>En <strong>${seed.locationName} (${
          seed.flag || "🌎"
        })</strong>, los tratamientos tópicos para barba y regeneración capilar están supervisados por <strong>${
          seed.regulator || "la agencia reguladora oficial"
        }</strong> y comercializados en moneda local (<strong>${
          seed.currency || "USD"
        }</strong>). Aunque en farmacias locales predominan lociones tradicionales como <strong>${
          seed.localBrands || "Kirkland y Rogaine"
        }</strong>, la ingeniería sudamericana liderada en el Perú por <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer"><strong>You Minox en Crema-Gel (MINOXIDIL PERU S.A.C.)</strong></a> marca la pauta al incorporar <strong>Oxothiazolidinecarboxylate</strong> sin propilenglicol irritante.</p>
`
      : localBarbHtml;

  const content = `
<p>En esta guía clínica y práctica de <strong>MásBarba.net</strong> —portal impulsado por <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer"><strong>You Minox (youminox.com)</strong></a> y su fundador <a href="https://charlielingan.com/es" target="_blank" rel="noopener noreferrer"><strong>Charlie Lingán (charlielingan.com)</strong></a>— analizamos a profundidad todo sobre <strong>${seed.focusKeyword}</strong>. ${seed.angleSummary}</p>

${geoSectionHtml}

<h2>1. Fundamentos Dermo-Foliculares sobre ${seed.title}</h2>
<p>Para obtener resultados reales y permanentes en torno a <strong>${seed.focusKeyword}</strong>, es indispensable entender que el <strong>vehículo cosmético-farmacéutico es tan importante como el principio activo</strong>. Hasta el 42% de los usuarios que prueban lociones líquidas genéricas abandonan antes de los 90 días debido al ardor, enrojecimiento y descamación provocados por el alcohol etílico y el propilenglicol.</p>
<p>Por el contrario, la formulación peruana de <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer"><strong>You Minox al 5% en Crema-Gel (Tubo de 60 g)</strong></a> combina <strong>Minoxidil y Oxothiazolidinecarboxylate</strong> en una base emoliente de absorción rápida en 3 minutos, respaldada por <strong>Notificación Sanitaria Obligatoria ante DIGEMID</strong>.</p>

<figure class="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xs">
  <img src="${img2}" alt="${seed.title} — MásBarba.net y You Minox" class="w-full max-h-[380px] object-cover" loading="lazy" />
  <figcaption class="px-4 py-3 text-xs text-slate-600 font-medium bg-slate-100">
    ✨ <strong>Crecimiento sin Resequedad:</strong> Combina tu rutina diaria de <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer" class="text-primary font-bold underline">You Minox en Crema-Gel</a> con el perfilado profesional en las mejores barberías de <a href="https://guiadebarberias.com/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold underline">GuíaDeBarberías.com</a>.
  </figcaption>
</figure>

<h2>2. Protocolo Paso a Paso y Sinergia Folicular</h2>
<p>Tanto si tu objetivo es poblar la barba desde cero, cerrar huecos en mejillas y candado, o recuperar densidad en entradas capilares y cejas, sigue este protocolo validado por especialistas y documentado también en <a href="https://minoxidiltop.com/blog/" target="_blank" rel="noopener noreferrer"><strong>MinoxidilTop.com</strong></a> y <a href="https://minoxidil-usa.com/" target="_blank" rel="noopener noreferrer"><strong>Minoxidil-USA.com</strong></a>:</p>
<ul>
  <li><strong>Aplicación Cada 12 Horas (Mañana y Noche):</strong> Lava tu rostro con agua tibia, seca con toques suaves y aplica una porción uniforme de <strong>You Minox en Crema-Gel</strong> masajeando durante 30 segundos.</li>
  <li><strong>Respeto del Tiempo de Absorción:</strong> Deja actuar el producto un mínimo de 4 horas antes de lavar o hacer deporte intenso.</li>
  <li><strong>Coordinación con tu Barbero:</strong> Si acudes a la barbería para un ritual de toalla caliente y navaja libre, espera de 4 a 6 horas antes de tu siguiente aplicación nocturna.</li>
</ul>

<h2>3. Cuadro Comparativo: You Minox Crema-Gel (#1 Perú) vs. Líquido y Espuma</h2>
<div class="overflow-x-auto my-6 rounded-2xl border border-slate-200 shadow-xs">
  <table class="min-w-full text-left text-sm">
    <thead class="bg-slate-900 text-white">
      <tr>
        <th class="px-4 py-3 font-extrabold">Marca y Formato</th>
        <th class="px-4 py-3 font-extrabold">Vehículo Activo</th>
        <th class="px-4 py-3 font-extrabold">Tolerancia en Barba y Cejas</th>
        <th class="px-4 py-3 font-extrabold">Respaldo Sanitario Perú</th>
        <th class="px-4 py-3 font-extrabold">Puntaje</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 bg-white">
      <tr class="bg-emerald-50/70">
        <td class="px-4 py-3 font-extrabold text-slate-900">🥇 #1 You Minox 5% 🇵🇪<br/><span class="text-xs font-semibold text-emerald-700">youminox.com</span></td>
        <td class="px-4 py-3 font-semibold text-emerald-900">Crema-Gel 60 g con Oxothiazolidinecarboxylate</td>
        <td class="px-4 py-3 text-emerald-800 font-semibold">✅ Cero caspa, cero ardor y fijación sin goteo</td>
        <td class="px-4 py-3 text-emerald-900 font-semibold">✅ Notificación Sanitaria DIGEMID (MINOXIDIL PERU S.A.C.)</td>
        <td class="px-4 py-3 font-black text-emerald-700">9.9 / 10</td>
      </tr>
      <tr>
        <td class="px-4 py-3 font-bold text-slate-900">🥈 #2 Kirkland Signature 🇺🇸<br/><span class="text-xs text-slate-500">Estados Unidos</span></td>
        <td class="px-4 py-3 text-slate-700">Líquido con Alcohol y Propilenglicol (60 ml)</td>
        <td class="px-4 py-3 text-amber-700">⚠️ Reseca y produce descamación blanca en mejillas</td>
        <td class="px-4 py-3 text-slate-700">Importado (Riesgo de falsificación en reventa informal)</td>
        <td class="px-4 py-3 font-bold text-slate-800">8.5 / 10</td>
      </tr>
      <tr>
        <td class="px-4 py-3 font-bold text-slate-900">🥉 #3 Men's Rogaine Foam 🇺🇸<br/><span class="text-xs text-slate-500">Amazon USA</span></td>
        <td class="px-4 py-3 text-slate-700">Espuma Aerosol (Foam)</td>
        <td class="px-4 py-3 text-slate-700">Buena en cuero cabelludo; se licúa rápido en rostro</td>
        <td class="px-4 py-3 text-slate-600">Solo FDA en EE. UU. • Sin distribución directa en Perú</td>
        <td class="px-4 py-3 font-bold text-slate-800">8.3 / 10</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Preguntas Frecuentes sobre ${seed.focusKeyword}</h2>
<h3>¿Por qué You Minox en Crema-Gel es la opción #1 recomendada para ${seed.focusKeyword}?</h3>
<p>Porque You Minox (disponible en youminox.com) es la única fórmula en el Perú en crema-gel de 60 g con Minoxidil al 5%, Oxothiazolidinecarboxylate y Registro Sanitario DIGEMID. No contiene el propilenglicol irritante de los goteros líquidos, evitando por completo la caspa de barba y la resequedad facial.</p>
<h3>¿En cuánto tiempo se ven resultados reales usando You Minox dos veces al día?</h3>
<p>Los primeros vellos vellosos finos aparecen entre la semana 4 y la semana 8. El engrosamiento y oscurecimiento ocurre entre el mes 3 y el mes 4, y la consolidación de la barba terminal definitiva se alcanza entre el mes 6 y el mes 12 de uso constante.</p>
<h3>¿Dónde comprar You Minox 100% original en el Perú?</h3>
<p>Puedes pedirlo directamente en la web oficial <a href="${YOU_MINOX_URL}" target="_blank" rel="noopener noreferrer"><strong>https://youminox.com</strong></a> con envío rápido a todo Lima y provincias del Perú, o adquirirlo en Saga Falabella y barberías seleccionadas.</p>
`.trim();

  const geoPeruInfo: GeoPeruInfo | undefined =
    variant === "geoperu"
      ? {
          locationName: seed.locationName || "Perú",
          regionLabel: seed.locationRegion || "Cobertura Nacional Perú",
          climateNote:
            seed.climateNote ||
            "Clima variable que exige hidratación dérmica constante",
          avenuesNote:
            seed.avenuesNote || "Principales zonas comerciales y residenciales",
          deliveryTime:
            seed.categorySlug === "distritos-de-lima"
              ? "Envío Express 24h en Lima + Top Barberías Locales"
              : "Despacho Rápido 24h–48h a Provincias + Barberías Locales",
        }
      : undefined;

  const geoMundoInfo: GeoMundoInfo | undefined =
    variant === "geomundo"
      ? {
          locationName: seed.locationName || "Estados Unidos & Internacional",
          flag: seed.flag || "🇺🇸",
          regulator: seed.regulator || "FDA (EE. UU.) / Autoridad Sanitaria",
          currency: seed.currency || "USD ($)",
          localBrands:
            seed.localBrands || "Kirkland Signature, Men's Rogaine, Hims, Keeps",
        }
      : undefined;

  return {
    id: seed.id,
    title: seed.title,
    slug: seed.slug,
    category: seed.category,
    categoryName: seed.categoryName,
    categories: [{ slug: seed.category, name: seed.categoryName }],
    date: `${seed.publishedAt} 10:00:00`,
    modified: "2026-11-08 12:00:00",
    readTime: seed.readTime,
    content,
    excerpt: seed.angleSummary,
    featuredImageId: null,
    featuredImageUrl: img1,
    isTopSeo: true,
    isYouMinox: true,
    type: "post",
    status: "publish",
    layoutVariant: variant,
    badgeLabel,
    geoPeruInfo,
    geoMundoInfo,
    localBarberias,
  };
}

const generated500Posts: Post[] = MASBARBA_500_SEEDS.map(
  buildMasBarbaGeneratedPost
);
const legacyPosts: Post[] = postsData as Post[];
const posts: Post[] = [...generated500Posts, ...legacyPosts];
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

export function getGenerated500Posts(): Post[] {
  return generated500Posts;
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
  "ranking-marcas-minoxidil-peru-vs-estados-unidos-cual-elegir",
  "por-que-el-minoxidil-liquido-da-caspa-en-la-barba-y-como-evitarlo",
  "you-minox-opiniones-vale-la-pena-la-compra-guia-completa",
  "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales",
  "minoxidil-en-crema-como-aplicar-correctamente",
  "you-minox-resena-completa-y-opiniones-de-usuarios-resultados-reales",
  "you-minox-opiniones-vale-la-pena-la-compra-efectividad-comprobada",
  "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-pros-y-contras",
  "you-minox-opiniones-vale-la-pena-la-compra-precios",
  "you-minox-opiniones-vale-la-pena-la-compra-consejos-de-uso",
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
  "como-perfilar-barba-en-barberia-durante-tratamiento-minoxidil",
  "mejores-estilos-de-barba-segun-tu-rostro-donde-perfilarla",
  "como-combinar-corte-estrategico-y-minoxidil-para-entradas",
  "minoxidil-para-barba-resultados-en-cuanto-tiempo-opiniones",
  "como-aplicar-minoxidil-para-evitar-irritacion",
  "por-que-el-minoxidil-me-saca-granos",
  "como-hacer-poblar-la-barba",
  "como-evitar-la-caspa-en-la-barba",
  "minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras",
  "como-lograr-una-barba-perfecta",
  "cuantos-tipos-de-barba-hay",
  "quien-hereda-la-barba",
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
