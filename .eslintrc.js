/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const typescript = require('typescript');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'svelte3',
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        '@typescript-eslint/indent': 'off',
        'no-label-var': 'off',
        'import/first': 'off',
        'import/no-cycle': 'off',
        'import/no-mutable-exports': 'off',
      },
    },
  ],
  settings: {
    'svelte3/typescript': typescript,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  rules: {
    camelcase: 'off',
    'no-undef': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'warn',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'no-return-await': 'off',
    'operator-linebreak': ['error', 'after'],
    'object-curly-newline': ['error', {
      multiline: true,
      minProperties: 5,
      consistent: true,
    }],
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
  },
};
