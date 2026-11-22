import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-key",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SITE = "https://masbarba.net";
const YOUMINOX_URL = "https://youminox.com/";
const GUIADEBARBERIAS_URL = "https://guiadebarberias.com/";
const ALLOWED_MODELS = ["gpt-4o-mini", "gpt-4o"];

export interface ArticleRow {
  slug: string;
  title: string;
  category: string;
  category_name: string;
  excerpt: string | null;
  featured_image: string | null;
  read_time: string | null;
  search_text: string | null;
  is_power_page: boolean;
}

export interface ArticleCard {
  slug: string;
  title: string;
  category: string;
  categoryName: string;
  url: string;
  image: string;
  readTime: string;
  excerpt: string;
}

function calculateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  if (model.includes("mini")) {
    return Number((promptTokens * 0.00000015 + completionTokens * 0.0000006).toFixed(6));
  }
  return Number((promptTokens * 0.0000025 + completionTokens * 0.00001).toFixed(6));
}

const norm = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOPWORDS = new Set([
  "como", "cual", "cuales", "que", "quien", "quienes", "donde", "cuando", "por",
  "para", "con", "sin", "una", "uno", "unos", "unas", "los", "las", "del", "al",
  "hola", "buenas", "buenos", "dias", "tardes", "noches", "quiero", "puedo",
  "saber", "dime", "favor", "recomienda", "recomendame", "mejor", "mejores",
  "sobre", "este", "esta", "estos", "estas", "mas", "muy", "hay", "tiene",
  "tienen", "son", "fue", "eran", "todo", "todos", "toda", "todas", "guia", "pagina"
]);

const SYNONYMS: Record<string, string[]> = {
  huecos: ["poblar", "parches", "mejillas", "barba"],
  parches: ["huecos", "poblar", "barba"],
  caspa: ["descamacion", "resequedad", "irritacion", "crema"],
  picazon: ["irritacion", "resequedad", "granos", "crema"],
  granos: ["acne", "irritacion", "foliculitis", "crema"],
  rodillo: ["dermaroller", "microagujas", "microneedling"],
  dermaroller: ["rodillo", "microagujas", "combinacion"],
  entradas: ["alopecia", "frente", "cabello", "norwood"],
  coronilla: ["alopecia", "cabello", "caida"],
  calvicie: ["alopecia", "caida", "androgenetica", "finasteride"],
  caida: ["alopecia", "shedding", "cabello"],
  vitaminas: ["biotina", "zinc", "suplementos"],
  crema: ["you-minox", "gel", "liquido"],
  gel: ["you-minox", "crema"],
  kirkland: ["you-minox", "comparativa", "liquido"],
  rogaine: ["you-minox", "espuma", "comparativa"],
  barberia: ["perfilar", "corte", "barbero", "estilo"],
};

function stemWord(w: string): string {
  if (w.length > 5 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("s")) return w.slice(0, -1);
  return w;
}

function extractTokens(text: string): string[] {
  const raw = norm(text)
    .split(" ")
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
  const expanded: string[] = [];
  for (const w of raw) {
    expanded.push(w);
    if (SYNONYMS[w]) {
      for (const syn of SYNONYMS[w]) expanded.push(syn);
    }
  }
  return Array.from(new Set(expanded));
}

let catalogCache: { at: number; rows: ArticleRow[]; bySlug: Map<string, ArticleRow> } | null = null;

async function loadCatalog(): Promise<{ rows: ArticleRow[]; bySlug: Map<string, ArticleRow> }> {
  if (catalogCache && Date.now() - catalogCache.at < 10 * 60 * 1000 && catalogCache.rows.length > 0) {
    return catalogCache;
  }
  const pages = await Promise.all([
    supabase
      .from("masbarba_articles")
      .select("slug, title, category, category_name, excerpt, featured_image, read_time, search_text, is_power_page")
      .eq("active", true)
      .range(0, 999),
    supabase
      .from("masbarba_articles")
      .select("slug, title, category, category_name, excerpt, featured_image, read_time, search_text, is_power_page")
      .eq("active", true)
      .range(1000, 1999),
    supabase
      .from("masbarba_articles")
      .select("slug, title, category, category_name, excerpt, featured_image, read_time, search_text, is_power_page")
      .eq("active", true)
      .range(2000, 2999),
  ]);

  const rows: ArticleRow[] = [];
  const bySlug = new Map<string, ArticleRow>();
  for (const p of pages) {
    if (Array.isArray(p.data)) {
      for (const r of p.data as ArticleRow[]) {
        if (!bySlug.has(r.slug)) {
          bySlug.set(r.slug, r);
          rows.push(r);
        }
      }
    }
  }
  catalogCache = { at: Date.now(), rows, bySlug };
  return catalogCache;
}

function toArticleCard(r: ArticleRow): ArticleCard {
  const img = r.featured_image || "/images/Como-hacer-poblar-la-barba.jpg";
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    categoryName: r.category_name,
    url: `${SITE}/${r.category}/${r.slug}/`,
    image: img.startsWith("http") ? img : `${SITE}${img}`,
    readTime: r.read_time || "7 min",
    excerpt: (r.excerpt || "").slice(0, 145),
  };
}

function searchArticles(rows: ArticleRow[], userMessage: string, historyText: string, limit = 16): ArticleRow[] {
  const primaryTokens = extractTokens(userMessage);
  const contextTokens = extractTokens(historyText).filter((t) => !primaryTokens.includes(t));
  const fullPhrase = norm(userMessage);

  if (primaryTokens.length === 0 && contextTokens.length === 0) {
    const starterSlugs = [
      "you-minox-opiniones-vale-la-pena-la-compra-guia-completa",
      "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales",
      "minoxidil-en-crema-como-aplicar-correctamente",
      "como-hacer-poblar-la-barba",
      "por-que-el-minoxidil-me-saca-granos",
      "minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras",
      "cuanta-biotina-tomar-segun-expertos",
      "finasteride-vs-minoxidil-para-alopecia",
    ];
    const picked: ArticleRow[] = [];
    for (const s of starterSlugs) {
      const f = rows.find((r) => r.slug === s);
      if (f) picked.push(f);
    }
    return picked.length > 0 ? picked : rows.slice(0, 8);
  }

  const scored: Array<{ r: ArticleRow; score: number }> = [];

  for (const r of rows) {
    const titleNorm = norm(r.title);
    const catNorm = norm(`${r.category_name} ${r.category}`);
    const bodyNorm = r.search_text || `${titleNorm} ${catNorm} ${norm(r.excerpt || "")}`;

    let score = r.is_power_page ? 5 : 0;

    if (fullPhrase.length >= 5 && titleNorm.includes(fullPhrase)) {
      score += 45;
    }

    let matchedPrimary = 0;
    for (const tok of primaryTokens) {
      const stem = stemWord(tok);
      if (titleNorm.includes(tok) || (stem.length >= 4 && titleNorm.includes(stem))) {
        score += 16;
        matchedPrimary++;
      } else if (catNorm.includes(tok) || (stem.length >= 4 && catNorm.includes(stem))) {
        score += 9;
        matchedPrimary++;
      } else if (bodyNorm.includes(tok) || (stem.length >= 4 && bodyNorm.includes(stem))) {
        score += 5;
        matchedPrimary++;
      }
    }

    if (matchedPrimary >= 2) {
      score += matchedPrimary * 8;
    }

    for (const cTok of contextTokens.slice(-5)) {
      const stem = stemWord(cTok);
      if (titleNorm.includes(cTok) || (stem.length >= 4 && titleNorm.includes(stem))) {
        score += 3;
      }
    }

    if (score > (r.is_power_page ? 5 : 0)) {
      scored.push({ r, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  if (scored.length === 0) {
    return rows.filter((r) => r.is_power_page).slice(0, limit);
  }
  return scored.slice(0, limit).map((s) => s.r);
}

const CLINICAL_KNOWLEDGE_BASE = `
BASE DE CONOCIMIENTO CLÍNICO Y FOLICULAR OFICIAL DE MÁSBARBA.NET & YOU MINOX:
1. SOBRE MÁSBARBA.NET, YOU MINOX Y CHARLIE LINGÁN:
   - MásBarba.net (${SITE}) es el portal enciclopédico en español con 2,463 guías clínicas y prácticas sobre crecimiento de barba, Minoxidil al 5%, regeneración capilar, alopecia, biotina, finasteride y visagismo masculino, organizado en 6 categorías oficiales:
     * Minoxidil para Barba y Cabello (1,161 guías): ${SITE}/minoxidil/
     * Alopecia y Regeneración Capilar (440 guías): ${SITE}/alopecia/
     * Biotina y Vitaminas Capilares (318 guías): ${SITE}/biotina/
     * Estilos y Genética de Barba (245 guías): ${SITE}/estilo/
     * Cuidado Diario y Consejos de Barba (227 guías): ${SITE}/consejos/
     * Finasteride y Bloqueadores DHT (72 guías): ${SITE}/finasteride/
     * Sobre Charlie Lingán / Contacto: ${SITE}/hola-hablamos/
   - Fundado e impulsado por **Charlie Lingán** (https://charlielingan.com/es) y **You Minox** (${YOUMINOX_URL}), la marca #1 de Minoxidil al 5% en Crema-Gel en el Perú (respaldada por más de 600,000 seguidores en TikTok e Instagram y Notificación Sanitaria Obligatoria DIGEMID — MINOXIDIL PERU S.A.C.).

2. ¿POR QUÉ YOU MINOX EN CREMA-GEL (60 g) ES SUPERIOR AL MINOXIDIL LÍQUIDO TRADICIONAL?:
   - Las lociones líquidas tradicionales (como Kirkland o genéricos) utilizan altos niveles de alcohol etílico y propilenglicol, lo que causa en más del 45% de los usuarios descamación blanca ("caspa de barba"), ardor, enrojecimiento, picazón, piel tirante y brotes de granos.
   - **You Minox 5% en Crema-Gel (Tubo de 60 g)** combina Minoxidil al 5% con **Oxothiazolidinecarboxylate** en un vehículo dermo-hidratante libre de propilenglicol irritante: se absorbe en 3 minutos, no gotea, hidrata la barrera cutánea y es ideal para rostro (barba y cejas) y cuero cabelludo (entradas y coronilla).
   - ¿Dónde comprar You Minox original en Perú?: En la tienda oficial [YouMinox.com](${YOUMINOX_URL}) con envío rápido a todo Lima y provincias, o en Saga Falabella.

3. PROTOCOLO CLÍNICO Y TIEMPOS DE RESULTADOS:
   - **Frecuencia**: Aplicar cada 12 horas (mañana y noche) sobre la piel limpia y 100% seca, masajeando suavemente durante 30 segundos.
   - **Tiempos de espera clave**:
     * Lavarse la cara, ducharse o sudar intensamente: esperar mínimo **4 horas** tras la aplicación.
     * Dormir / contacto con la almohada: aplicar **45 a 60 minutos** antes de acostarse.
     * Aplicar crema hidratante, bloqueador solar o aceite de barba (romero/ricino): esperar **20 a 30 minutos** después del Minoxidil.
     * Uso de **Dermaroller 0.5 mm** o **Derma Stamp de Titanio**: pasarlo 1 a 2 veces por semana y esperar **24 horas** antes de la siguiente aplicación de Minoxidil.
     * Visita a la barbería (toalla caliente y navaja): esperar **4 a 6 horas** antes de aplicar Minoxidil. Para encontrar barberías verificadas en el Perú, recomendamos [GuíaDeBarberías.com](${GUIADEBARBERIAS_URL}).
   - **Cronograma de crecimiento de barba**:
     * Semanas 4 a 8: aparición de los primeros vellos vellosos finos.
     * Meses 3 a 4: engrosamiento, pigmentación y cierre de huecos en mejillas y candado.
     * Meses 6 a 12: maduración a vello terminal grueso y permanente. (Fase de shedding temporal entre semanas 2 y 6 es normal y positiva).
   - **Sinergia ("Tríada de la Barba y Cabello")**:
     1. Estímulo tópico cada 12h con Minoxidil 5% (You Minox Crema-Gel).
     2. Microneedling semanal con Dermaroller 0.5 mm o Derma Stamp ajustable.
     3. Nutrición interna con **Biotina (5,000 a 10,000 mcg diarios) + Zinc + Saw Palmetto**.
     4. En alopecia androgenética capilar (entradas/coronilla): la hormona DHT miniaturiza el folículo en el cuero cabelludo (pero en la barba la DHT favorece el grosor); por eso el Finasteride se usa bajo supervisión médica para el cuero cabelludo junto con champú de Ketoconazol 1%.

4. PRODUCTOS COMPLEMENTARIOS Y AFILIADOS DE AMAZON:
   - En cada página de MásBarba.net los lectores también encuentran tarjetas de productos seleccionados en **Amazon.com (código masbarba-20)** y **Amazon.es (código masbarba-21)**: Dermaroller de Titanio 0.5 mm, Derma Stamp Ajustable, Biotina 10,000 mcg + Saw Palmetto, Champú con Ketoconazol 1%, Recortadora Philips MultiGroom, Kit de Cepillo de Cerdas de Jabalí y Aceite de Romero y Ricino Jamaicano.
`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || (req.method === "GET" ? "config" : "chat");

    // Bulk article sync helper
    if (mode === "sync_articles" && req.headers.get("x-sync-key") === "masbarba-sync-2026") {
      const items = Array.isArray(body.articles) ? body.articles : [];
      if (items.length > 0) {
        const { error } = await supabase
          .from("masbarba_articles")
          .upsert(items, { onConflict: "slug" });
        if (error) return json({ error: error.message }, 500);
        catalogCache = null;
      }
      return json({ success: true, count: items.length });
    }

    // 1. Load live config
    const { data: configRow } = await supabase
      .from("masbarba_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = configRow || {
      is_enabled: true,
      ai_model: "gpt-4o-mini",
      temperature: 0.4,
      max_messages_per_session: 25,
      daily_budget_usd: 5.0,
      welcome_message:
        "¡Hola! 👋 Soy tu Asesor Clínico y Folicular IA de MásBarba.net (impulsado por You Minox). Pregúntame sobre crecimiento de barba, Minoxidil 5% en Crema-Gel sin caspa ni irritación, rutina con Dermaroller 0.5mm, dosis de Biotina, Finasteride, Alopecia o qué productos elegir.",
      custom_instructions: "",
    };

    const activeModel = ALLOWED_MODELS.includes(config.ai_model) ? config.ai_model : "gpt-4o-mini";

    if (mode === "config" || req.method === "GET") {
      return json({
        is_enabled: config.is_enabled,
        welcome_message: config.welcome_message,
        ai_model: activeModel,
        max_messages_per_session: config.max_messages_per_session,
      });
    }

    // 2. Track click on an article link, YouMinox link, or Amazon card
    if (mode === "track_click") {
      const { session_id, visitor_id, article_slug, article_title, category, target_url, page_url } = body;
      if (target_url) {
        await supabase.from("masbarba_chat_clicks").insert({
          session_id: session_id || null,
          visitor_id: String(visitor_id || "anon").slice(0, 80),
          article_slug: article_slug ? String(article_slug).slice(0, 180) : null,
          article_title: article_title ? String(article_title).slice(0, 240) : null,
          category: category ? String(category).slice(0, 80) : null,
          target_url: String(target_url).slice(0, 500),
          page_url: page_url ? String(page_url).slice(0, 500) : null,
        });

        if (session_id) {
          const { data: sess } = await supabase
            .from("masbarba_chat_sessions")
            .select("clicks_count, clicked_urls")
            .eq("id", session_id)
            .maybeSingle();
          if (sess) {
            const urls = Array.isArray(sess.clicked_urls) ? [...sess.clicked_urls] : [];
            if (!urls.includes(target_url)) urls.push(target_url);
            await supabase
              .from("masbarba_chat_sessions")
              .update({
                clicks_count: (sess.clicks_count || 0) + 1,
                clicked_urls: urls,
              })
              .eq("id", session_id);
          }
        }
      }
      return json({ success: true });
    }

    // 3. Chat Completion Mode
    if (!config.is_enabled) {
      return json({
        reply: `En este momento el Asesor Folicular IA está en mantenimiento breve. Puedes explorar nuestras +2,463 guías en [MásBarba.net](${SITE}/) o conocer la fórmula en Crema-Gel sin irritación en [YouMinox.com](${YOUMINOX_URL}).`,
        recommended_articles: [],
        suggested_options: ["Ver guías de Minoxidil", "Visitar YouMinox.com"],
        disabled: true,
      });
    }

    const userMessage = String(body.message || "").trim().slice(0, 1000);
    if (!userMessage) {
      return json({ error: "Mensaje vacío" }, 400);
    }

    const visitorId = String(body.visitor_id || "mb-" + crypto.randomUUID().slice(0, 8)).slice(0, 80);
    const pageUrl = String(body.page_url || SITE + "/").slice(0, 500);
    const userAgent = String(body.user_agent || req.headers.get("user-agent") || "").slice(0, 300);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    // Check daily budget
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { data: todaySessions } = await supabase
      .from("masbarba_chat_sessions")
      .select("estimated_cost_usd")
      .gte("last_message_at", startOfDay.toISOString());

    const spentToday = (todaySessions || []).reduce(
      (acc: number, r: any) => acc + Number(r.estimated_cost_usd || 0),
      0
    );

    if (spentToday >= Number(config.daily_budget_usd || 5)) {
      return json({
        reply: `Has alcanzado el límite de consultas automáticas del día. Puedes usar el buscador instantáneo en la portada de [MásBarba.net](${SITE}/) o visitar [YouMinox.com](${YOUMINOX_URL}).`,
        recommended_articles: [],
        suggested_options: [],
      });
    }

    // Load or create session
    let existingSession: any = null;
    if (sessionId) {
      const { data: s } = await supabase
        .from("masbarba_chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      existingSession = s;
    }

    if (
      existingSession &&
      existingSession.messages_count >= (config.max_messages_per_session || 25) * 2
    ) {
      return json({
        session_id: existingSession.id,
        reply: `Hemos llegado al máximo de mensajes por sesión. Puedes abrir cualquiera de las guías clínicas recomendadas o iniciar una nueva consulta en [MásBarba.net](${SITE}/).`,
        recommended_articles: [],
        suggested_options: [],
      });
    }

    if (!existingSession) {
      const { data: created, error: createErr } = await supabase
        .from("masbarba_chat_sessions")
        .insert({
          visitor_id: visitorId,
          page_url: pageUrl,
          user_agent: userAgent,
          first_user_message: userMessage.slice(0, 250),
          last_user_message: userMessage.slice(0, 250),
          messages_count: 1,
          model_used: activeModel,
        })
        .select("*")
        .single();

      if (!createErr && created) {
        existingSession = created;
        sessionId = created.id;
      }
    }

    if (sessionId) {
      await supabase.from("masbarba_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    // Search matching articles in our 2,463-article catalog
    const catalog = await loadCatalog();
    const recentHistoryText = history
      .slice(-3)
      .map((h: any) => h?.content || "")
      .join(" ");
    const candidateRows = searchArticles(catalog.rows, userMessage, recentHistoryText, 16);

    const candidatesPrompt =
      candidateRows.length > 0
        ? candidateRows
            .map(
              (r) =>
                `- SLUG: "${r.slug}" | TÍTULO: "${r.title}" | CATEGORÍA: ${r.category_name} | URL: ${SITE}/${r.category}/${r.slug}/ | RESUMEN: ${(r.excerpt || "").slice(0, 155)}`
            )
            .join("\n")
        : "No se encontraron artículos exactos con esos términos en el índice.";

    const systemPrompt = `Eres el Asesor Clínico Dermo-Folicular IA Oficial de MásBarba.net (${SITE}), la enciclopedia líder en español con 2,463 guías sobre crecimiento de barba, Minoxidil al 5% en Crema-Gel You Minox (${YOUMINOX_URL}), alopecia, biotina, finasteride, dermaroller y cuidado masculino, fundada por Charlie Lingán (https://charlielingan.com/es).

Tu misión es responder TODAS las inquietudes de potenciales clientes y lectores con rigor clínico, cercanía y orientación práctica:
- Consultas sobre PRODUCTOS Y COMPRA: diferencias entre You Minox 5% en Crema-Gel (60 g, con Oxothiazolidinecarboxylate y Registro Sanitario DIGEMID en Perú, sin caspa ni picazón) frente a minoxidil líquido (Kirkland) o espuma (Rogaine); dónde comprar You Minox original (${YOUMINOX_URL}) o qué complementos elegir en las tarjetas de Amazon de la página (Dermaroller 0.5mm, Derma Stamp ajustable, Biotina 10,000 mcg, Champú Ketoconazol 1%, Recortadora Philips, Cepillo de cerdas de jabalí, Aceite de romero y ricino).
- Consultas sobre RUTINA, BARBA Y CABELLO: cómo poblar la barba desde cero o cerrar huecos en mejillas y candado, tiempos de espera (4h antes de lavar/sudar, 60 min antes de dormir, 24h tras Dermaroller 0.5mm), fase de shedding, cómo evitar granos o resequedad, dosis diaria de Biotina, uso de Finasteride para entradas/coronilla y cuándo perfilar la barba en barbería.

REGLAS OBLIGATORIAS DE ORIENTACIÓN:
1. CUANDO SÍ TENEMOS ARTÍCULOS EN EL LISTADO DE ABAJO QUE RESPONDEN O COMPLEMENTAN LA CONSULTA:
   - Responde la duda con claridad y guíalo a entre 1 y 3 artículos del listado usando enlaces Markdown exactos: [Título del Artículo](${SITE}/categoria/slug/).
   - Incluye esos slugs exactos (máximo 3) en el arreglo "recommended_slugs" para que el chat muestre las tarjetas visuales interactivas.
2. CUANDO EL USUARIO PREGUNTA POR UN CASO ESPECÍFICO, PRODUCTO O DUDA QUE NO TIENE UN ARTÍCULO EXACTO EN EL LISTADO:
   - ¡NUNCA dejes al usuario sin respuesta! Respóndele con un protocolo clínico claro y práctico basado en nuestra Base de Conocimiento y recomiéndale las guías más cercanas del listado o [YouMinox.com](${YOUMINOX_URL}) cuando busque el mejor Minoxidil sin irritación.
3. NUNCA inventes URLs ni slugs que no aparezcan en el listado de ARTÍCULOS ENCONTRADOS o en las CATEGORÍAS OFICIALES.
4. Contexto actual del visitante: está navegando en la página ${pageUrl}.
${config.custom_instructions ? "5. INSTRUCCIÓN ADICIONAL DEL ADMINISTRADOR: " + config.custom_instructions : ""}

${CLINICAL_KNOWLEDGE_BASE}

ARTÍCULOS ENCONTRADOS EN MÁSBARBA.NET PARA ESTA CONSULTA (USA SOLO ESTOS SLUGS Y URLS EXACTAS):
${candidatesPrompt}

FORMATO DE RESPUESTA (JSON ESTRICTO):
Responde ÚNICAMENTE con un objeto JSON válido con estas 3 llaves exactas:
{
  "reply": "Tu respuesta experta, empática y bien estructurada en español (máximo 3 párrafos cortos o viñetas claras, con enlaces Markdown [Título](${SITE}/categoria/slug/) o [YouMinox.com](${YOUMINOX_URL}))",
  "recommended_slugs": ["slug-exacto-1", "slug-exacto-2"],
  "suggested_options": [
    "Pregunta corta u opción 1 para seguir conversando",
    "Pregunta corta u opción 2 para seguir conversando",
    "Pregunta corta u opción 3 para seguir conversando"
  ]
}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
        chatMessages.push({ role: h.role, content: h.content.slice(0, 1200) });
      }
    }
    chatMessages.push({ role: "user", content: userMessage });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages: chatMessages,
        temperature: Number(config.temperature) || 0.4,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      throw new Error("OpenAI status " + openaiRes.status);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent,
        recommended_slugs: candidateRows.slice(0, 2).map((r) => r.slug),
        suggested_options: [
          "¿Por qué elegir You Minox en Crema-Gel?",
          "¿Cómo usar Minoxidil con Dermaroller?",
          "¿Cuánta Biotina tomar al día?",
        ],
      };
    }

    const slugs: string[] = Array.isArray(parsed.recommended_slugs)
      ? parsed.recommended_slugs.slice(0, 3)
      : [];
    const recommendedArticles: ArticleCard[] = slugs
      .map((s) => catalog.bySlug.get(s))
      .filter((r): r is ArticleRow => Boolean(r))
      .map(toArticleCard);

    const suggestedOptions: string[] = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options.slice(0, 3).map((s: unknown) => String(s).slice(0, 72))
      : [];

    const replyText: string =
      parsed.reply ||
      `Te recomiendo explorar nuestras guías clínicas en [MásBarba.net](${SITE}/) y conocer You Minox en Crema-Gel en [YouMinox.com](${YOUMINOX_URL}).`;

    const promptTokens = openaiData.usage?.prompt_tokens || 0;
    const completionTokens = openaiData.usage?.completion_tokens || 0;
    const totalTokens = openaiData.usage?.total_tokens || promptTokens + completionTokens;
    const costUsd = calculateCostUsd(activeModel, promptTokens, completionTokens);

    // Save assistant message & update session metrics
    if (sessionId && existingSession) {
      await supabase.from("masbarba_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: replyText,
        recommended_articles: recommendedArticles,
        suggested_options: suggestedOptions,
        model: activeModel,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const prevRecs: string[] = Array.isArray(existingSession.recommended_articles)
        ? existingSession.recommended_articles
        : [];
      for (const ra of recommendedArticles) {
        if (!prevRecs.includes(ra.title)) prevRecs.push(ra.title);
      }

      await supabase
        .from("masbarba_chat_sessions")
        .update({
          last_user_message: userMessage.slice(0, 250),
          messages_count: (existingSession.messages_count || 1) + 2,
          recommended_articles: prevRecs.slice(0, 30),
          prompt_tokens: (existingSession.prompt_tokens || 0) + promptTokens,
          completion_tokens: (existingSession.completion_tokens || 0) + completionTokens,
          total_tokens: (existingSession.total_tokens || 0) + totalTokens,
          estimated_cost_usd: Number(
            (Number(existingSession.estimated_cost_usd || 0) + costUsd).toFixed(6)
          ),
          model_used: activeModel,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    // Record in global token_usage table
    await supabase.from("token_usage").insert({
      source: "masbarba.net",
      content_type: "ai_chat",
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
      slug: sessionId || visitorId,
    });

    return json({
      session_id: sessionId,
      reply: replyText,
      recommended_articles: recommendedArticles,
      suggested_options: suggestedOptions,
      model: activeModel,
    });
  } catch (err: any) {
    console.error("masbarba-chat error:", err);
    return json(
      {
        error: err.message || "Error interno",
        reply: `Tuvimos un inconveniente momentáneo al procesar tu consulta. Puedes explorar nuestras +2,463 guías en [MásBarba.net](${SITE}/) o visitar [YouMinox.com](${YOUMINOX_URL}).`,
        recommended_articles: [],
        suggested_options: ["Intentar de nuevo"],
      },
      500
    );
  }
});
