const rules = Object.assign(
  {},
  {
    'enforce-reset-after-all': require('./enforce-reset-after-all'),
    'no-new-date-for-parsing': require('./no-new-date-for-parsing'),
    'reducer-must-handle-switch-organisation': require('./reducer-must-handle-switch-organisation'),
    'no-string-ordering-comparison': require('./no-string-ordering-comparison'),
  }
);

module.exports.rules = rules;

const configure = (list, level) => {
  const r = {};
  Object.keys(list).map(rule => (r['fluidly/' + rule] = level));
  return r;
};

module.exports.configs = {
  recommended: {
    plugins: ['fluidly'],
    rules: configure(rules, 2),
  },
};
