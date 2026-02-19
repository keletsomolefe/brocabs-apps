//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

// Extend tanstack config by adding ignore patterns for build/output folders
export default [
  ...tanstackConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['.nitro/**', '.output/**', '.tanstack/**', 'dist/**'],
  },
];
