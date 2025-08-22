/**
 * oid-utils
 * Simple utilities for working with MongoDB ObjectIds
 */

const { ObjectId } = require('bson');

/**
 * Create a new ObjectId
 * @param {string|number} [value] - Optional value to create ObjectId from
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

module.exports = {
  new: newOid,
  isValid: isValidOid,
  toDate,
  toString
};
