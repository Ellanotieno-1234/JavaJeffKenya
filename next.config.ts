import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:$PORT/api/:path*'  // Forward API requests to FastAPI backend
      }
    ];
  }
};

export default nextConfig;
