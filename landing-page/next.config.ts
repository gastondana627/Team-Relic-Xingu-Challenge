import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This is the new part that fixes the Vercel build error.
  webpack(config) {
    config.externals.push({
      '@xenova/transformers': 'commonjs @xenova/transformers',
    });
    return config;
  },
};

export default nextConfig;