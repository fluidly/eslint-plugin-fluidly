const ruleTester = require('./ruleTester')
const rule = require('../rules').rules

describe('ESLint plugin', () => {
  ruleTester.run('no-new-date-for-parsing', rule['no-new-date-for-parsing'], {
    valid: ["parseISO('2019-01-01')", 'new Date()', 'new Date(2019,1,1)'],
    invalid: [
      {
        code: "new Date('2019-01-01')",
        errors: [
          {
            message:
              "Don't use new Date(dateString), use dateFns.parseISO(dateString) instead",
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'new Date(date)',
        errors: [
          {
            message:
              "Don't use new Date(dateString), use dateFns.parseISO(dateString) instead",
            type: 'NewExpression',
          },
        ],
      },
    ],
  })
})
