module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/return-in-computed-property': 'warn',
    'prefer-promise-reject-errors': 'warn'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
