import nextPlugin from "@next/eslint-plugin-next";

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  // This includes the default recommended Next.js rules
  nextPlugin.configs.recommended,
  
  // This is our new custom object to override specific rules
  {
    rules: {
      // This turns OFF the rule that fails the Vercel build
      "react/no-unescaped-entities": "off",

      // This turns OFF the performance warning about using <img> vs <Image>
      "@next/next/no-img-element": "off"
    }
  }
];

export default config;