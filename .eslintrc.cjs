module.exports = {
  env: {
    es2022: true,
    node: true,
    mocha: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-console': 'off', // Allow console for logging
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { 'before': true, 'after': true }],
    'space-infix-ops': 'error',
    'eol-last': 'error',
    'no-trailing-spaces': 'error'
  },
  globals: {
    'describe': 'readonly',
    'it': 'readonly',
    'before': 'readonly',
    'after': 'readonly',
    'beforeEach': 'readonly',
    'afterEach': 'readonly'
  }
};
