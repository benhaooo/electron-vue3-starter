/* eslint-env node */
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('@rushstack/eslint-patch/modern-module-resolution')

export default {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  overrides: [
    {
      files: ['src/main/**/*', 'src/preload/**/*', 'build/**/*'],
      env: {
        node: true,
        browser: false
      },
      extends: [
        'eslint:recommended',
        '@vue/eslint-config-typescript'
      ]
    }
  ]
}
