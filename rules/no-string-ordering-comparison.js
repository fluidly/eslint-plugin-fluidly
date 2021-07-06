"use strict"

// yolo
const isComparisonOperator = operator => ['>=', '<=', '>', '<'].includes(operator);
const isString = (node) => typeof node.value === 'string'

module.exports = {
  create: context => ({
    BinaryExpression: node => {
      if (isComparisonOperator(node.operator) && isString(node.left) && isString(node.right)) {
        context.report(
          node,
          "String ordering comparisons not allowed",
        )
      }
    }
  }),
  meta: {
    docs: {
      description:
        "String ordering comparisons not allowed",
    },
    type: 'problem',
  }
}
