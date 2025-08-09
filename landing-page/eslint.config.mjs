// eslint.config.mjs
import nextPlugin from "@next/eslint-plugin-next";

const config = [
  // ... any other configs you have
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
];

export default config;
