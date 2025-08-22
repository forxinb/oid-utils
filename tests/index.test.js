/**
 * Tests for oid-utils
 */

const ou = require('../src/index');

describe('oid-utils', () => {
  describe('ou.new()', () => {
    test('should create new ObjectId without parameters', () => {
      const oid = ou.new();
      expect(oid).toBeDefined();
      expect(typeof oid.toString()).toBe('string');
      expect(oid.toString()).toHaveLength(24);
    });

    test('should create ObjectId from string', () => {
      const testString = '507f1f77bcf86cd799439011';
      const oid = ou.new(testString);
      expect(oid.toString()).toBe(testString);
    });

    test('should create ObjectId from timestamp number', () => {
      const testTimestamp = Math.floor(new Date('2023-01-01T00:00:00.000Z').getTime() / 1000);
      const oid = ou.new(testTimestamp);
      expect(ou.toDate(oid).getTime()).toBe(testTimestamp * 1000);
    });
  });

  describe('ou.isValid()', () => {
    test('should return true for valid ObjectId string', () => {
      expect(ou.isValid('507f1f77bcf86cd799439011')).toBe(true);
    });

    test('should return false for invalid string', () => {
      expect(ou.isValid('invalid')).toBe(false);
      expect(ou.isValid('123')).toBe(false);
      expect(ou.isValid('')).toBe(false);
    });
  });

  describe('ou.toDate()', () => {
    test('should convert ObjectId to Date', () => {
      const oid = ou.new();
      const date = ou.toDate(oid);
      expect(date).toBeInstanceOf(Date);
    });

    test('should throw error for non-ObjectId', () => {
      expect(() => ou.toDate('invalid')).toThrow('Argument must be an ObjectId instance');
    });
  });

  describe('ou.toString()', () => {
    test('should convert ObjectId to string', () => {
      const oid = ou.new();
      const str = ou.toString(oid);
      expect(typeof str).toBe('string');
      expect(str).toHaveLength(24);
    });

    test('should throw error for non-ObjectId', () => {
      expect(() => ou.toString('invalid')).toThrow('Argument must be an ObjectId instance');
    });
  });
});
