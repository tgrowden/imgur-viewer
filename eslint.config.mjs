import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
export default tseslint.config(
  { ignores: ['dist'] },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  eslint.configs.recommended,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        globals: globals.browser,
        projectService: {
          allowDefaultProject: ['*.mjs', 'tailwind.config.js', 'vite.config.js'],
        },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      'react-refresh': reactRefresh,
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    rules: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },

  eslintPluginPrettierRecommended,
)
