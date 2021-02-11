module.exports = {
  "env": {
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "import/extensions": [
      0
    ],
    "camelcase": [0],
    "no-underscore-dangle": 0,
    "global-require": 0,
    "no-use-before-define": 0,
    "import/prefer-default-export": [0],
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "no-mixed-operators": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "max-len": "off",
  }
};
