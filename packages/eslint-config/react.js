//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import queryPlugin from '@tanstack/eslint-plugin-query';
import tailwind from 'eslint-plugin-tailwindcss';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import { config as baseConfig } from './base.js';

/** @type {import("typescript-eslint").ConfigArray} */
export const config = [
  ...baseConfig,
  ...tanstackConfig,
  ...tailwind.configs['flat/recommended'],
  ...queryPlugin.configs['flat/recommended'],
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    ...jsxA11y.flatConfigs.strict,
    languageOptions: {
      ...jsxA11y.flatConfigs.strict.languageOptions,
      globals: {
        ...globals.browser
      }
    }
  },
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin
    },
    settings: {
      react: {
        version: 'detect' // Automatikusan felismeri a React verziót
      },
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
      // React & Hooks szabályok
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Modern Reactnál már nem kell importálni
      'react/prop-types': 'off', // TypeScript mellett felesleges
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
      ],

      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          assert: 'both'
        }
      ],
      'jsx-a11y/no-aria-hidden-on-focusable': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'jsx-a11y/anchor-ambiguous-text': 'error'
    }
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js']
  }
];
