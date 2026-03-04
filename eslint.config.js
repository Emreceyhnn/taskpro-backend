import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
  {
    ignores: ["node_modules/", "docs/", "temp/", "swagger/"],
  },
];
