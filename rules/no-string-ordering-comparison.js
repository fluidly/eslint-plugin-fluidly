"use strict"


function isComparisonOperator(operator) {
  return ['>=', '<=', '>', '<'].includes(operator)
}

module.exports = {
  create: context => ({
    BinaryExpression: node => {
      if (isComparisonOperator(node.operator)) {
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
