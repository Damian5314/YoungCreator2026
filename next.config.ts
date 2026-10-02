import type { NextConfig } from 'next';

// Beveiligingsheaders op elke response. De Content-Security-Policy (met een nonce per request) zet
// src/proxy.ts; X-Frame-Options blijft hier als vangnet voor oudere browsers en niet-pagina-routes.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Cv-upload (PDF tot 5 MB) gaat via een server action; standaard is de limiet 1 MB
      bodySizeLimit: '6mb',
    },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
