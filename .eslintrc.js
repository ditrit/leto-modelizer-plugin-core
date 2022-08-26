module.exports = {
  root: true,

  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
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
  ],

  globals: {
    __statics: 'readonly',
    process: 'readonly',
    chrome: 'readonly',
  },

  ignorePatterns: ['dist/*'],
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

    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
