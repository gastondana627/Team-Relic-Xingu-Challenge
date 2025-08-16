// eslint.config.mjs
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
    languageOptions: {
      // THE FIX: Use the modern 'globals' import for defining global variables.
      globals: {
        ...globals.browser,
        ...globals.node,
        React: 'readonly',
      }
    }
  },
];

export default config;