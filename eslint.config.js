import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import globals from 'globals';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unused-imports': unusedImports,
    },
    globals: {
      ...globals.node,
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
];
