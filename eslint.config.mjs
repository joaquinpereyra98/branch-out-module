import htmlEslint from "@html-eslint/eslint-plugin";
import globals from "globals";
import parser from "@html-eslint/parser";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [{
  ignores: ["foundry/**/*"]
}, ...compat.extends("eslint:recommended"), {
  plugins: {
    "@html-eslint": htmlEslint
  },

  languageOptions: {
    globals: {
      ...globals.browser
    },

    ecmaVersion: "latest",
    sourceType: "module"
  },

  rules: {
    indent: ["error", 2, {
      SwitchCase: 1
    }],

    "linebreak-style": ["error", "windows"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "quote-props": ["error", "as-needed"],
    "array-bracket-newline": ["error", "consistent"],
    "no-unused-vars": 0,
    "key-spacing": "error",
    "comma-dangle": "error",
    "space-in-parens": ["error", "never"],
    "space-infix-ops": 2,
    "keyword-spacing": 2,
    "semi-spacing": 2,
    "no-multi-spaces": 2,
    "no-extra-semi": 2,
    "no-whitespace-before-property": 2,
    "space-unary-ops": 2,
    "padding-line-between-statements": [
      "error", 
      {blankLine: "always", prev: "block", next: "*"}
    ],

    "no-multiple-empty-lines": ["error", {
      max: 1,
      maxEOF: 0
    }],

    "object-curly-spacing": ["error", "never"],
    "comma-spacing": ["error"],
    "no-undef": "off",
    "space-before-blocks": 2,
    "arrow-spacing": 2,
    "eol-last": ["error", "always"],

    "no-mixed-operators": ["error", {
      allowSamePrecedence: true,

      groups: [[
        "==",
        "!=",
        "===",
        "!==",
        ">",
        ">=",
        "<",
        "<=",
        "&&",
        "||",
        "in",
        "instanceof"
      ]]
    }],

    "@html-eslint/attrs-newline": ["off", {
      closeStyle: "sameline",
      ifAttrsMoreThan: 9
    }],

    "@html-eslint/indent": ["error", 2]
  }
}, ...compat.extends("plugin:@html-eslint/recommended").map(config => ({
  ...config,
  files: ["**/*.hbs", "**/*.html"]
})), {
  files: ["**/*.hbs", "**/*.html"],

  languageOptions: {
    parser: parser
  }
}];
