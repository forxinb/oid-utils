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

  describe('ou.isAfter()', () => {
    test('should return true when first ObjectId is after second', () => {
      const timestamp1 = Math.floor(Date.now() / 1000) - 10; // 10초 전
      const timestamp2 = Math.floor(Date.now() / 1000); // 현재
      const oid1 = ou.new(timestamp1);
      const oid2 = ou.new(timestamp2);
      expect(ou.isAfter(oid2, oid1)).toBe(true);
    });

    test('should return false when first ObjectId is before second', () => {
      const oid1 = ou.new();
      const oid2 = ou.new();
      // oid1이 더 이전에 생성되었으므로 false
      expect(ou.isAfter(oid1, oid2)).toBe(false);
    });

    test('should work with Date objects', () => {
      const date1 = new Date('2023-01-02T00:00:00.000Z');
      const date2 = new Date('2023-01-01T00:00:00.000Z');
      expect(ou.isAfter(date1, date2)).toBe(true);
      expect(ou.isAfter(date2, date1)).toBe(false);
    });

    test('should work with mixed ObjectId and Date', () => {
      const oid = ou.new();
      const date = new Date('2020-01-01T00:00:00.000Z');
      expect(ou.isAfter(oid, date)).toBe(true);
      expect(ou.isAfter(date, oid)).toBe(false);
    });

    test('should throw error for invalid arguments', () => {
      expect(() => ou.isAfter('invalid', 'invalid')).toThrow('Arguments must be ObjectId instances or Date objects');
    });
  });

  describe('ou.isBefore()', () => {
    test('should return true when first ObjectId is before second', () => {
      const timestamp1 = Math.floor(Date.now() / 1000) - 10; // 10초 전
      const timestamp2 = Math.floor(Date.now() / 1000); // 현재
      const oid1 = ou.new(timestamp1);
      const oid2 = ou.new(timestamp2);
      expect(ou.isBefore(oid1, oid2)).toBe(true);
    });

    test('should return false when first ObjectId is after second', () => {
      const oid1 = ou.new();
      const oid2 = ou.new();
      // oid2가 더 이전에 생성되었으므로 false
      expect(ou.isBefore(oid2, oid1)).toBe(false);
    });

    test('should work with Date objects', () => {
      const date1 = new Date('2023-01-01T00:00:00.000Z');
      const date2 = new Date('2023-01-02T00:00:00.000Z');
      expect(ou.isBefore(date1, date2)).toBe(true);
      expect(ou.isBefore(date2, date1)).toBe(false);
    });

    test('should work with mixed ObjectId and Date', () => {
      const oid = ou.new();
      const date = new Date('2030-01-01T00:00:00.000Z');
      expect(ou.isBefore(oid, date)).toBe(true);
      expect(ou.isBefore(date, oid)).toBe(false);
    });

    test('should throw error for invalid arguments', () => {
      expect(() => ou.isBefore('invalid', 'invalid')).toThrow('Arguments must be ObjectId instances or Date objects');
    });
  });
});
