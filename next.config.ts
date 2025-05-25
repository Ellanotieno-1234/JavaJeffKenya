import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://javajeffkenya-4-gf2j.onrender.com/api/:path*'
      }
    ];
  },
  async headers() {
    return [
      {
        // Allow CORS for all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: '*' }
        ]
      }
    ];
  }
};

export default nextConfig;
