'use strict';

const {
  get,
  first,
  find,
  filter,
  isArray,
  isEmpty,
  omit,
} = require('lodash/fp');

module.exports = {
  create: function(context) {
    const file = context.getFilename();

    const getFunctionContent = node => {};

    const getNodeContent = node => {
      switch (node.type) {
        case 'Program':
        case 'BlockStatement':
          return node.body;
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
          return getNodeContent(node.body);
        case 'AwaitExpression':
        case 'ExpressionStatement':
          return [node.expression];
        case 'ReturnExpression':
          return [node.argument];
      }

      return [node];
    };

    const hasResetArgumentOrCall = args => {
      const node = first(args);
      if (!node) return false;

      const { type, name } = node;
      if (type === 'Identifier' && node.name === 'resetAll') return true;

      if (type === 'ArrowFunctionExpression' || type === 'FunctionExpression') {
        const asyncAwait = node.async;
        const body = getNodeContent(node);
        if (asyncAwait && checkNodesForAwaitedReset(body)) return true;
        if (checkNodesForReturnedReset(body)) return true;
      }

      return false;
    };

    const checkNodesForReturnedReset = nodes =>
      !!find(
        node =>
          node.type === 'ReturnStatement' &&
          get('argument.callee.name')(node) === 'resetAll'
      )(nodes);

    const checkNodesForAwaitedReset = nodes =>
      !!find(
        node =>
          node.type === 'ExpressionStatement' &&
          get('expression.type')(node) === 'AwaitExpression' &&
          get('expression.argument.callee.name')(node) === 'resetAll'
      )(nodes);

    const checkNodeForAfterWithReset = node => {
      const body = getNodeContent(node);
      const validAfterAllExpressions = body.filter(
        node =>
          node.type === 'ExpressionStatement' &&
          get('expression.type')(node) === 'CallExpression' &&
          ['afterAll', 'afterEach'].includes(
            get('expression.callee.name')(node)
          ) &&
          hasResetArgumentOrCall(node.expression.arguments)
      );
      if (validAfterAllExpressions.length > 0) return true;
    };

    const checkNodeForTestContent = node => {
      const body = getNodeContent(node);
      const expressions = body.filter(
        bodyNode =>
          bodyNode.type === 'ExpressionStatement' &&
          get('expression.type')(bodyNode) === 'CallExpression' &&
          ['beforeAll', 'beforeEach', 'test', 'it'].includes(
            get('expression.callee.name')(bodyNode)
          )
      );
      if (expressions.length > 0) return true;
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
      return checkNodeForAfterWithReset(describeFunctionBlockStatement);
    };

    const checkDescribeBlockForTestContent = node => {
      const describeFunctionBlockStatement = get(
        'expression.arguments[1].body',
        node
      );
      return checkNodeForTestContent(describeFunctionBlockStatement);
    };

    const checkIfAnyParentHasValidReset = node => {
      if (node.parent.type === 'Program')
        return checkNodeForAfterWithReset(node.parent);
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
          checkDescribeBlockForTestContent(node) &&
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
