import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'portfolio-multimedia.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/uploads/blog-images/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
