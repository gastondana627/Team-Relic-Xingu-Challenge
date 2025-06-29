import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.externals.push({
      '@xenova/transformers': 'commonjs @xenova/transformers',
    });
    return config;
  },
};

export default nextConfig;