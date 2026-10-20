import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", "data/"] },
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // Components are used in JSX, which this config does not parse for usage.
    rules: { "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]" }] },
  },
  {
    files: ["server/**/*.js", "tests/**/*.js", "*.config.js"],
    languageOptions: { globals: globals.node },
  },
];
