"use strict"

module.exports = {
  create: context => ({
    NewExpression: node => {
      if (node.callee.name === "Date" && node.arguments.length === 1) {
        context.report(
          node,
          "Don't use new Date(dateString), use dateFns.parseISO(dateString) instead"
        )
      }
    }
  }),
  meta: {
    docs: {
      description:
        "Don't use new Date(dateString), use dateFns.parseISO(dateString) instead"
    },
    type: "problem"
  }
}
