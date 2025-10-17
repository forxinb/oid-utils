/**
 * oid-utils
 * Simple utilities for working with MongoDB ObjectIds
 */

const { ObjectId } = require('bson');

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
 * Create a new ObjectId
 * @param {string|number|ObjectId} [value] - Value to create ObjectId from. Omit to create a fresh ObjectId
 * @param {any} [fallback=null] - Value to return when value is not convertible
 * @returns {ObjectId|any} A new ObjectId instance or fallback
 */
function newOid(value, fallback = null) {
  if (arguments.length === 0) {
    return new ObjectId();
  }
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
 * @param {boolean} [validOnly=true] - If true, skip non-convertible values instead of throwing
 * @returns {ObjectId[]} Array of ObjectId instances
 * @throws {Error} When validOnly=false and non-convertible values are present
 */
function newOids(values = [], validOnly = true) {
  const source = validOnly ? values.filter(canBeOid) : values;
  return source.map((value) => new ObjectId(value));
}

/**
 * Remove duplicate ObjectIds from array
 * Note: Values that are not ObjectId instances in the input array are filtered out and not included in the result.
 * @param {ObjectId[]} [oids=[]] - Array of ObjectId instances
 * @returns {ObjectId[]} Array with unique ObjectId instances preserving first occurrence order
 */
function uniqueOids(oids = []) {
  const seen = new Set();
  const result = [];
  for (const item of oids) {
    if (!isOid(item)) {
      continue;
    }
    const key = `${item}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(item);
  }
  return result;
}

/**
 * Convert ObjectId to Date
 * @param {any} value - Value to convert to Date
 * @param {any} [fallback=null] - Value to return when conversion fails
 * @returns {Date|any} Date object or fallback
 */
function toDate(value, fallback = null) {
  if (!isOid(value)) {
    return fallback;
  }
  return value.getTimestamp();
}

/**
 * Convert value to string using template interpolation
 * 
 * Note: This function converts all values to strings as-is, including null and undefined.
 * If you need different behavior (e.g., null/undefined → fallback), consider using
 * lodash's _.toString() or other string conversion utilities.
 * 
 * @param {any} value - Value to convert to string
 * @returns {string} String representation
 */
function toStr(value) {
  return `${value}`;
}

/**
 * Check if first value is after second value
 * @param {any} value1 - First value to compare
 * @param {any} value2 - Second value to compare
 * @returns {boolean} True if value1 is after value2, false on failure
 */
function isAfter(value1, value2) {
  const date1 = isOid(value1) ? value1.getTimestamp() : value1;
  const date2 = isOid(value2) ? value2.getTimestamp() : value2;
  
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  
  return date1.getTime() > date2.getTime();
}

/**
 * Check if first value is before second value
 * @param {any} value1 - First value to compare
 * @param {any} value2 - Second value to compare
 * @returns {boolean} True if value1 is before value2, false on failure
 */
function isBefore(value1, value2) {
  const date1 = isOid(value1) ? value1.getTimestamp() : value1;
  const date2 = isOid(value2) ? value2.getTimestamp() : value2;
  
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return false;
  }
  
  return date1.getTime() < date2.getTime();
}

module.exports = {
  // Creation functions
  newOid,
  newOids,
  uniqueOids,
  
  // Type checking functions
  canBeOid,
  isOid,
  isSameOid,
  
  // Conversion functions
  toDate,
  toStr,
  
  // Comparison functions
  isAfter,
  isBefore
};
