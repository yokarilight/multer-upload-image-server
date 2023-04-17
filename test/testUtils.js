const assert = require('assert');
const { isNaturalNumber, isValidFrom } = require('../utils/utils');

describe('Utils', () => {
  describe('isNaturalNumber', () => {
    it('should return true for natural number', () => {
      assert.strictEqual(isNaturalNumber(1), true);
      assert.strictEqual(isNaturalNumber(10), true);
      assert.strictEqual(isNaturalNumber(100), true);
    });

    it('should return false for non-natural numbers', () => {
      assert.strictEqual(isNaturalNumber(0), false);
      assert.strictEqual(isNaturalNumber(-1), false);
      assert.strictEqual(isNaturalNumber(1.23), false);
      assert.strictEqual(isNaturalNumber(NaN), false);
      assert.strictEqual(isNaturalNumber(Infinity), false);
    });

    it('should return false for non-numeric inputs', () => {
      assert.strictEqual(isNaturalNumber(undefined), false);
      assert.strictEqual(isNaturalNumber(null), false);
      assert.strictEqual(isNaturalNumber({}), false);
      assert.strictEqual(isNaturalNumber([]), false);
      assert.strictEqual(isNaturalNumber(function() {}), false);
      assert.strictEqual(isNaturalNumber('foo'), false);
      assert.strictEqual(isNaturalNumber(''), false);
    });
  });

  describe('isValidFrom', () => {
    it('should return true for natural number and zero', () => {
      assert.strictEqual(isValidFrom(0), true);
      assert.strictEqual(isValidFrom(1), true);
      assert.strictEqual(isValidFrom(10), true);
      assert.strictEqual(isValidFrom(100), true);
    });

    it('should return false for non-natural numbers except zero', () => {
      assert.strictEqual(isValidFrom(-1), false);
      assert.strictEqual(isValidFrom(1.23), false);
      assert.strictEqual(isValidFrom(NaN), false);
      assert.strictEqual(isValidFrom(Infinity), false);
    });

    it('should return false for non-numeric inputs', () => {
      assert.strictEqual(isValidFrom(undefined), false);
      assert.strictEqual(isValidFrom(null), false);
      assert.strictEqual(isValidFrom({}), false);
      assert.strictEqual(isValidFrom([]), false);
      assert.strictEqual(isValidFrom(function() {}), false);
      assert.strictEqual(isValidFrom('foo'), false);
      assert.strictEqual(isValidFrom(''), false);
    });
  });
});
