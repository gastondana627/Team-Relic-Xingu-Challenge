// landing-page/next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      // This line forces a specific file from the transformers library to be
      // included in the server-side bundle, which fixes the Vercel build error.
      config.externals.push({
        '@xenova/transformers': 'commonjs @xenova/transformers',
      });
      return config;
    },
  };
  
  export default nextConfig;