//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config';
import tailwind from 'eslint-plugin-tailwindcss';
import { config as baseConfig } from './base.js';

/** @type {import("typescript-eslint").ConfigArray} */
export const config = [
  ...baseConfig,
  ...tanstackConfig,
  ...tailwind.configs['flat/recommended'],
  {
    settings: {
      tailwindcss: {
        config: {},
        cssFiles: ['**/*.css', '!**/node_modules', '!**/dist'],
        // Ez segít, hogy a linter "ráharapjon" a gombodra is:
        callees: ['classnames', 'clsx', 'ctl', 'cva', 'cn', 'tv'],
        tags: ['tw', 'styled']
      }
    }
  },
  {
    rules: {
      'tailwindcss/no-custom-classname': 'off',
      'import/no-cycle': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node.js modules (fs, path)
            'external', // npm packages (react, @nestjs)
            'internal', // Monorepo packages (@repo/...)
            ['parent', 'sibling'], // Parent/sibling files
            'index',
            'object'
          ],
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js']
  }
];
