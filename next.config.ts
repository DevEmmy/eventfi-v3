import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'example.com',
      },
      {
        protocol: 'http',
        hostname: 'test.com',
      }
    ],
  },
};

export default nextConfig;
