const rule = require('../rules').rules
const RuleTester = require('eslint').RuleTester

RuleTester.setDefaultConfig({
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
})

var ruleTester = new RuleTester()

const valid0 = {
  filename: 'not-the-right-filename.js',
  code: `const doesntMatter = 1234`,
}

const valid1 = {
  filename: 'Container.reducer.js',
  code: `
    export const reducer = (state, action) => {
      switch(action.type) {
        case 'SWITCH_ORGANISATION':
          return state
        case 'SOME_OTHER_ACTION':
          return { firstProp: 1234, anotherProp: true }
        default:
          return state 
      }
    }
  `,
}

const valid2 = {
  filename: 'reducer.js',
  code: `
    import { SWITCH_ORGANISATION } from '../abc'
    export const reducer = (state, action) => {
      switch(action.type) {
        case SWITCH_ORGANISATION:
          return state
        default:
          return state 
      }
    }
  `,
}

const invalid1 = {
  filename: 'reducer.js',
  code: `
    export const reducer = (state, action) => {
      const map = {}
      action.payload.forEach((x) => {
        map[x] = true
      })

      switch(action.type) {
        case 'SOME_OTHER_ACTION':
          return { firstProp: 1234, anotherProp: true }
        default:
          return state 
      }
    }
  `,
  errors: [
    {
      message: 'Reducers must handle SWITCH_ORGANISATION action',
      type: 'ArrowFunctionExpression',
    },
  ],
}

const invalid2 = {
  filename: 'reducer.js',
  code: `
    export function reducer (state, action) {
      switch(action.type) {
        case 'SOME_OTHER_ACTION':
          return { firstProp: 1234, anotherProp: true }
        default:
          return state 
      }
    }
  `,
  errors: [
    {
      message: 'Reducers must handle SWITCH_ORGANISATION action',
      type: 'FunctionDeclaration',
    },
  ],
}

const invalid3 = {
  filename: 'reducer.js',
  code: `
    export const reducer = function (state, action) {
      switch(action.type) {
        case 'SOME_OTHER_ACTION':
          return { firstProp: 1234, anotherProp: true }
        default:
          return state 
      }
    }
  `,
  errors: [
    {
      message: 'Reducers must handle SWITCH_ORGANISATION action',
      type: 'FunctionExpression',
    },
  ],
}

describe('ESLint plugin', () => {
  ruleTester.run(
    'reducer-must-handle-switch-organisation',
    rule['reducer-must-handle-switch-organisation'],
    {
      valid: [valid0, valid1, valid2],
      invalid: [invalid1, invalid2, invalid3],
    }
  )
})
