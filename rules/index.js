const rules = Object.assign(
  {},
  {
    'no-new-date-for-parsing': require('./no-new-date-for-parsing'),
    'reducer-must-handle-switch-organisation': require('./reducer-must-handle-switch-organisation'),
  }
)

module.exports.rules = rules

const configure = (list, level) => {
  const r = {}
  Object.keys(list).map(rule => (r['fluidly/' + rule] = level))
  return r
}

module.exports.configs = {
  recommended: {
    plugins: ['fluidly'],
    rules: configure(rules, 2),
  },
}
