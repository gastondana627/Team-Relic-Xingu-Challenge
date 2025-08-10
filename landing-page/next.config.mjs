// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // This setting is from your .ts file
  output: 'standalone', 

  // This setting is from your .ts file
  trailingSlash: false,

  // This webpack config is present in both files
  webpack(config) {
    config.externals.push({
      '@xenova/transformers': 'commonjs @xenova/transformers',
    });
    return config;
  },
};

export default nextConfig;