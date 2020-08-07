'use strict';

const { get, isArray, isEmpty, omit } = require('lodash/fp');

module.exports = {
  create: function(context) {
    const file = context.getFilename();

    const hasResetArgument = args => {
      const hasResetAllIdentifier = args.find(
        arg => arg.type === 'Identifier' && arg.name === 'resetAll'
      );

      return !!hasResetAllIdentifier;
    };

    const checkNodeForValidReset = node => {
      const validAfterAllExpressions = node.body.filter(
        node =>
          node.type === 'ExpressionStatement' &&
          ['afterAll', 'afterEach'].includes(node.expression.callee.name) &&
          hasResetArgument(node.expression.arguments)
      );
      return validAfterAllExpressions.length > 0;
    };

    const checkIfDescribeBlock = node => {
      return (
        node.type === 'ExpressionStatement' &&
        get('expression.callee.name', node) === 'describe'
      );
    };

    const checkDescribeBlockForValidReset = node => {
      const describeFunctionBlockStatement = get(
        'expression.arguments[1].body',
        node
      );
      return checkNodeForValidReset(describeFunctionBlockStatement);
    };

    const checkIfAnyParentHasValidReset = node => {
      if (node.parent.type === 'Program')
        return checkNodeForValidReset(node.parent);
      if (
        checkIfDescribeBlock(node.parent) &&
        checkDescribeBlockForValidReset(node.parent)
      ) {
        return true;
      }
      return checkIfAnyParentHasValidReset(node.parent);
    };

    return {
      ExpressionStatement: node => {
        if (!checkIfDescribeBlock(node)) return;
        if (
          !checkDescribeBlockForValidReset(node) &&
          !checkIfAnyParentHasValidReset(node)
        ) {
          context.report(
            node,
            'No reset was found in or above this describe function. Must call afterEach(resetAll) or afterAll(resetAll) somewhere in that chain'
          );
        }
      },
    };
  },
  meta: {
    docs: {
      description: 'All jsx and tsx test files must call resetAll',
    },
    type: 'problem',
  },
};
