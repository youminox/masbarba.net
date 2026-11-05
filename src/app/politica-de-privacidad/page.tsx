import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageBySlug, SITE_NAME, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: `Política de Privacidad y protección de datos personales de ${SITE_NAME} (masbarba.net).`,
  alternates: { canonical: `${SITE_URL}/politica-de-privacidad/` },
};

export default function PoliticaPrivacidadPage() {
  const page = getPageBySlug("politica-de-privacidad");

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-10 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Política de Privacidad" },
            ]}
          />
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900">
            Política de Privacidad
          </h1>
          {page && (
            <div
              className="article-content mt-8 max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
