//  @ts-check
import { config as reactConfig } from '@repo/eslint-config/react';

export default [
  ...reactConfig,
  {
    ignores: ['eslint.config.js', 'prettier.config.js']
  }
];
