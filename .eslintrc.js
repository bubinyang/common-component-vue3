module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-this-alias": [
      "error",
      {
        allowDestructuring: true, // Disallow `const { props, state } = this`; true by default
        allowedNames: ["self", "vm", "that", "this"] // Allow `const self = this`; `[]` by default
      }
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["off"],
    "no-useless-escape": "off"
  },
  overrides: [
    {
      // enable the rule specifically for TypeScript files
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["error"]
      }
    }
  ]
};
