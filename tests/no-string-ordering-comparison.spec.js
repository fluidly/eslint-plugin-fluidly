const ruleTester = require('./ruleTester')
const rule = require('../rules').rules

describe('ESLint plugin no-string-ordering-comparison', () => {
  ruleTester.run('no-string-ordering-comparison', rule['no-string-ordering-comparison'], {
    valid: ["'test' === 'test'", "2 > 3", "2 < 3", "2 <= 3", "2 >= 3"],
    invalid: [
      {
        code: "'test' >= 'test'",
        errors: [
          {
            message:
              "String ordering comparisons not allowed",
            type: 'BinaryExpression',
          },
        ],
      },
      {
        code: "'test' <= 'test'",
        errors: [
          {
            message:
              "String ordering comparisons not allowed",
            type: 'BinaryExpression',
          },
        ],
      },
      {
        code: "'test' < 'test'",
        errors: [
          {
            message:
              "String ordering comparisons not allowed",
            type: 'BinaryExpression',
          },
        ],
      },
      {
        code: "'test' > 'test'",
        errors: [
          {
            message:
              "String ordering comparisons not allowed",
            type: 'BinaryExpression',
          },
        ],
      },
      {
        code: "if ('test' >= 'test') { console.log('awef') }",
        errors: [
          {
            message:
              "String ordering comparisons not allowed",
            type: 'BinaryExpression',
          },
        ],
      },
      {
        code: "'test' >= 'test' ? true : false",
        errors: [
          {
            message:
              "String ordering comparisons not allowed",
            type: 'BinaryExpression',
          },
        ],
      },
    ],
  })
})
