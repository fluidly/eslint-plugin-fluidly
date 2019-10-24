const rules = Object.assign(
  {},
  {
    'no-new-date-for-parsing': require('./no-new-date-for-parsing'),
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
    rules: configure(rules, 1),
  },
};
