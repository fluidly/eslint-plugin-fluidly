const rule = require('../rules').rules;
const ruleTester = require('./ruleTester');

const ErrorMessage =
  'No reset was found in or above this describe function. Must call afterEach(resetAll) or afterAll(resetAll) somewhere in that chain';

const page = children => `
import { resetAll } from 'test/render'
${children}
`;

const describeWithResetFirst = (children = '') => `
  describe('test', () => {
    afterAll(resetAll)
    
    beforeAll(() => {
      // do some setup
    })

    it('does a test', () => {
      expect(true).toBe(true)
    })

    ${children}
  })
`;

const describeWithResetSecond = (children = '') => `
  describe('test', () => {
    beforeEach(() => {
      // do some setup
    })

    afterEach(resetAll)
    
    it('does a test', () => {
      expect(true).toBe(true)
    })

    ${children}
  })
`;

const describeWithoutReset = (children = '') => `
  describe('test', () => {
    it('does a test', () => {
      expect(true).toBe(true)
    })

    ${children}
  })
`;

const valid0 = {
  filename: 'Test1.spec.tsx',
  code: page(`
    afterAll(resetAll)

    ${describeWithoutReset()}
  `),
};

const valid1 = {
  filename: 'Test1.spec.tsx',
  code: page(describeWithResetFirst()),
};

const valid2 = {
  filename: 'Test1.spec.tsx',
  code: page(describeWithResetSecond()),
};

const valid3 = {
  filename: 'Test1.spec.tsx',
  code: page(describeWithResetFirst(describeWithoutReset())),
};

const valid4 = {
  filename: 'Test1.spec.tsx',
  code: page(`
    afterAll(async () => {
      await resetAll()
    })
    ${describeWithoutReset()}
  `),
};

const valid5 = {
  filename: 'Test1.spec.tsx',
  code: page(`
    afterAll(() => {
      return resetAll()
    })
    ${describeWithoutReset()}
  `),
};

const valid6 = {
  filename: 'Test1.spec.tsx',
  code: page(`
    afterAll(function () {
      return resetAll()
    })
    ${describeWithoutReset()}
  `),
};

const invalid0 = {
  filename: 'Test1.spec.tsx',
  code: page(describeWithoutReset()),
  errors: [
    {
      message:
        'No reset was found in or above this describe function. Must call afterEach(resetAll) or afterAll(resetAll) somewhere in that chain',
      type: 'ExpressionStatement',
    },
  ],
};

const invalid1 = {
  filename: 'Test1.spec.tsx',
  code: page(describeWithoutReset(describeWithResetFirst())),
  errors: [
    {
      message: ErrorMessage,
      type: 'ExpressionStatement',
    },
  ],
};

const invalid2 = {
  filename: 'Test1.spec.tsx',
  code: page(`
    afterAll(() => {
      resetAll()
    })
    ${describeWithoutReset()}
  `),
  errors: [
    {
      message: ErrorMessage,
      type: 'ExpressionStatement',
    },
  ],
};

describe('enforce-reset-after-all', () => {
  ruleTester.run('enforce-reset-after-all', rule['enforce-reset-after-all'], {
    valid: [valid0, valid1, valid2, valid3, valid4, valid5, valid6],
    invalid: [invalid0, invalid1, invalid2],
  });
});
