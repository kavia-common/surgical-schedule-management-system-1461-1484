/** @type {import("eslint").FlatConfig[]} */
const jsConfig = {
  files: ['**/*.js'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'commonjs',
    globals: {
      // Node globals
      __dirname: 'readonly',
      __filename: 'readonly',
      exports: 'readonly',
      module: 'readonly',
      require: 'readonly',
      process: 'readonly',
      console: 'readonly',
      // Jest globals (kept for future tests)
      describe: 'readonly',
      it: 'readonly',
      test: 'readonly',
      expect: 'readonly',
      beforeAll: 'readonly',
      afterAll: 'readonly',
      beforeEach: 'readonly',
      afterEach: 'readonly',
    },
  },
  rules: {
    // Base style
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    curly: ['error', 'all'],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'dot-notation': 'error',
    'no-var': 'error',
    'prefer-const': ['error', { destructuring: 'all' }],
    'prefer-arrow-callback': 'warn',
    'arrow-body-style': ['warn', 'as-needed'],

    // Safety and correctness
    'no-undef': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-shadow': 'warn',
    'no-param-reassign': 'warn',
    'consistent-return': 'warn',

    // Debugging/logging
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};

const ignoreConfig = {
  ignores: ['node_modules/**', 'interfaces/**'],
};

module.exports = [ignoreConfig, jsConfig];