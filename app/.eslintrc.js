module.exports = {
  env: {
    'jest/globals': true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'next',
    'nava'
  ],
  'globals': {
    'JSX': true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  plugins: ['@typescript-eslint', 'jest'],
  root: true,
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'space-before-function-paren': ['error', 'never']
  }
}
