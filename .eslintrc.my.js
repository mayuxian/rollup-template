module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  // 'extends': [
  //   'plugin:vue/essential',
  //   // '@vue/standard'
  // ],
  rules: {
    //TODO:生产环境先设置成警告.真实要设置成error
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
