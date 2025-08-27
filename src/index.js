/**
 * oid-utils
 * Simple utilities for working with MongoDB ObjectIds
 */

const { ObjectId } = require('bson');

/**
 * Create a new ObjectId
 * @param {string|number|ObjectId} [value] - Optional value to create ObjectId from
 * @returns {ObjectId} A new ObjectId instance
 */
function newOid(value) {
  if (value === undefined) {
    return new ObjectId();
  }
  return new ObjectId(value);
}

/**
 * Check if a value is a valid ObjectId
 * @param {any} value - Value to check
 * @returns {boolean} True if valid ObjectId
 */
function isValidOid(value) {
  return ObjectId.isValid(value);
}

/**
 * Convert ObjectId to Date
 * @param {ObjectId} oid - ObjectId instance
 * @returns {Date} Date object
 */
function toDate(oid) {
  if (!(oid instanceof ObjectId)) {
    throw new Error('Argument must be an ObjectId instance');
  }
  return oid.getTimestamp();
}

/**
 * Convert ObjectId to string
 * @param {ObjectId} oid - ObjectId instance
 * @returns {string} String representation
 */
function toString(oid) {
  if (!(oid instanceof ObjectId)) {
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
  const date1 = value1 instanceof ObjectId ? value1.getTimestamp() : value1;
  const date2 = value2 instanceof ObjectId ? value2.getTimestamp() : value2;
  
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
  const date1 = value1 instanceof ObjectId ? value1.getTimestamp() : value1;
  const date2 = value2 instanceof ObjectId ? value2.getTimestamp() : value2;
  
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new Error('Arguments must be ObjectId instances or Date objects');
  }
  
  return date1.getTime() < date2.getTime();
}

module.exports = {
  new: newOid,
  isValid: isValidOid,
  toDate,
  toString,
  isAfter,
  isBefore
};
