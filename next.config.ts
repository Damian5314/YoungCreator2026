import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Cv-upload (PDF tot 5 MB) gaat via een server action; standaard is de limiet 1 MB
      bodySizeLimit: '6mb',
    },
  },
};

export default nextConfig;
