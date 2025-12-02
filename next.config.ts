import type { NextConfig } from "next";

const nextConfig: NextConfig = {
experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
	serverExternalPackages: ['@napi-rs/canvas', 'unpdf', 'unpdf/pdfjs', 'pdfjs-dist'],
};

export default nextConfig;
