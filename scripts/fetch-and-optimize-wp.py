import json
import os
import re
import html
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

CATEGORY_DESCRIPTIONS = {
    "minoxidil": "Guías clínicas y prácticas sobre Minoxidil al 5% para barba y cabello: comparativas de Minoxidil en Crema You Minox vs. formato líquido o espuma, tiempos de resultados mes a mes, aplicación correcta y prevención de efectos secundarios.",
    "alopecia": "Enciclopedia médica y práctica sobre alopecia androgenética, alopecia areata en la barba, entradas, coronilla, efluvio telógeno y tratamientos regenerativos capilares para hombres y mujeres.",
    "biotina": "Todo sobre la Biotina (Vitamina B7) para acelerar el crecimiento de la barba y fortalecer el cabello: dosis diaria recomendada en mcg, mejores suplementos, alimentos ricos en biotina y sinergia con Minoxidil You Minox.",
    "finasteride": "Análisis dermatológico del Finasteride oral y tópico para frenar la hormona DHT en la alopecia androgenética: resultados reales, combinación con Minoxidil al 5%, dosis y precauciones.",
    "estilo": "Diseño, perfilado y genética de la barba: qué estilo de barba favorece según tu tipo de rostro, cómo poblar zonas con huecos o parches, tiempos de crecimiento y tendencias masculinas.",
    "consejos": "Rutinas diarias de cuidado de la barba y piel facial: cómo hidratar el vello facial, evitar granos, caspa o resequedad, elegir cepillos, aceites naturales, bálsamos y técnicas de afeitado.",
}

CATEGORY_NAMES_CLEAN = {
    "minoxidil": "Minoxidil para Barba y Cabello",
    "alopecia": "Alopecia y Regeneración Capilar",
    "biotina": "Biotina y Vitaminas Capilares",
    "finasteride": "Finasteride y Bloqueadores DHT",
    "estilo": "Estilos y Genética de Barba",
    "consejos": "Cuidado Diario y Consejos de Barba",
}

TOP_SEO_SLUGS = {
    "you-minox-opiniones-vale-la-pena-la-compra-guia-completa",
    "you-minox-opiniones-vale-la-pena-la-compra-efectividad-comprobada",
    "you-minox-opiniones-vale-la-pena-la-compra-precios",
    "you-minox-opiniones-vale-la-pena-la-compra-resena",
    "you-minox-resena-completa-y-opiniones-de-usuarios-resultados-reales",
    "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-resultados-reales",
    "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-guia-completa",
    "minoxidil-kirkland-vs-minoxidil-you-minox-comparativa-pros-y-contras",
    "minoxidil-en-crema-como-aplicar-correctamente",
    "minoxidil-para-barba-resultados-en-cuanto-tiempo-opiniones",
    "minoxidil-para-la-barba-efectos-secundarios-y-precauciones",
    "como-aplicar-minoxidil-para-evitar-irritacion",
    "minoxidil-y-dermaroller-combinacion-efectiva-pros-y-contras",
    "como-hacer-poblar-la-barba",
    "cuantos-tipos-de-barba-hay",
    "quien-hereda-la-barba",
    "como-lograr-una-barba-perfecta",
    "por-que-el-minoxidil-me-saca-granos",
    "como-evitar-la-caspa-en-la-barba",
    "guia-para-peinar-tu-barba-todos-los-dias",
    "productos-naturales-para-el-cuidado-de-la-barba",
    "errores-comunes-al-tratar-la-caida-del-cabello",
    "la-alopecia-en-hombres-tiene-cura-definitiva",
    "avances-cientificos-para-tratar-la-alopecia-en-la-barba",
    "cuanta-biotina-tomar-segun-expertos",
    "como-estimular-el-crecimiento-de-la-barba-con-biotina",
    "finasteride-vs-minoxidil-para-alopecia",
    "finasteride-sirve-para-la-barba",
    "que-pasa-si-tomo-minoxidil-y-finasteride-juntos",
}

SPECIFIC_TITLE_OVERRIDES = {
    "la-foliculos-pilosos-tiene-cura-definitiva": "¿El Daño en los Folículos Pilosos Tiene Cura Definitiva? Regeneración y Soluciones",
    "sintomas-comunes-de-la-foliculos-pilosos": "Síntomas de Folículos Pilosos Debilitados: Guía Completa para Identificarlos y Tratarlos",
    "terapias-innovadoras-contra-la-champu-anticaida": "Terapias Capilares Innovadoras y Uso Efectivo del Champú Anticaída",
    "sintomas-comunes-de-la-champu-anticaida": "Señales y Efectos al Usar Champú Anticaída: Lo que Debes Saber para un Cabello Saludable",
    "se-puede-revertir-la-champu-anticaida": "¿Qué Ocurre al Dejar el Champú Anticaída? Todo lo que Necesitas Saber",
    "que-hacer-si-sufres-de-remedios-caseros": "¿Qué Hacer si un Remedio Casero Capilar Irrita tu Cuero Cabelludo? Soluciones Seguras",
    "como-saber-si-tienes-remedios-caseros": "Cómo Saber si tus Remedios Caseros para el Cabello Son Realmente Efectivos",
    "como-tratar-la-remedios-caseros-de-forma-natural": "Cómo Preparar y Aplicar Remedios Caseros Capilares de Forma Natural y Segura",
    "factores-geneticos-que-causan-la-remedios-caseros": "Factores Genéticos en la Caída del Cabello y Qué Remedios Naturales Ayudan Realmente",
    "rutinas-de-cuidado-para-prevenir-la-remedios-caseros": "Las Mejores Rutinas de Cuidado Capilar con Ingredientes Naturales en Casa",
    "como-tratar-la-suplementos-para-el-cabello-de-forma-natural": "Cómo Elegir y Tomar Suplementos Naturales para el Cabello: Guía Completa",
    "errores-comunes-al-tratar-la-suplementos-para-el-cabello": "10 Errores Comunes al Tomar Suplementos para el Cabello que Debes Evitar",
    "como-saber-si-tienes-suplementos-para-el-cabello": "Cómo Saber Qué Suplementos para el Cabello y la Barba Necesitas Realmente",
    "errores-comunes-al-tratar-la-tratamientos-capilares": "Errores Comunes al Realizar Tratamientos Capilares: Guía Completa para Evitarlos",
    "se-puede-revertir-la-tratamientos-capilares": "¿Se Pueden Revertir los Efectos de un Mal Tratamiento Capilar? Soluciones y Cuidados",
    "sintomas-comunes-de-la-tratamientos-capilares": "10 Señales de que Necesitas un Tratamiento Capilar Urgente",
    "como-saber-si-tienes-implantes-capilares": "Cómo Identificar un Implante Capilar Bien Realizado: Guía Completa",
    "como-tratar-la-implantes-capilares-de-forma-natural": "Cómo Cuidar un Implante Capilar de Forma Natural en Casa: Guía Postoperatoria",
    "errores-comunes-al-tratar-la-implantes-capilares": "10 Errores Comunes en el Cuidado de los Implantes Capilares y Cómo Evitarlos",
}


def fetch_json(url: str):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode("utf-8"))


def clean_evergreen_title(raw_title: str, slug: str = "") -> str:
    if slug and slug in SPECIFIC_TITLE_OVERRIDES:
        return SPECIFIC_TITLE_OVERRIDES[slug]
    if not raw_title:
        return ""
    t = html.unescape(raw_title).strip()

    # 1. Strip trailing AI explanations
    t = re.sub(
        r"\s*Este\s+t[ií]tulo\s+est[áa]\s+optimizado\s+para\s+SEO.*$",
        "",
        t,
        flags=re.I,
    )

    # 2. Strip leading AI prompt prefixes like 'Título SEO sugerido: «', 'Título SEO: "'
    t = re.sub(
        r"^(?:¡?claro[,!]?\s*)?(?:aqu[ií]\s+tienes\s+[^:\"]+?:\s*)?(?:t[ií]tulo\s+seo(?:\s+sugerido|\s+optimizado)?\s*:\s*)?",
        "",
        t,
        flags=re.I,
    )
    t = re.sub(r"^.*?(?:t[ií]tulo\s+seo[^:]*:\s*)", "", t, flags=re.I)

    # 3. Clean "Guía Completa SEO" -> "Guía Completa"
    t = re.sub(r"\bGu[ií]a\s+Completa\s+SEO\b", "Guía Completa", t, flags=re.I)

    # 4. Strip surrounding quotes or stray guillemets « »
    t = t.strip("`\"'“”‘’«» ")
    for ch in ('"', "“", "”", "`", "«", "»"):
        t = t.replace(ch, "")

    # 5. Replace all outdated year references (2020-2025) with Evergreen phrasing
    t = re.sub(r"Gu[ií]a\s+Completa\s+202[0-5]\b", "Guía Completa y Actualizada", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+de\s+Compra\s+202[0-5]\b", "Guía de Compra Actualizada", t, flags=re.I)
    t = re.sub(r"Rese[ñn]a\s+Completa\s+202[0-5]\b", "Reseña Completa y Actualizada", t, flags=re.I)
    t = re.sub(r"Rese[ñn]as\s+Completas\s+202[0-5]\b", "Reseñas Completas y Resultados", t, flags=re.I)
    t = re.sub(r"-\s*Gu[ií]a\s+202[0-5]\b", "— Guía Completa", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+202[0-5]\b", "Guía Completa", t, flags=re.I)
    t = re.sub(r"\s+en\s+202[0-5]\?", " Hoy en Día?", t, flags=re.I)
    t = re.sub(r"\s+en\s+202[0-5]\b", "", t, flags=re.I)
    t = re.sub(r"\s+del?\s+202[0-5]\b", "", t, flags=re.I)
    t = re.sub(r"\s+202[0-5]\b", "", t)
    t = re.sub(r"\b202[0-5]\b", "", t)

    # 6. Fix minor template typos like "Tus Guía Completa" -> "Guía Completa"
    t = re.sub(r"^Tus\s+Gu[ií]a\s+Completa", "Guía Completa", t, flags=re.I)

    t = re.sub(r"\s{2,}", " ", t).strip(" -–—:;,")
    return t


def make_text_evergreen(text_segment: str) -> str:
    s = text_segment
    s = re.sub(r"Gu[ií]a\s+Completa\s+202[0-5]\b", "Guía Completa", s, flags=re.I)
    s = re.sub(r"Gu[ií]a\s+de\s+Compra\s+202[0-5]\b", "Guía de Compra", s, flags=re.I)
    s = re.sub(r"Gu[ií]a\s+202[0-5]\b", "Guía Completa", s, flags=re.I)
    s = re.sub(r"\bEn\s+el\s+a[ñn]o\s+202[0-5]\s*,?", "En la actualidad,", s)
    s = re.sub(r"\ben\s+el\s+a[ñn]o\s+202[0-5]\b", "en la actualidad", s, flags=re.I)
    s = re.sub(r"\bEn\s+202[0-5]\s*,", "En la actualidad,", s)
    s = re.sub(r"\ben\s+202[0-5]\s*\?", "hoy en día?", s, flags=re.I)
    s = re.sub(r"\ben\s+202[0-5]\b", "en la actualidad", s, flags=re.I)
    s = re.sub(r"\bpara\s+202[0-5]\b", "para la actualidad", s, flags=re.I)
    s = re.sub(r"\bdel\s+202[0-5]\b", "actual", s, flags=re.I)
    s = re.sub(r"\bde\s+202[0-5]\b", "actual", s, flags=re.I)
    s = re.sub(r"\b202[0-5]\b", "", s)
    s = re.sub(r"\s{2,}", " ", s)
    s = re.sub(r"\s+([,.;:?!])", r"\1", s)
    return s


def apply_evergreen_outside_tags(html_str: str) -> str:
    parts = re.split(r"(<[^>]+>)", html_str)
    for i in range(0, len(parts), 2):
        if parts[i]:
            parts[i] = make_text_evergreen(parts[i])
    return "".join(parts)


def extract_aib_related_links(raw_html: str):
    """Extract internal links from rendered .global-div-post-related-aib or [aib_post_related] shortcodes."""
    links = []
    seen_urls = set()

    # Pattern 1: rendered <div class='global-div-post-related-aib'><a href='...'>...<span class='post-title-aib'>...</span></a></div>
    for m in re.finditer(
        r"<div\s+class=['\"]global-div-post-related-aib['\"][^>]*>\s*<a\s+href=['\"]([^'\"]+)['\"][^>]*>[\s\S]*?<span\s+class=['\"]post-title-aib['\"][^>]*>([\s\S]*?)</span>\s*</div>\s*</a>\s*</div>",
        raw_html,
        flags=re.I,
    ):
        u = m.group(1).strip()
        t = clean_evergreen_title(re.sub(r"<[^>]+>", "", m.group(2)))
        u = re.sub(r"^https?://(?:www\.)?masbarba\.net", "", u, flags=re.I)
        if not u.startswith("/"):
            u = "/" + u
        if not u.endswith("/"):
            u = u + "/"
        if u not in seen_urls and t:
            seen_urls.add(u)
            links.append({"url": u, "title": t})

    # Pattern 2: unrendered [aib_post_related url='...' title='...']
    for m in re.finditer(r"\[aib_post_related([^\]]*)\]", raw_html, flags=re.I):
        attrs = m.group(1)
        url_m = re.search(r"url=['\"]([^'\"]+)['\"]", attrs)
        title_m = re.search(r"title=['\"]([^'\"]+)['\"]", attrs)
        if url_m and title_m:
            u = url_m.group(1).strip()
            t = clean_evergreen_title(title_m.group(1))
            if not u.startswith("/"):
                u = "/" + u
            if not u.endswith("/"):
                u = u + "/"
            if u not in seen_urls and t:
                seen_urls.add(u)
                links.append({"url": u, "title": t})

    return links


YOU_MINOX_COMPARISON_HTML = """
<h2>Por qué You Minox (Minoxidil al 5% en Crema-Gel) supera al Minoxidil líquido tradicional</h2>
<p>Una de las mayores innovaciones en el cuidado capilar y el crecimiento de la barba es la fórmula especializada de <a href="https://youminox.com/" target="_blank" rel="noopener noreferrer"><strong>You Minox (youminox.com)</strong></a>. A diferencia de las lociones líquidas tradicionales (que utilizan altas concentraciones de alcohol y propilenglicol que resecan la piel, generan descamación tipo caspa y provocan enrojecimiento), <strong>You Minox</strong> ha desarrollado una base en <strong>crema-gel de rápida absorción</strong> que nutre la piel mientras estimula directamente el folículo piloso con Minoxidil al 5%.</p>
<table>
  <thead>
    <tr>
      <th>Característica Clínica</th>
      <th>You Minox (Crema / Gel 5%)</th>
      <th>Minoxidil Líquido Tradicional</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Vehículo de absorción</strong></td>
      <td>Base dermo-hidratante en crema-gel sin goteo</td>
      <td>Alcohol + Propilenglicol de alta volatilidad</td>
    </tr>
    <tr>
      <td><strong>Cuidado de la piel facial y barba</strong></td>
      <td>No reseca, evita la descamación y cuida los poros</td>
      <td>Suele causar sequedad, picazón y descamación blanca</td>
    </tr>
    <tr>
      <td><strong>Precisión al aplicar en zonas con huecos</strong></td>
      <td>Dosificación exacta en mejillas, bigote, candado y entradas</td>
      <td>Se escurre fácilmente fuera de la zona deseada</td>
    </tr>
    <tr>
      <td><strong>Comunidad y respaldo real</strong></td>
      <td>Más de 600,000 seguidores en redes (@You_minox)</td>
      <td>Genérico sin acompañamiento personalizado</td>
    </tr>
  </tbody>
</table>
<p>Puedes conocer toda la línea oficial, testimonios reales de antes y después y adquirir tu tratamiento directamente en la web oficial de <a href="https://youminox.com/" target="_blank" rel="noopener noreferrer"><strong>YouMinox.com</strong></a>.</p>
"""


def clean_content(slug: str, raw_html: str) -> str:
    if not raw_html:
        return ""

    h = raw_html

    # 1. Remove WordPress block comments
    h = re.sub(r"<!--\s*/?wp:[^>]*-->", "", h)

    # 2. Remove broken <div id='video-container'> blocks
    h = re.sub(
        r"<div\s+id=['\"]video-container['\"][\s\S]*?</noscript>\s*</div>",
        "",
        h,
        flags=re.I,
    )
    h = re.sub(
        r"<div\s+id=['\"]video-container['\"][\s\S]*?</div>\s*</div>",
        "",
        h,
        flags=re.I,
    )

    # 3. Remove rendered .global-div-post-related-aib blocks (we render them cleanly as Next.js components)
    h = re.sub(
        r"<div\s+class=['\"]global-div-post-related-aib['\"][^>]*>[\s\S]*?</a>\s*</div>",
        "",
        h,
        flags=re.I,
    )

    # 4. Remove unrendered shortcodes
    h = re.sub(r"\[aib_post_related[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[insertar[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[caption[^\]]*\](.*?)\[/caption\]", r"\1", h, flags=re.S | re.I)
    h = re.sub(r"\[gallery[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[embed\](.*?)\[/embed\]", r"\1", h, flags=re.S | re.I)

    # 5. Convert leftover **bold** markdown to <strong>
    h = re.sub(r"\*\*([^*<>]+)\*\*", r"<strong>\1</strong>", h)

    # 6. Strip wrapper <article> tags inside post body if present
    h = re.sub(r"</?article[^>]*>", "", h, flags=re.I)

    # 6b. Remove WordPress srcset and sizes attributes from <img> tags to avoid 3x duplicate thumbnail sizes
    h = re.sub(r"\s+srcset=['\"][^'\"]*['\"]", "", h, flags=re.I)
    h = re.sub(r"\s+sizes=['\"][^'\"]*['\"]", "", h, flags=re.I)

    # 7. Normalize internal masbarba.net URLs to relative paths with trailing slash
    h = re.sub(
        r"https?://(?:www\.)?masbarba\.net/([a-z0-9-_]+/[a-z0-9-_]+)/?(?=['\"\s>])",
        r"/\1/",
        h,
        flags=re.I,
    )

    # 8. Apply Evergreen transformation outside HTML tags
    h = apply_evergreen_outside_tags(h)

    # 9. Enrich You Minox & key Minoxidil/Beard comparison posts with authoritative YouMinox.com block
    is_you_minox_focus = (
        "you-minox" in slug
        or "minoxidil-en-crema" in slug
        or "irritacion" in slug
        or "granos" in slug
        or "caspa-en-la-barba" in slug
        or slug in TOP_SEO_SLUGS
    )
    if is_you_minox_focus and "youminox.com" not in h.lower():
        h = h.strip() + "\n" + YOU_MINOX_COMPARISON_HTML.strip()

    # 10. Clean empty paragraphs and excessive line breaks
    h = re.sub(r"<p>\s*(?:&nbsp;|\s|<br\s*/?>)*\s*</p>", "", h, flags=re.I)
    h = re.sub(r"(\s*<br\s*/?>\s*){2,}", "<br />", h, flags=re.I)
    h = re.sub(r"\n{3,}", "\n\n", h)

    return h.strip()


def generate_clean_excerpt(content_html: str, max_length: int = 158) -> str:
    if not content_html:
        return ""
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", content_html, flags=re.I | re.S)
    text_source = " ".join(paragraphs[:3]) if paragraphs else content_html
    text = re.sub(r"<[^>]*>", " ", text_source)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_length:
        return text
    truncated = text[:max_length]
    last_space = truncated.rfind(" ")
    if last_space > max_length * 0.6:
        truncated = truncated[:last_space]
    return truncated.rstrip(".,;: ") + "..."


def calculate_read_time(content_html: str) -> str:
    text = re.sub(r"<[^>]*>", " ", content_html)
    words = len(text.split())
    minutes = max(4, round(words / 200))
    return f"{minutes} min"


def main():
    print("🚀 Fetching categories from https://masbarba.net/wp-json/wp/v2/categories...")
    raw_cats = fetch_json("https://masbarba.net/wp-json/wp/v2/categories?per_page=100")

    categories = []
    cat_by_id = {}
    cat_by_slug = {}

    # Order categories by strategic relevance for MasBarba.net & You Minox
    preferred_order = ["minoxidil", "alopecia", "biotina", "finasteride", "estilo", "consejos"]
    raw_cats_filtered = [c for c in raw_cats if c.get("count", 0) > 0 and c.get("slug") != "blog"]
    raw_cats_filtered.sort(
        key=lambda c: preferred_order.index(c["slug"]) if c["slug"] in preferred_order else 99
    )

    for c in raw_cats_filtered:
        cid = int(c["id"])
        slug = c["slug"].strip()
        raw_name = html.unescape(c["name"]).strip()
        clean_name = CATEGORY_NAMES_CLEAN.get(slug, raw_name)
        desc = CATEGORY_DESCRIPTIONS.get(slug) or html.unescape(c.get("description", "")).strip()
        cat_obj = {
            "id": cid,
            "slug": slug,
            "name": clean_name,
            "shortName": raw_name,
            "parent": "",
            "description": desc,
            "count": 0,
        }
        categories.append(cat_obj)
        cat_by_id[cid] = cat_obj
        cat_by_slug[slug] = cat_obj

    print(f"✅ Loaded {len(categories)} active categories:", [c["slug"] for c in categories])

    print("🖼️ Fetching all media items (with retry)...")
    def fetch_media_page(page_num):
        for attempt in range(4):
            try:
                return fetch_json(
                    f"https://masbarba.net/wp-json/wp/v2/media?per_page=100&page={page_num}&_fields=id,source_url"
                )
            except Exception as e:
                if "400" in str(e):
                    return []
        return []

    attachments = {}
    with ThreadPoolExecutor(max_workers=4) as pool:
        for batch in pool.map(fetch_media_page, range(1, 12)):
            for m in batch:
                if "id" in m and "source_url" in m:
                    attachments[int(m["id"])] = m["source_url"].strip()

    print(f"✅ Loaded {len(attachments)} media attachments.")

    print("📄 Fetching all published posts (with retry)...")
    def fetch_post_page(page_num):
        for attempt in range(4):
            try:
                return fetch_json(
                    f"https://masbarba.net/wp-json/wp/v2/posts?per_page=100&page={page_num}"
                )
            except Exception as e:
                if "400" in str(e):
                    return []
        return []

    raw_posts = []
    with ThreadPoolExecutor(max_workers=4) as pool:
        for batch in pool.map(fetch_post_page, range(1, 11)):
            raw_posts.extend(batch)

    print(f"✅ Fetched {len(raw_posts)} raw posts from WordPress API.")

    posts = []
    all_image_urls = set()

    for rp in raw_posts:
        pid = int(rp["id"])
        slug = rp["slug"].strip()
        raw_title = rp.get("title", {}).get("rendered", "")
        clean_title = clean_evergreen_title(raw_title, slug)
        raw_content = rp.get("content", {}).get("rendered", "")

        inline_related = extract_aib_related_links(raw_content)
        cleaned_html = clean_content(slug, raw_content)
        excerpt = generate_clean_excerpt(cleaned_html, 158)
        read_time = calculate_read_time(cleaned_html)

        cat_ids = rp.get("categories", [])
        item_cats = []
        for cid in cat_ids:
            if cid in cat_by_id:
                c_obj = cat_by_id[cid]
                item_cats.append({"slug": c_obj["slug"], "name": c_obj["name"]})

        if not item_cats:
            item_cats = [{"slug": "minoxidil", "name": CATEGORY_NAMES_CLEAN["minoxidil"]}]

        primary_cat_slug = item_cats[0]["slug"]
        primary_cat_name = item_cats[0]["name"]

        if primary_cat_slug in cat_by_slug:
            cat_by_slug[primary_cat_slug]["count"] += 1

        thumb_id = rp.get("featured_media") or None
        if thumb_id == 0:
            thumb_id = None
        featured_url = attachments.get(thumb_id, "") if thumb_id else ""
        if not featured_url:
            img_m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', cleaned_html, flags=re.I)
            if img_m:
                featured_url = img_m.group(1)

        if featured_url and "masbarba.net/wp-content/uploads/" in featured_url:
            all_image_urls.add(featured_url)

        for inline_img in re.findall(
            r"https?://(?:www\.)?masbarba\.net/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)",
            cleaned_html,
            flags=re.I,
        ):
            all_image_urls.add(inline_img)

        pub_date = rp.get("date", "").replace("T", " ")
        mod_date = rp.get("modified", "").replace("T", " ") or pub_date

        posts.append(
            {
                "id": pid,
                "title": clean_title,
                "slug": slug,
                "category": primary_cat_slug,
                "categoryName": primary_cat_name,
                "categories": item_cats,
                "date": pub_date,
                "modified": mod_date,
                "readTime": read_time,
                "content": cleaned_html,
                "excerpt": excerpt,
                "featuredImageId": thumb_id,
                "featuredImageUrl": featured_url,
                "inlineRelated": inline_related,
                "isTopSeo": slug in TOP_SEO_SLUGS or "you-minox" in slug,
                "isYouMinox": "you-minox" in slug or "minoxidil-en-crema" in slug,
                "type": "post",
                "status": "publish",
            }
        )

    # Sort newest first
    posts.sort(key=lambda x: x["date"], reverse=True)

    print("📑 Fetching institutional pages...")
    raw_pages = fetch_json("https://masbarba.net/wp-json/wp/v2/pages?per_page=100")
    pages = []
    for pg in raw_pages:
        pslug = pg["slug"].strip()
        if pslug == "home":
            continue
        ptitle = clean_evergreen_title(pg.get("title", {}).get("rendered", ""))
        pcontent = clean_content(pslug, pg.get("content", {}).get("rendered", ""))
        for inline_img in re.findall(
            r"https?://(?:www\.)?masbarba\.net/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)",
            pcontent,
            flags=re.I,
        ):
            all_image_urls.add(inline_img)

        pages.append(
            {
                "id": int(pg["id"]),
                "title": ptitle,
                "slug": pslug,
                "category": "page",
                "categoryName": "Página",
                "categories": [],
                "date": pg.get("date", "").replace("T", " "),
                "modified": pg.get("modified", "").replace("T", " "),
                "readTime": calculate_read_time(pcontent),
                "content": pcontent,
                "excerpt": generate_clean_excerpt(pcontent, 158),
                "featuredImageId": None,
                "featuredImageUrl": "",
                "type": "page",
                "status": "publish",
            }
        )

    with open(os.path.join(DATA_DIR, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(categories, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "image-urls.json"), "w", encoding="utf-8") as f:
        json.dump(sorted(all_image_urls), f, ensure_ascii=False, indent=2)

    search_index = [
        {
            "t": p["title"],
            "s": p["slug"],
            "c": p["category"],
            "n": p["categoryName"],
            "r": p["readTime"],
        }
        for p in posts
    ]
    with open(os.path.join(PUBLIC_DIR, "search-index.json"), "w", encoding="utf-8") as f:
        json.dump(search_index, f, ensure_ascii=False)

    ads_txt = "google.com, pub-1070738569472471, DIRECT, f08c47fec0942fa0\n"
    with open(os.path.join(PUBLIC_DIR, "ads.txt"), "w", encoding="utf-8") as f:
        f.write(ads_txt)

    print(f"✅ Successfully processed {len(posts)} posts, {len(pages)} pages, {len(categories)} categories!")
    print(f"🖼️ Found {len(all_image_urls)} unique WordPress image URLs to download.")
    for c in categories:
        print(f"   - {c['slug']} ({c['name']}): {c['count']} posts")


if __name__ == "__main__":
    main()
