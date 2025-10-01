/**
 * oid-utils
 * Simple utilities for working with MongoDB ObjectIds
 */

const { ObjectId } = require('bson');

/**
 * Create a new ObjectId
 *
 * Behavior:
 * - No arguments → returns a fresh ObjectId
 * - When suppressFallback === false (default, "safe" mode):
 *   - Falsy handling: undefined, null, '' are treated as invalid and return fallback
 *   - Validity handling: if canBeOid(value) is false, returns fallback
 *   - Note: 0 and NaN are considered convertible by BSON (timestamp semantics)
 * - When suppressFallback === true ("unsafe" mode):
 *   - Always attempts new ObjectId(value); errors will throw
 *
 * Guidance for 0 / NaN:
 * - If you intentionally want epoch-based ObjectIds from 0/NaN, either use new ObjectId(0|NaN)
 *   or call newOid(0|NaN, { suppressFallback: true }) to bypass safe checks.
 *
 * @param {string|number|ObjectId} [value] - Value to create ObjectId from. Omit to create a fresh ObjectId
 * @param {{ fallback?: any, suppressFallback?: boolean }} [options] - Options
 * @param {any} [options.fallback=null] - Value to return when value is not convertible (only when suppressFallback=false)
 * @param {boolean} [options.suppressFallback=false] - If true, throw on invalid instead of returning fallback
 * @returns {ObjectId|any} A new ObjectId instance or fallback
 */
function newOid(value, options = {}) {
  const { fallback = null, suppressFallback = false } = options;
  // No arguments: generate a fresh ObjectId
  if (arguments.length === 0) {
    return new ObjectId();
  }
  if (suppressFallback) {
    return new ObjectId(value);
  }
  // Treat undefined, null, and empty string as invalid in fallback mode
  if (value === undefined || value === null || value === '') {
    return fallback;
  }
  if (!canBeOid(value)) {
    return fallback;
  }
  return new ObjectId(value);
}

/**
 * Create multiple ObjectIds from array of values
 * @param {any[]} [values=[]] - Array of values to create ObjectIds from
 * @param {{ validOnly?: boolean }} [options] - Options
 * @param {boolean} [options.validOnly=true] - If true, skip non-convertible values instead of throwing
 * @returns {ObjectId[]} Array of ObjectId instances
 */
function newOids(values = [], options = {}) {
  const { validOnly = true } = options;
  const source = validOnly ? values.filter(canBeOid) : values;
  return source.map((value) => new ObjectId(value));
}

/**
 * Remove duplicates from an ObjectId array (by string interpolation key)
 * Note: Non-ObjectId values, if present, are also deduped by their interpolated string and preserved.
 * @param {ObjectId[]} [oids=[]] - Array of ObjectId instances
 * @returns {any[]} Array with unique values preserving first occurrence order (ObjectId[] when input is ObjectId-only)
 */
function unique(oids = []) {
  const seen = new Set();
  const result = [];
  for (const item of oids) {
    const key = `${item}`; // avoids direct toString() calls
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }
  return result;
}


/**
 * Check if a value can be converted to ObjectId
 * @param {any} value - Value to check
 * @returns {boolean} True if can be converted to ObjectId
 */
function canBeOid(value) {
  return ObjectId.isValid(value);
}

/**
 * Check if a value is a valid ObjectId instance
 * @param {any} value - Value to check
 * @returns {boolean} True if value is a valid ObjectId instance
 */
function isOid(value) {
  return value instanceof ObjectId;
}

/**
 * Check if two values are the same ObjectId
 * @param {any} value1 - First value to compare
 * @param {any} value2 - Second value to compare
 * @returns {boolean} True if both are ObjectId instances with the same value
 */
function isSameOid(value1, value2) {
  if (!isOid(value1) || !isOid(value2)) {
    return false;
  }
  return value1.equals(value2);
}

/**
 * Convert ObjectId to Date
 * @param {ObjectId} oid - ObjectId instance
 * @returns {Date} Date object
 */
function toDate(oid) {
  if (!isOid(oid)) {
    throw new Error('Argument must be an ObjectId instance');
  }
  // getTimestamp() returns Date object
  return oid.getTimestamp();
}

/**
 * Convert ObjectId to string
 * @param {ObjectId} oid - ObjectId instance
 * @returns {string} String representation
 */
function toString(oid) {
  if (!isOid(oid)) {
    throw new Error('Argument must be an ObjectId instance');
  }
  return oid.toString();
}

/**
 * Check if first value is after second value
 * @param {ObjectId|Date} value1 - First value to compare
 * @param {ObjectId|Date} value2 - Second value to compare
 * @returns {boolean} True if value1 is after value2
 */
function isAfter(value1, value2) {
  const date1 = isOid(value1) ? value1.getTimestamp() : value1;
  const date2 = isOid(value2) ? value2.getTimestamp() : value2;
  
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Arguments must be ObjectId instances or Date objects');
  }
  
  return date1.getTime() > date2.getTime();
}

/**
 * Check if first value is before second value
 * @param {ObjectId|Date} value1 - First value to compare
 * @param {ObjectId|Date} value2 - Second value to compare
 * @returns {boolean} True if value1 is before value2
 */
function isBefore(value1, value2) {
  const date1 = isOid(value1) ? value1.getTimestamp() : value1;
  const date2 = isOid(value2) ? value2.getTimestamp() : value2;
  
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Arguments must be ObjectId instances or Date objects');
  }
  
  return date1.getTime() < date2.getTime();
}

module.exports = {
  newOid,
  newOids,
  unique,
  canBeOid,
  isOid,
  isSameOid,
  toDate,
  toString,
  isAfter,
  isBefore
};
