import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js recommended configurations
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom configuration for our dynamic CMS implementation
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Allow conditional rendering patterns used in our Header component
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],

      // Allow dynamic property access for CMS data
      "@typescript-eslint/no-explicit-any": "warn",

      // Ensure consistent return types for helper functions
      "@typescript-eslint/explicit-function-return-type": "off",

      // Ensure proper React hooks usage in our components
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Allow console.error for error logging in CMS integration
      "no-console": ["warn", { "allow": ["warn", "error"] }],

      // Allow empty interfaces for extending CMS types
      "@typescript-eslint/no-empty-interface": "off",

      // Ensure consistent naming for CMS-related functions
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "function",
          "format": ["camelCase", "PascalCase"]
        },
        {
          "selector": "variable",
          "format": ["camelCase", "PascalCase", "UPPER_CASE"]
        }
      ]
    }
  },

  // Specific configuration for CMS integration files
  {
    files: ["**/getSiteSettings.ts", "**/components/**/*.tsx"],
    rules: {
      // Allow any type for CMS data structures that may vary
      "@typescript-eslint/no-explicit-any": "off",

      // Allow non-null assertions for CMS data we know exists
      "@typescript-eslint/no-non-null-assertion": "warn"
    }
  }
];

export default eslintConfig;
