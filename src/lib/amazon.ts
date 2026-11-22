export const AMAZON_TAG_US = "masbarba-20";
export const AMAZON_TAG_ES = "masbarba-21";

export type AmazonStoreRegion = "US" | "ES";

export interface AmazonProductRecommendation {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  features: string[];
  rating: string;
  reviewsCount: string;
  categoryType:
    | "microneedling"
    | "shampoo"
    | "beard"
    | "supplement"
    | "applicator"
    | "skincare";
  /** Direct ASIN on Amazon.com if fixed product */
  asinUS?: string;
  /** Direct ASIN on Amazon.es if fixed product */
  asinES?: string;
  /** Search query fallback or primary dynamic search on Amazon.com */
  queryUS: string;
  /** Search query fallback or primary dynamic search on Amazon.es */
  queryES: string;
  ctaLabel: string;
}

export interface AmazonPageContext {
  sectionTitle: string;
  sectionSubtitle: string;
  products: [
    AmazonProductRecommendation,
    AmazonProductRecommendation,
    AmazonProductRecommendation,
  ];
}

/**
 * Generates an official Amazon Affiliate link with automatic geolocation store support:
 * - USA & Latin America (US): amazon.com with tag=masbarba-20
 * - Spain & Europe (ES): amazon.es with tag=masbarba-21
 */
export function buildAmazonUrl(
  product: AmazonProductRecommendation,
  region: AmazonStoreRegion
): string {
  if (region === "ES") {
    if (product.asinES) {
      return `https://www.amazon.es/dp/${product.asinES}?tag=${AMAZON_TAG_ES}`;
    }
    const q = encodeURIComponent(product.queryES);
    return `https://www.amazon.es/s?k=${q}&tag=${AMAZON_TAG_ES}`;
  }

  if (product.asinUS) {
    return `https://www.amazon.com/dp/${product.asinUS}?tag=${AMAZON_TAG_US}`;
  }
  const q = encodeURIComponent(product.queryUS);
  return `https://www.amazon.com/s?k=${q}&tag=${AMAZON_TAG_US}`;
}

/**
 * Detects whether the user is browsing from Spain/Europe or Americas
 * based on browser timezone and language locale.
 */
export function detectUserAmazonRegion(): AmazonStoreRegion {
  if (typeof window === "undefined") {
    return "US"; // Default SSR fallback for Latin America / Peru / US
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lang = (navigator.language || "").toLowerCase();

    if (
      tz === "Europe/Madrid" ||
      tz === "Atlantic/Canary" ||
      tz === "Europe/Ceuta" ||
      lang === "es-es" ||
      tz.startsWith("Europe/")
    ) {
      return "ES";
    }

    return "US";
  } catch {
    return "US";
  }
}

// ============================================================================
// CURATED BEARD GROWTH, MICRONEEDLING & HAIR RESTORATION CATALOG
// ============================================================================

export const CATALOG = {
  DERMA_ROLLER_05MM: {
    id: "derma-roller-05mm",
    badge: "🧔 #1 Más Vendido para Poblar la Barba",
    title: "Dermaroller de Titanio 0.5 mm (540 Microagujas) para Barba y Cabello",
    subtitle:
      "El rodillo clínico de microagujas de titanio ideal para despertar folículos dormidos en mejillas con huecos y activar el colágeno dérmico.",
    features: [
      "540 microagujas de titanio grado médico de 0.5 mm (longitud clínica segura en casa)",
      "Multiplica hasta por 3x la activación folicular al usarlo 1–2 veces por semana junto a Minoxidil",
      "Mango ergonómico antideslizante con estuche rígido de desinfección y viaje",
    ],
    rating: "4.7",
    reviewsCount: "+14.800",
    categoryType: "microneedling",
    queryUS: "0.5mm titanium derma roller beard hair growth men kit",
    queryES: "derma roller 0.5mm titanio barba pelo hombre",
    ctaLabel: "Ver Dermaroller en Amazon",
  } satisfies AmazonProductRecommendation,

  DERMA_STAMP_ADJUSTABLE: {
    id: "derma-stamp-adjustable",
    badge: "🏆 Mejor Aliado para Entradas y Huecos",
    title: "Derma Stamp Ajustable de Titanio (0.25 mm – 1.5 mm) de Punción Vertical",
    subtitle:
      "Sello de microagujas regulable para entradas capilares, coronilla y zonas rebeldes del candado sin enganchar ni arrancar el vello existente.",
    features: [
      "140 agujas de titanio quirúrgico con dial ajustable de 0.25 mm a 1.5 mm según la zona",
      "Punción vertical de 90° que evita microdesgarros y estimula la enzima folicular SULT1A1",
      "Perfecto para combinar con Minoxidil al 5% (esperando 24 h tras la sesión profunda)",
    ],
    rating: "4.8",
    reviewsCount: "+7.400",
    categoryType: "microneedling",
    queryUS: "adjustable titanium microneedle derma stamp hair beard growth men",
    queryES: "derma stamp ajustable titanio capilar barba hombre",
    ctaLabel: "Ver precio en Amazon",
  } satisfies AmazonProductRecommendation,

  BIOTINA_10000_ZINC: {
    id: "biotina-10000-saw-palmetto",
    badge: "💊 #1 Nutrición Folicular Interna",
    title: "Biotina 10,000 mcg + Zinc, Colágeno y Saw Palmetto (Vitaminas Barba y Pelo)",
    subtitle:
      "Refuerza tu tratamiento tópico desde adentro con la dosis clínica de Vitamina B7 (Biotina), Zinc y extractos naturales para sintetizar queratina gruesa.",
    features: [
      "Alta concentración de Biotina (10,000 mcg) + Zinc y Vitamina D3 para engrosar el vello velloso",
      "Incluye Saw Palmetto estandarizado para proteger el folículo capilar frente al DHT",
      "Suministro para 3 a 4 meses con certificación de pureza GMP",
    ],
    rating: "4.7",
    reviewsCount: "+19.200",
    categoryType: "supplement",
    queryUS: "mens hair beard growth vitamins biotin 10000 mcg saw palmetto zinc",
    queryES: "biotina 10000 mcg zinc saw palmetto pelo barba hombre",
    ctaLabel: "Ver suplemento en Amazon",
  } satisfies AmazonProductRecommendation,

  NIZORAL_KETOCONAZOL_SHAMPOO: {
    id: "nizoral-ketoconazol-shampoo",
    badge: "🛡️ #1 Recomendado por Dermatólogos",
    title: "Champú Clínico Anticaspa y Control DHT con Ketoconazol 1%",
    subtitle:
      "El champú dermatológico esencial para quienes usan Minoxidil: elimina la descamación, calma la picazón y bloquea la inflamación folicular por DHT.",
    features: [
      "Fórmula clínica con Ketoconazol 1% que forma parte de la 'Tríada Capilar' junto al Minoxidil",
      "Limpia a profundidad el exceso de sebo y residuos para que el tratamiento tópico penetre mejor",
      "Uso recomendado de 2 a 3 veces por semana dejando actuar la espuma 4 minutos",
    ],
    rating: "4.8",
    reviewsCount: "+92.000",
    categoryType: "shampoo",
    asinUS: "B00AINMFAC",
    queryUS: "Nizoral Anti-Dandruff Shampoo 1% Ketoconazole",
    queryES: "champu ketoconazol anticaspa cuero cabelludo hombre",
    ctaLabel: "Ver oferta en Amazon",
  } satisfies AmazonProductRecommendation,

  BIOTIN_SAW_PALMETTO_SHAMPOO: {
    id: "biotin-saw-palmetto-shampoo",
    badge: "💧 Mejor Champú Engrosador Diario",
    title: "Champú Engrosador Anticaída con Biotina, Saw Palmetto, Romero y Cafeína",
    subtitle:
      "Limpieza diaria 100% libre de sulfatos y parabenos diseñada para dar volumen inmediato al cabello fino o en fase de regeneración.",
    features: [
      "Complejo botánico bloqueador de DHT (Saw Palmetto, Semilla de Calabaza y Aceite de Romero)",
      "Sin sulfatos agresivos: cuida la barrera lipídica antes de aplicar tu dosis de Minoxidil",
      "Fortalece la fibra de queratina desde la raíz hasta las puntas",
    ],
    rating: "4.6",
    reviewsCount: "+21.400",
    categoryType: "shampoo",
    queryUS: "mens biotin saw palmetto dht blocker thickening shampoo sulfate free",
    queryES: "champu biotina saw palmetto anticaida hombre sin sulfatos",
    ctaLabel: "Ver champú en Amazon",
  } satisfies AmazonProductRecommendation,

  PHILIPS_MULTIGROOM_TRIMMER: {
    id: "philips-multigroom-trimmer",
    badge: "💈 #1 Recortadora de Precisión para Barba",
    title: "Philips Norelco MultiGroom — Recortadora de Barba y Cabello de Precisión",
    subtitle:
      "Mantén los vellos terminales y los nuevos vellos vellosos del tratamiento a un largo uniforme de barbería para que el Minoxidil llegue siempre a la piel.",
    features: [
      "Cuchillas autoafilables DualCut en acero templado con peines guía de 0.5 mm a 16 mm",
      "Perfilador metálico de detalle para marcar líneas limpias en pómulos, bigote y cuello",
      "Batería de iones de litio de larga duración y cabezales 100% lavables bajo el grifo",
    ],
    rating: "4.8",
    reviewsCount: "+84.500",
    categoryType: "beard",
    queryUS: "Philips Norelco Multigroom beard trimmer men kit",
    queryES: "Philips Multigroom recortadora barba precision hombre",
    ctaLabel: "Ver recortadora en Amazon",
  } satisfies AmazonProductRecommendation,

  BOAR_BRISTLE_BEARD_KIT: {
    id: "boar-bristle-beard-kit",
    badge: "🧔 Kit Esencial de Domado y Exfoliación",
    title: "Set de Cepillo 100% Cerdas Naturales de Jabalí + Peine de Madera de Peral",
    subtitle:
      "Entrena la dirección de crecimiento de tu nueva barba hacia abajo, exfolia la piel bajo el vello y distribuye los aceites naturales de forma uniforme.",
    features: [
      "Cerdas firmes 100% de jabalí natural que estimulan la microcirculación en las mejillas",
      "Peine de madera tallada antiestático de doble dentado que no arranca los vellos nuevos",
      "Elimina células muertas y evita los vellos encarnados durante el ciclo de Minoxidil",
    ],
    rating: "4.7",
    reviewsCount: "+22.100",
    categoryType: "beard",
    queryUS: "100% boar bristle beard brush and wooden comb set men",
    queryES: "cepillo barba cerdas jabali peine madera hombre",
    ctaLabel: "Ver kit de barba en Amazon",
  } satisfies AmazonProductRecommendation,

  ROSEMARY_CASTOR_GROWTH_OIL: {
    id: "rosemary-castor-growth-oil",
    badge: "🌿 Mejor Aceite Hidratante Post-Minoxidil",
    title: "Aceite Orgánico de Romero, Menta y Ricino Negro Jamaicano (Barba y Pelo)",
    subtitle:
      "Mezcla botánica prensada en frío para aplicar 30 a 45 minutos después de que seque tu Minoxidil, sellando la hidratación y dando brillo varonil.",
    features: [
      "Aceite puro de Ricino Negro Jamaicano rico en ácido ricinoleico y ácidos grasos Omega-6/9",
      "Infusionado con aceite esencial de Romero y Menta que activan el flujo sanguíneo local",
      "Incluye gotero de vidrio y cepillo aplicador para barba, cejas y entradas",
    ],
    rating: "4.6",
    reviewsCount: "+34.900",
    categoryType: "beard",
    queryUS: "rosemary mint jamaican black castor oil hair beard growth men",
    queryES: "aceite romero y ricino negro crecimiento cabello barba hombre",
    ctaLabel: "Ver aceite en Amazon",
  } satisfies AmazonProductRecommendation,

  CERAMIDE_FACIAL_MOISTURIZER: {
    id: "ceramide-facial-moisturizer",
    badge: "🧴 Reparador de Barrera Cero Resequedad",
    title: "Crema Hidratante Facial Masculina con 3 Ceramidas y Ácido Hialurónico",
    subtitle:
      "Restaura la barrera cutánea 30 minutos después del Minoxidil sin obstruir los poros (no comedogénica) y sin inhibir el DHT de la barba.",
    features: [
      "3 ceramidas esenciales + ácido hialurónico que eliminan la tirantez y descamación facial",
      "Textura ligera oil-free de absorción rápida, sin perfume ni parabenos",
      "Ideal para pieles sensibles o propensas a granos y foliculitis durante el tratamiento",
    ],
    rating: "4.8",
    reviewsCount: "+68.000",
    categoryType: "skincare",
    queryUS: "mens ceramide hyaluronic acid facial moisturizer oil free non comedogenic",
    queryES: "crema hidratante facial ceramidas acido hialuronico hombre",
    ctaLabel: "Ver hidratante en Amazon",
  } satisfies AmazonProductRecommendation,

  ROOT_SCALP_APPLICATOR: {
    id: "root-scalp-applicator",
    badge: "🎯 Dosificador Exacto de Raíz (1 ml)",
    title: "Aplicador Capilar Graduado de 1 ml con Peine de Esferas Metálicas",
    subtitle:
      "Lleva tu loción o suero capilar directamente a la piel del cuero cabelludo sin desperdiciar producto en las hebras del cabello ni en los dedos.",
    features: [
      "Esferas dosificadoras que liberan el líquido solo al presionar suavemente contra la raíz",
      "Escala milimetrada transparente para medir la dosis clínica exacta de 1 ml cada 12 horas",
      "Evita el escurrimiento por la frente y mantiene las manos limpias",
    ],
    rating: "4.6",
    reviewsCount: "+5.800",
    categoryType: "applicator",
    queryUS: "scalp applicator comb graduated 1ml minoxidil hair oil applicator men",
    queryES: "aplicador cuero cabelludo peine dosificador 1ml locion capilar",
    ctaLabel: "Ver aplicador en Amazon",
  } satisfies AmazonProductRecommendation,

  SCALP_MASSAGER_BRUSH: {
    id: "scalp-massager-brush",
    badge: "⚡ Activador de Microcirculación Capilar",
    title: "Cepillo Masajeador y Exfoliante Capilar de Silicona Médica Suave",
    subtitle:
      "Masajea el cuero cabelludo 4 minutos al día en seco o bajo la ducha para oxigenar la papila dérmica y desprender residuos sin lastimar la piel.",
    features: [
      "Puntas flexibles de silicona grado médico que aumentan el flujo sanguíneo hacia los folículos",
      "Estudios clínicos demuestran que el masaje mecánico diario incrementa el grosor capilar",
      "Diseño ergonómico impermeable de una sola pieza (no acumula humedad ni moho)",
    ],
    rating: "4.8",
    reviewsCount: "+49.000",
    categoryType: "shampoo",
    queryUS: "mens silicone scalp massager shampoo brush hair growth",
    queryES: "masajeador cuero cabelludo silicona cepillo champu hombre",
    ctaLabel: "Ver masajeador en Amazon",
  } satisfies AmazonProductRecommendation,

  SATIN_PILLOWCASE_PACK: {
    id: "satin-pillowcase-pack",
    badge: "🌙 Protección Nocturna Anti-Fricción",
    title: "Pack de 2 Fundas de Almohada de Satén Fresco para Hombre (Gris Carbón / Azul)",
    subtitle:
      "Reduce la fricción mecánica nocturna, protege los nuevos folículos durante la fase de shedding y mantiene tu rutina nocturna impecable.",
    features: [
      "Tejido ultrasuave de baja fricción que evita el quiebre del cabello fino y vello facial nuevo",
      "No absorbe la hidratación natural de tu piel ni de tu barba como el algodón áspero",
      "Cierre tipo sobre lavable a máquina en tonos masculinos sobrios",
    ],
    rating: "4.7",
    reviewsCount: "+41.500",
    categoryType: "applicator",
    queryUS: "mens cooling satin pillowcase 2 pack dark gray hair protection",
    queryES: "funda almohada saten gris oscuro pack 2 cuidado cabello barba",
    ctaLabel: "Ver pack en Amazon",
  } satisfies AmazonProductRecommendation,
};

// ============================================================================
// CONTEXTUAL MATCHING ENGINE FOR ALL 2,463 ARTICLES, 6 CATEGORIES & PAGES
// ============================================================================

export function getContextualAmazonProducts(
  slug: string,
  category: string,
  title: string
): AmazonPageContext {
  const text = `${slug} ${category} ${title}`.toLowerCase();

  // 1. Biotina, Vitaminas, Nutrición, Suplementos & Queratina
  if (
    category === "biotina" ||
    text.includes("biotina") ||
    text.includes("vitamina") ||
    text.includes("zinc") ||
    text.includes("suplement") ||
    text.includes("nutricion") ||
    text.includes("colageno") ||
    text.includes("queratina")
  ) {
    return {
      sectionTitle: "💊 Mejores Suplementos de Biotina y Nutrición Folicular en Amazon",
      sectionSubtitle:
        "Potencia tu rutina tópica de Minoxidil desde el interior con Biotina de 10,000 mcg, Zinc, Saw Palmetto y cuidado botánico libre de sulfatos.",
      products: [
        CATALOG.BIOTINA_10000_ZINC,
        CATALOG.BIOTIN_SAW_PALMETTO_SHAMPOO,
        CATALOG.ROSEMARY_CASTOR_GROWTH_OIL,
      ],
    };
  }

  // 2. Finasteride, Bloqueadores de DHT y Control Hormonal Capilar
  if (
    category === "finasteride" ||
    text.includes("finasteride") ||
    text.includes("dutasteride") ||
    text.includes("dht") ||
    text.includes("saw-palmetto") ||
    text.includes("hormona")
  ) {
    return {
      sectionTitle: "🧬 Los Mejores Aliados Bloqueadores de DHT y Sinergia Capilar en Amazon",
      sectionSubtitle:
        "Combina tu tratamiento contra la caída hereditaria con champú clínico de Ketoconazol 1%, Saw Palmetto + Biotina y microneedling de precisión.",
      products: [
        CATALOG.NIZORAL_KETOCONAZOL_SHAMPOO,
        CATALOG.BIOTINA_10000_ZINC,
        CATALOG.DERMA_STAMP_ADJUSTABLE,
      ],
    };
  }

  // 3. Efectos Secundarios, Caspa, Granos, Picazón, Resequedad y Cuidado Facial (consejos)
  if (
    category === "consejos" ||
    text.includes("caspa") ||
    text.includes("grano") ||
    text.includes("acne") ||
    text.includes("irritacion") ||
    text.includes("resequedad") ||
    text.includes("picazon") ||
    text.includes("efecto") ||
    text.includes("hidrat") ||
    text.includes("piel")
  ) {
    return {
      sectionTitle: "🛡️ Kit Recomendado Anti-Resequedad, Hidratación y Cuidado de Barba en Amazon",
      sectionSubtitle:
        "Mantén tu piel libre de descamación, granos y picazón mientras poblas tu barba o cabello con ceramidas reparadoras y cepillado natural.",
      products: [
        CATALOG.CERAMIDE_FACIAL_MOISTURIZER,
        CATALOG.BOAR_BRISTLE_BEARD_KIT,
        CATALOG.ROSEMARY_CASTOR_GROWTH_OIL,
      ],
    };
  }

  // 4. Estilos de Barba, Barbería, Perfilado, Visagismo y Cortes (estilo)
  if (
    category === "estilo" ||
    text.includes("barberia") ||
    text.includes("perfilar") ||
    text.includes("estilo") ||
    text.includes("recort") ||
    text.includes("afeit") ||
    text.includes("candado") ||
    text.includes("bigote") ||
    text.includes("rostro")
  ) {
    return {
      sectionTitle: "💈 Herramientas Esenciales de Perfilado, Domado y Crecimiento de Barba en Amazon",
      sectionSubtitle:
        "Consigue un acabado de barbería profesional en casa mientras estimulas los huecos de las mejillas con titanio de 0.5 mm y cerdas de jabalí.",
      products: [
        CATALOG.PHILIPS_MULTIGROOM_TRIMMER,
        CATALOG.BOAR_BRISTLE_BEARD_KIT,
        CATALOG.DERMA_ROLLER_05MM,
      ],
    };
  }

  // 5. Alopecia, Entradas, Coronilla, Caída del Cabello y Shedding (alopecia)
  if (
    category === "alopecia" ||
    text.includes("alopecia") ||
    text.includes("entrada") ||
    text.includes("coronilla") ||
    text.includes("calvicie") ||
    text.includes("caida") ||
    text.includes("cabello") ||
    text.includes("pelo") ||
    text.includes("norwood")
  ) {
    return {
      sectionTitle: "🏆 La Tríada de Regeneración Capilar Más Vendida en Amazon",
      sectionSubtitle:
        "Multiplica la densidad en entradas y coronilla combinando punción vertical ajustable de titanio, champú con Ketoconazol 1% y masajeador folicular.",
      products: [
        CATALOG.DERMA_STAMP_ADJUSTABLE,
        CATALOG.NIZORAL_KETOCONAZOL_SHAMPOO,
        CATALOG.SCALP_MASSAGER_BRUSH,
      ],
    };
  }

  // 6. Dermaroller, Microagujas y Aplicación de Precisión
  if (
    text.includes("dermaroller") ||
    text.includes("microaguja") ||
    text.includes("rodillo") ||
    text.includes("aplicar") ||
    text.includes("dosis")
  ) {
    return {
      sectionTitle: "⚡ Mejores Dermarollers de Titanio y Aplicadores de Precisión en Amazon",
      sectionSubtitle:
        "Activa el colágeno y los canales foliculares con microagujas de titanio grado médico de 0.5 mm y dosifica tu tratamiento sin desperdicio.",
      products: [
        CATALOG.DERMA_ROLLER_05MM,
        CATALOG.DERMA_STAMP_ADJUSTABLE,
        CATALOG.ROOT_SCALP_APPLICATOR,
      ],
    };
  }

  // 7. Default (Minoxidil para Barba y Cabello, Comparativas, Home, etc.)
  return {
    sectionTitle: "🧔 Kit #1 de Crecimiento de Barba y Regeneración Folicular en Amazon",
    sectionSubtitle:
      "Complementa tu rutina diaria de Minoxidil al 5% (You Minox Crema-Gel) con las herramientas mejor valoradas por miles de usuarios en Amazon.",
    products: [
      CATALOG.DERMA_ROLLER_05MM,
      CATALOG.BIOTINA_10000_ZINC,
      CATALOG.PHILIPS_MULTIGROOM_TRIMMER,
    ],
  };
}
