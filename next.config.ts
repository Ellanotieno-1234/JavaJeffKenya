import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  distDir: '.next',
  async rewrites() {
    return [];  // Remove rewrites as we're calling the API directly
  },
  async headers() {
    return [];  // Remove headers as CORS is handled by the backend
  }
};

export default nextConfig;
