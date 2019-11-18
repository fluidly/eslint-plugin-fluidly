const path = require('path')
const RuleTester = require('eslint').RuleTester

RuleTester.setDefaultConfig({
  parser: path.join(__dirname, '../node_modules', 'babel-eslint'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
})

module.exports = new RuleTester()
