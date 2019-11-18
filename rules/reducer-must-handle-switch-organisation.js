'use strict'

const { get, isArray, isEmpty, omit } = require('lodash/fp')

const getNodeIdName = node => (get('id.name')(node) || '').toLowerCase(node)

const getNodeParentType = get('parent.type')

const getNodeParentIdName = node =>
  (get('parent.id.name')(node) || '').toLowerCase()

const getNodeChildren = node => {
  const children = getNodeChildrenRaw(node)
  return isArray(children) ? children : [children]
}

const getNodeChildrenRaw = node => {
  if (!node) return
  if (node.type === 'Literal') return
  if (node.type === 'ReturnStatement') return
  if (node.type === 'VariableDeclaration') return
  if (node.type === 'CallExpression') return

  if (node.body) return node.body
  if (node.type === 'SwitchStatement') return node.cases
  if (node.type === 'SwitchCase') return [node.test, ...node.consequent]
  if (node.type === 'ExpressionStatement') return [node.expression]

  console.log(
    'UNKNOWN',
    node.type,
    omit(['expression', 'parent', 'loc', '_babelType', 'start', 'end'])(node)
  )
}

module.exports = {
  create: function(context) {
    const file = context.getFilename()
    const checkFunctionOrExpression = node => {
      const hasSwitchOrganisation = findSwitchOrganisationConstant(node)
      if (!hasSwitchOrganisation)
        context.report(node, 'Reducers must handle SWITCH_ORGANISATION action')
    }

    const findSwitchOrganisationConstant = node => {
      if (!node) return
      console.log('Node', file, node.type)

      // if this is an identifier, return true if it is SWITCH_ORGANISATION
      if (
        node.type === 'Identifier' &&
        node.name === 'SWITCH_ORGANISATION' &&
        getNodeParentType(node) === 'SwitchCase'
      ) {
        return true
      }

      if (
        node.type === 'Literal' &&
        node.value === 'SWITCH_ORGANISATION' &&
        getNodeParentType(node) === 'SwitchCase'
      ) {
        return true
      }

      const children = getNodeChildren(node)
      if (isEmpty(children)) return
      for (let i = 0; i < children.length; i++) {
        const hasSwitchOrganisation = findSwitchOrganisationConstant(
          children[i]
        )
        if (hasSwitchOrganisation) return true
      }
    }

    // only check files which have reducer in the title
    if (!file.toLowerCase().includes('reducer')) return {}

    return {
      FunctionDeclaration: node => {
        if (getNodeIdName(node).includes('reducer')) {
          checkFunctionOrExpression(node)
        }
      },
      FunctionExpression: node => {
        if (getNodeParentIdName(node).includes('reducer')) {
          checkFunctionOrExpression(node)
        }
      },
      ArrowFunctionExpression: node => {
        const arrowFunctionConstName = getNodeParentIdName(node)
        if (arrowFunctionConstName.includes('reducer')) {
          checkFunctionOrExpression(node)
        }
      },
      Switch: function(node) {
        console.log('SWITCH')
      },
    }
  },
  meta: {
    docs: {
      description: 'Reducers must handle SWITCH_ORGANISATION action',
    },
    type: 'problem',
  },
}
