// eslint.config.mjs
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    // **THE FIX**: This key is required to specify which files the rules apply to.
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    // This key prevents "React is not defined" errors in some environments.
    languageOptions: {
        globals: {
            React: 'readonly',
        }
    }
  },
];

export default config;
