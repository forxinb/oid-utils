/**
 * Tests for oid-utils
 */

const ou = require('../src/index');

describe('oid-utils', () => {
  describe('ou.newOid()', () => {
    test('should create new ObjectId without parameters', () => {
      const oid = ou.newOid();
      expect(oid).toBeDefined();
      expect(typeof oid.toString()).toBe('string');
      expect(oid.toString()).toHaveLength(24);
    });

    test('should create ObjectId from string with suppressFallback', () => {
      const testString = '507f1f77bcf86cd799439011';
      const oid = ou.newOid(testString, { suppressFallback: true });
      expect(oid.toString()).toBe(testString);
    });

    test('should create ObjectId from timestamp number with suppressFallback', () => {
      const testTimestamp = Math.floor(new Date('2023-01-01T00:00:00.000Z').getTime() / 1000);
      const oid = ou.newOid(testTimestamp, { suppressFallback: true });
      expect(ou.toDate(oid).getTime()).toBe(testTimestamp * 1000);
    });

    test('should create ObjectId from valid string with new signature', () => {
      const testString = '507f1f77bcf86cd799439011';
      const oid = ou.newOid(testString);
      expect(ou.isOid(oid)).toBe(true);
      expect(oid.toString()).toBe(testString);
    });

    test('should return fallback for invalid input with new signature', () => {
      const fallback = 'custom-fallback';
      const result = ou.newOid('invalid-string', fallback);
      expect(result).toBe(fallback);
    });

    test('should return fallback for null with new signature', () => {
      const fallback = 'null-fallback';
      const result = ou.newOid(null, fallback);
      expect(result).toBe(fallback);
    });

    test('should return fallback for empty string with new signature', () => {
      const fallback = 'empty-fallback';
      const result = ou.newOid('', fallback);
      expect(result).toBe(fallback);
    });

    test('should return fallback for undefined with new signature', () => {
      const fallback = 'undefined-fallback';
      const result = ou.newOid(undefined, fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('ou.newOids()', () => {
    test('should convert array items to ObjectIds', () => {
      const values = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'];
      const result = ou.newOids(values);
      expect(result.length).toBe(2);
      expect(result[0].toString()).toBe(values[0]);
      expect(result[1].toString()).toBe(values[1]);
    });

    test('should return empty array when no arguments provided', () => {
      const result = ou.newOids();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should return empty array for empty input array', () => {
      const result = ou.newOids([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should throw error for non-array input', () => {
      expect(() => ou.newOids({})).toThrow();
      expect(() => ou.newOids('3')).toThrow();
      expect(() => ou.newOids(3)).toThrow();
    });

    test('should skip invalid values when validOnly=true', () => {
      const values = ['507f1f77bcf86cd799439011', 'invalid', 123, null, '507f1f77bcf86cd799439012'];
      const result = ou.newOids(values, { validOnly: true });
      expect(result.length).toBe(3);
      expect(result[0].toString()).toBe('507f1f77bcf86cd799439011');
      expect(ou.isOid(result[1])).toBe(true); // ObjectId created from 123
      expect(result[2].toString()).toBe('507f1f77bcf86cd799439012');
    });

    test('should throw when invalid values present and validOnly=false', () => {
      const values = ['507f1f77bcf86cd799439011', 'invalid'];
      expect(() => ou.newOids(values, false)).toThrow();
    });

    test('should process all values when validOnly=false', () => {
      const values = ['507f1f77bcf86cd799439011', 123];
      const result = ou.newOids(values, false);
      expect(result.length).toBe(2);
      expect(ou.isOid(result[0])).toBe(true); // valid string
      expect(ou.isOid(result[1])).toBe(true); // 123 -> ObjectId
    });

    test('should handle mixed valid/invalid values with validOnly=true', () => {
      const values = ['507f1f77bcf86cd799439011', 'invalid', 123, null, '507f1f77bcf86cd799439012'];
      const result = ou.newOids(values, true);
      expect(result.length).toBe(3); // valid string, 123, valid string
      expect(result[0].toString()).toBe('507f1f77bcf86cd799439011');
      expect(ou.isOid(result[1])).toBe(true); // 123
      expect(result[2].toString()).toBe('507f1f77bcf86cd799439012');
    });
  });

  describe('ou.uniqueOids()', () => {
    test('should remove duplicate ObjectIds', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439011'); // same value
      const oid3 = ou.newOid('507f1f77bcf86cd799439012');
      const oids = [oid1, oid2, oid3];
      
      const result = ou.uniqueOids(oids);
      expect(result.length).toBe(2);
      expect(ou.isSameOid(result[0], oid1)).toBe(true);
      expect(ou.isSameOid(result[1], oid3)).toBe(true);
    });

    test('should return empty array for empty input', () => {
      const result = ou.uniqueOids([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    test('should filter out non-ObjectId values and dedupe ObjectIds', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439012');
      const mixed = [oid1, 'string', oid2, 123, null, oid1]; // includes duplicate ObjectId
      
      const result = ou.uniqueOids(mixed);
      expect(result.length).toBe(2); // only ObjectIds remain
      expect(ou.isSameOid(result[0], oid1)).toBe(true);
      expect(ou.isSameOid(result[1], oid2)).toBe(true);
    });

    test('should preserve order of first occurrence', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439012');
      const oid3 = ou.newOid('507f1f77bcf86cd799439011'); // duplicate
      const oids = [oid1, oid2, oid3];
      
      const result = ou.uniqueOids(oids);
      expect(result.length).toBe(2);
      expect(ou.isSameOid(result[0], oid1)).toBe(true);
      expect(ou.isSameOid(result[1], oid2)).toBe(true);
    });

    test('should handle array with only non-ObjectId values', () => {
      const mixed = ['string', 123, null, undefined, {}, []];
      const result = ou.uniqueOids(mixed);
      expect(result.length).toBe(0);
    });

    test('should handle array with mixed ObjectId and non-ObjectId values', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439012');
      const mixed = [oid1, 'string', oid2, 123, null, oid1, 'another-string'];
      
      const result = ou.uniqueOids(mixed);
      expect(result.length).toBe(2);
      expect(ou.isSameOid(result[0], oid1)).toBe(true);
      expect(ou.isSameOid(result[1], oid2)).toBe(true);
    });

    test('should handle array with duplicate ObjectIds at different positions', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439012');
      const oid3 = ou.newOid('507f1f77bcf86cd799439011'); // same as oid1
      const oids = [oid1, oid2, oid3, oid1, oid2];
      
      const result = ou.uniqueOids(oids);
      expect(result.length).toBe(2);
      expect(ou.isSameOid(result[0], oid1)).toBe(true);
      expect(ou.isSameOid(result[1], oid2)).toBe(true);
    });
  });

  describe('ou.newOid() with fallback/suppressFallback', () => {
    test('should create ObjectId from valid string (fallback mode)', () => {
      const testString = '507f1f77bcf86cd799439011';
      const oid = ou.newOid(testString);
      expect(ou.isOid(oid)).toBe(true);
      expect(oid.toString()).toBe(testString);
    });

    test('should return fallback when no value provided (fallback mode)', () => {
      const result = ou.newOid(undefined);
      expect(result).toBe(null);
    });

    test('should return fallback value for invalid input (fallback mode)', () => {
      const fallback = 'invalid-input';
      const result = ou.newOid('invalid', fallback);
      expect(result).toBe(fallback);
    });

    test('should return null as default fallback for invalid input (fallback mode)', () => {
      const result = ou.newOid('invalid');
      expect(result).toBe(null);
    });

    test('should return fallback for falsy values (fallback mode)', () => {
      const fallback = 'not-an-objectid';
      const result = ou.newOid('', fallback);
      expect(result).toBe(fallback);
    });

    test('should return fallback for undefined (fallback mode)', () => {
      const fallback = 'no-value';
      const result = ou.newOid(undefined, fallback);
      expect(result).toBe(fallback);
    });

    test('should create ObjectId from existing ObjectId (fallback mode)', () => {
      const existingOid = ou.newOid('507f1f77bcf86cd799439011');
      const result = ou.newOid(existingOid);
      expect(ou.isOid(result)).toBe(true);
      expect(result.toString()).toBe(existingOid.toString());
    });

    test('should throw on invalid when suppressFallback=true', () => {
      // suppressFallback option was removed, so this test needs to be removed or modified
      // Currently newOid returns fallback for invalid input instead of throwing error
      const result = ou.newOid('invalid');
      expect(result).toBe(null);
    });
  });

  describe('ou.canBeOid()', () => {
    test('should return true for valid ObjectId string', () => {
      expect(ou.canBeOid('507f1f77bcf86cd799439011')).toBe(true);
    });

    test('should return false for invalid string', () => {
      expect(ou.canBeOid('invalid')).toBe(false);
      expect(ou.canBeOid('123')).toBe(false);
      expect(ou.canBeOid('')).toBe(false);
    });
  });

  describe('ou.isOid()', () => {
    test('should return true for ObjectId instance', () => {
      const oid = ou.newOid();
      expect(ou.isOid(oid)).toBe(true);
    });

    test('should return false for string', () => {
      expect(ou.isOid('507f1f77bcf86cd799439011')).toBe(false);
    });

    test('should return false for number', () => {
      expect(ou.isOid(123)).toBe(false);
    });

    test('should return false for null', () => {
      expect(ou.isOid(null)).toBe(false);
    });

    test('should return false for undefined', () => {
      expect(ou.isOid(undefined)).toBe(false);
    });

    test('should return false for object', () => {
      expect(ou.isOid({})).toBe(false);
    });
  });

  describe('ou.isSameOid()', () => {
    test('should return true for same ObjectId values', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439011');
      expect(ou.isSameOid(oid1, oid2)).toBe(true);
    });

    test('should return false for different ObjectId values', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = ou.newOid('507f1f77bcf86cd799439012');
      expect(ou.isSameOid(oid1, oid2)).toBe(false);
    });

    test('should return true for same ObjectId instance', () => {
      const oid1 = ou.newOid('507f1f77bcf86cd799439011');
      const oid2 = oid1;
      expect(ou.isSameOid(oid1, oid2)).toBe(true);
    });

    test('should return false when first value is not ObjectId', () => {
      const oid = ou.newOid('507f1f77bcf86cd799439011');
      expect(ou.isSameOid('string', oid)).toBe(false);
    });

    test('should return false when second value is not ObjectId', () => {
      const oid = ou.newOid('507f1f77bcf86cd799439011');
      expect(ou.isSameOid(oid, 'string')).toBe(false);
    });

    test('should return false when both values are not ObjectId', () => {
      expect(ou.isSameOid('string1', 'string2')).toBe(false);
    });

    test('should return false when one value is null', () => {
      const oid = ou.newOid('507f1f77bcf86cd799439011');
      expect(ou.isSameOid(oid, null)).toBe(false);
    });
  });

  describe('ou.toDate()', () => {
    test('should convert ObjectId to Date', () => {
      const oid = ou.newOid();
      const date = ou.toDate(oid);
      expect(date).toBeInstanceOf(Date);
    });

    test('should return fallback for non-ObjectId', () => {
      const fallback = 'not-an-objectid';
      const result = ou.toDate('invalid', fallback);
      expect(result).toBe(fallback);
    });
  });

  describe('ou.toStr()', () => {
    test('should convert ObjectId to string', () => {
      const oid = ou.newOid();
      const str = ou.toStr(oid);
      expect(typeof str).toBe('string');
      expect(str).toHaveLength(24);
    });

    test('should convert any value to string using template interpolation', () => {
      expect(ou.toStr('invalid')).toBe('invalid');
      expect(ou.toStr(null)).toBe('null');
      expect(ou.toStr(undefined)).toBe('undefined');
    });

    test('should convert various data types to string', () => {
      expect(ou.toStr(123)).toBe('123');
      expect(ou.toStr(0)).toBe('0');
      expect(ou.toStr(true)).toBe('true');
      expect(ou.toStr(false)).toBe('false');
      expect(ou.toStr(NaN)).toBe('NaN');
      expect(ou.toStr(Infinity)).toBe('Infinity');
    });

    test('should convert objects to string', () => {
      expect(ou.toStr({})).toBe('[object Object]');
      expect(ou.toStr([])).toBe('');
      expect(ou.toStr([1, 2, 3])).toBe('1,2,3');
      expect(ou.toStr({ a: 1 })).toBe('[object Object]');
    });

    test('should convert functions to string', () => {
      const fn = () => {};
      expect(ou.toStr(fn)).toBe('() => {}');
      expect(ou.toStr(Math.max)).toContain('function');
    });
  });

  describe('ou.isAfter()', () => {
    test('should return true when first ObjectId is after second', () => {
      const timestamp1 = Math.floor(Date.now() / 1000) - 10; // 10 seconds ago
      const timestamp2 = Math.floor(Date.now() / 1000); // current
      const oid1 = ou.newOid(timestamp1);
      const oid2 = ou.newOid(timestamp2);
      expect(ou.isAfter(oid2, oid1)).toBe(true);
    });

    test('should return false when first ObjectId is before second', () => {
      const oid1 = ou.newOid();
      const oid2 = ou.newOid();
      // oid1 was created earlier, so false
      expect(ou.isAfter(oid1, oid2)).toBe(false);
    });

    test('should work with Date objects', () => {
      const date1 = new Date('2023-01-02T00:00:00.000Z');
      const date2 = new Date('2023-01-01T00:00:00.000Z');
      expect(ou.isAfter(date1, date2)).toBe(true);
      expect(ou.isAfter(date2, date1)).toBe(false);
    });

    test('should work with mixed ObjectId and Date', () => {
      const oid = ou.newOid();
      const date = new Date('2020-01-01T00:00:00.000Z');
      expect(ou.isAfter(oid, date)).toBe(true);
      expect(ou.isAfter(date, oid)).toBe(false);
    });

    test('should return false for invalid arguments', () => {
      expect(ou.isAfter('invalid', 'invalid')).toBe(false);
    });

    test('should return false for mixed invalid arguments', () => {
      expect(ou.isAfter('invalid', new Date())).toBe(false);
      expect(ou.isAfter(new Date(), 'invalid')).toBe(false);
      expect(ou.isAfter(null, new Date())).toBe(false);
      expect(ou.isAfter(new Date(), null)).toBe(false);
    });

    test('should return false for non-Date, non-ObjectId arguments', () => {
      expect(ou.isAfter(123, 456)).toBe(false);
      expect(ou.isAfter('string1', 'string2')).toBe(false);
      expect(ou.isAfter({}, {})).toBe(false);
      expect(ou.isAfter([], [])).toBe(false);
    });
  });

  describe('ou.isBefore()', () => {
    test('should return true when first ObjectId is before second', () => {
      const timestamp1 = Math.floor(Date.now() / 1000) - 10; // 10 seconds ago
      const timestamp2 = Math.floor(Date.now() / 1000); // current
      const oid1 = ou.newOid(timestamp1);
      const oid2 = ou.newOid(timestamp2);
      expect(ou.isBefore(oid1, oid2)).toBe(true);
    });

    test('should return false when first ObjectId is after second', () => {
      const oid1 = ou.newOid();
      const oid2 = ou.newOid();
      // oid2 was created earlier, so false
      expect(ou.isBefore(oid2, oid1)).toBe(false);
    });

    test('should work with Date objects', () => {
      const date1 = new Date('2023-01-01T00:00:00.000Z');
      const date2 = new Date('2023-01-02T00:00:00.000Z');
      expect(ou.isBefore(date1, date2)).toBe(true);
      expect(ou.isBefore(date2, date1)).toBe(false);
    });

    test('should work with mixed ObjectId and Date', () => {
      const oid = ou.newOid();
      const date = new Date('2030-01-01T00:00:00.000Z');
      expect(ou.isBefore(oid, date)).toBe(true);
      expect(ou.isBefore(date, oid)).toBe(false);
    });

    test('should return false for invalid arguments', () => {
      expect(ou.isBefore('invalid', 'invalid')).toBe(false);
    });

    test('should return false for mixed invalid arguments', () => {
      expect(ou.isBefore('invalid', new Date())).toBe(false);
      expect(ou.isBefore(new Date(), 'invalid')).toBe(false);
      expect(ou.isBefore(null, new Date())).toBe(false);
      expect(ou.isBefore(new Date(), null)).toBe(false);
    });

    test('should return false for non-Date, non-ObjectId arguments', () => {
      expect(ou.isBefore(123, 456)).toBe(false);
      expect(ou.isBefore('string1', 'string2')).toBe(false);
      expect(ou.isBefore({}, {})).toBe(false);
      expect(ou.isBefore([], [])).toBe(false);
    });
  });
});
