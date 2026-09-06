import type { NextConfig } from "next";

import { FAQ_SLUG_REDIRECTS } from "./content/faq";

/**
 * En-têtes de sécurité — build prompt §9.
 *
 * Cloudflare se configure hors du code (DNS, proxy, WAF, plafonnement au
 * bord) : voir `docs/cloudflare.md`. Ce fichier apporte la couche applicative.
 */

/** L'origine Supabase doit être joignable en XHR et en WebSocket. */
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseWebsocket = supabaseOrigin.replace(/^https:/, "wss:");

/**
 * `unsafe-eval` en développement uniquement : le runtime HMR de Next évalue
 * des chaînes, et sans cette autorisation la page ne s'hydrate pas du tout en
 * `next dev`. La build de production n'évalue rien — la directive stricte y
 * reste entière.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  `default-src 'self'`,
  // `unsafe-inline` reste nécessaire tant que le pipeline de nonce n'est pas
  // branché : Next injecte des scripts d'amorçage en ligne. Suite documentée
  // dans `docs/cloudflare.md`.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self' data:`,
  [`connect-src 'self'`, supabaseOrigin, supabaseWebsocket, "https://api.stripe.com"]
    .filter(Boolean)
    .join(" "),
  `frame-src https://js.stripe.com https://hooks.stripe.com`,
  `form-action 'self' https://checkout.stripe.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "1mb",
    },
  },

  /**
   * Redirections 301 des anciens slugs de FAQ.
   *
   * Le contenu est anglais, les URL l'étaient restées françaises. Chaque
   * ancienne adresse pointe **directement** sur sa cible finale : aucune
   * chaîne de redirections, et l'équité de lien accumulée est transmise.
   *
   * `permanent: true` produit un 308, qui préserve la méthode HTTP. Google le
   * traite comme un 301 pour la consolidation d'index.
   */
  async redirects() {
    return Object.entries(FAQ_SLUG_REDIRECTS).map(([from, to]) => ({
      source: `/faq/${from}`,
      destination: `/faq/${to}`,
      permanent: true,
    }));
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
