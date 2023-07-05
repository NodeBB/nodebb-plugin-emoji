module.exports = {
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    extraFileExtensions: ['.svelte'], // This is a required setting in `@typescript-eslint/parser` v4.24.0
  },
  plugins: [
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        '@typescript-eslint/indent': 'off',
        'no-label-var': 'off',
        'import/first': 'off',
        'import/no-cycle': 'off',
        'import/no-mutable-exports': 'off',
      },
    },
  ],
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
