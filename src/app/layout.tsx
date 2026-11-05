import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  YOU_MINOX_URL,
  ADSENSE_CLIENT,
  GA_ID,
} from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Minoxidil para Barba y Cabello, You Minox en Crema, Biotina y Alopecia`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: `${SITE_NAME} — Portal Oficial de Crecimiento de Barba y Cuidado Capilar by You Minox`,
    description: SITE_DESCRIPTION,
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/images/brand/you-minox.webp`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — Powered by You Minox`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Minoxidil para Barba, You Minox y Salud Capilar`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/brand/you-minox.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "es",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: `${SITE_NAME} — Creado por You Minox`,
        url: `${SITE_URL}/`,
        sameAs: [YOU_MINOX_URL, "https://charlielingan.com/"],
        founder: {
          "@type": "Person",
          name: "Charlie Lingán",
          url: `${SITE_URL}/hola-hablamos/`,
        },
        sponsor: {
          "@type": "Organization",
          name: "You Minox",
          url: YOU_MINOX_URL,
        },
      },
    ],
  };

  return (
    <html lang="es" className={inter.variable}>
      <head>
        {/* Google AdSense Verification & Script */}
        <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
        {/* Google Analytics 4 (GA4) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
