"use strict"


function isComparisonOperator(operator) {
  return ['>=', '<=', '>', '<'].includes(operator)
}



module.exports = {
  create: context => ({
    BinaryExpression: node => {
      if (isComparisonOperator(node.operator) && typeof node.left.value === 'string' && typeof node.right.value === 'string') {
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
