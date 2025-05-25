import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://javajeffkenya-4-gf2j.onrender.com/api/:path*'  // Forward API requests to Render backend
      }
    ];
  },
  env: {
    BACKEND_URL: 'https://javajeffkenya-4-gf2j.onrender.com'
  }
};

export default nextConfig;
