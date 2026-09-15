import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // Server-side code: Vercel functions, shared lib modules and build config
    // run in Node, not the browser, so `process`, `Buffer` and friends exist.
    // Without this every server file reported `'process' is not defined`.
    files: ['api/**/*.js', 'lib/**/*.{js,mjs}', 'lib_py/**/*.js', '*.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
])
