import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  // O backend Django exige a barra final nas URLs
  skipTrailingSlashRedirect: true,
   async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: `${BACKEND_URL}/api/:path*/`,
      },
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

