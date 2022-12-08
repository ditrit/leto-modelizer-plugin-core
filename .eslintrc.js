module.exports = {
  root: true,

  plugins: [
    'jsdoc',
  ],

  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2022, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },

  env: {
    jest: true,
    browser: true,
    es2021: true,
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    'airbnb-base',
    "plugin:cypress/recommended",
    "plugin:jsdoc/recommended",
  ],

  globals: {
    __statics: 'readonly',
    process: 'readonly',
    chrome: 'readonly',
  },

  ignorePatterns: [
    'docs/*',
    'dist/*',
    'cypress/*',
    '*/assets/*',
    'jest.config.js',
    'cypress.config.js'
  ],
  // add your custom rules here
  rules: {
    'linebreak-style': ['error', 'unix'],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-void': 'off',
    'no-nested-ternary': 'off',
    'max-classes-per-file': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',

    'prefer-promise-reject-errors': 'off',
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const','let'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
    ],
    'max-len': ["error", { "code": 100 }],
    curly: ["error", 'all'],
    'nonblock-statement-body-position': ['error', 'below'],

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'jsdoc/no-undefined-types': 'off'
  },
};
