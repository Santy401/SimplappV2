import type { NextConfig } from "next";

process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA = process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA || "true";
process.env.BROWSERSLIST_IGNORE_OLD_DATA = process.env.BROWSERSLIST_IGNORE_OLD_DATA || "true";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/client-runtime-utils", "@prisma/adapter-pg", "pg", "bcryptjs"],
  transpilePackages: ["@simplapp/ui", "@simplapp/domain"],
  trailingSlash: true,

  async headers() {
    return [
      // ─── Security Headers (todas las rutas) ────────────────────────────────
      {
        source: "/(.*)",
        headers: [
          // Evita que la app sea embebida en iframes de otros dominios (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Evita que el browser detecte el MIME type diferente al declarado
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Controla qué información se manda en el encabezado Referer
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Fuerza HTTPS por 1 año en producción (incluye subdominios)
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Desactiva features del browser que no se necesitan
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Content Security Policy — permite Next.js + subdominios propios
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval necesario para Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.simplapp.com.co wss://*.simplapp.com.co",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
      // ─── CORS para rutas de API ────────────────────────────────────────────
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          // Nota: El origen se maneja dinámicamente en proxy.ts para permitir credenciales
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
