// https://stackoverflow.com/questions/78348933/how-to-use-eslint-flat-config-for-vue-with-typescript

import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginN from 'eslint-plugin-n'
import pluginPromise from 'eslint-plugin-promise'
import pluginImport from 'eslint-plugin-import'
import tsEslint from 'typescript-eslint'
import standard from 'eslint-config-standard'

export default tsEslint.config(
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    plugins: {
      'typescript-eslint': tsEslint.plugin,
      n: pluginN,
      import: pluginImport,
      promise: pluginPromise,
    },
    languageOptions: {
      parserOptions: {
        parser: tsEslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
      },
    },
    files: ['{**/*,*}.{js,ts,jsx,tsx,vue}'],
    rules: {
      // Nem biztos, hogy ez a legjobb módja a standard behúzásának, de a lib flat config design-t nem igazán támogatja:
      // - https://github.com/standard/eslint-config-standard/issues/411
      // - https://github.com/standard/eslint-config-standard/issues/410#issuecomment-2136708186
      ...standard.rules,
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': [
        'error', {
          singleline: {
            max: 3,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      'comma-dangle': [
        'error', {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
        },
      ],
      'object-shorthand': 'off',
    },
  },
)
