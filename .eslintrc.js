module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['unused-imports'],
  rules: {
    semi: 'off',
    'no-unused-vars': 'off',
    'no-trailing-spaces': 'off',
    'no-duplicate-imports': 'error',
    'no-multi-spaces': 'warn',
    'no-multiple-empty-lines': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/jsx-sort-props': [
      'warn',
      {
        reservedFirst: true,
        shorthandFirst: true,
        callbacksLast: true,
        noSortAlphabetically: true,
      },
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-unused-styles': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'off',
  },
}
