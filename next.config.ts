import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: {
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "masbarba.net",
        pathname: "/wp-content/uploads/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      // Legacy WordPress Sitemaps -> Next.js Sitemap
      {
        source: "/wp-sitemap/:path*",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap-posts-post-1.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap-posts-page-1.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap-taxonomies-category-1.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/wp-sitemap-users-1.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/sitemap_index.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/post-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/page-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        source: "/category-sitemap.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      // WordPress category pagination & category URL compatibility (fixes GSC unindexed /category/ URLs)
      {
        source: "/category/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/category/:slug",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page/",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/:slug/page/:page",
        destination: "/:slug/",
        permanent: true,
      },
      {
        source: "/page/:page/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/page/:page",
        destination: "/",
        permanent: true,
      },
      // Legacy WordPress per-post RSS /feed/ URLs (fixes 42 GSC unindexed /feed/ URLs)
      {
        source: "/:category/:slug/feed/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug/feed",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/feed/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      // Legacy WordPress author, tag & attachment URLs
      {
        source: "/author/:path*",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:category/:slug/attachment/:att*/",
        destination: "/:category/:slug/",
        permanent: true,
      },
      {
        source: "/:category/:slug/attachment/:att*",
        destination: "/:category/:slug/",
        permanent: true,
      },
      // Common legal & contact aliases
      {
        source: "/privacy-policy/",
        destination: "/politica-de-privacidad/",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/politica-de-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-privacidad/",
        destination: "/politica-de-privacidad/",
        permanent: true,
      },
      {
        source: "/politica-privacidad",
        destination: "/politica-de-privacidad/",
        permanent: true,
      },
      {
        source: "/contacto/",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/hola-hablamos/",
        permanent: true,
      },
      // Legacy WordPress Home page slug & blog alias
      {
        source: "/home/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/minoxidil/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/minoxidil/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
