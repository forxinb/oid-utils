/**
 * Basic usage example for oid-utils
 */

const ou = require('../src/index');

// Create new ObjectId
const newOid = ou.new();
console.log('New ObjectId:', newOid.toString());

// Create ObjectId from string
const oidFromString = ou.new('507f1f77bcf86cd799439011');
console.log('ObjectId from string:', oidFromString.toString());

// Create ObjectId from timestamp number
const timestamp = Math.floor(new Date('2023-01-01T00:00:00.000Z').getTime() / 1000);
const oidFromTimestamp = ou.new(timestamp);
console.log('ObjectId from timestamp:', oidFromTimestamp.toString());

// Validate ObjectId
console.log('Is valid:', ou.isValid('507f1f77bcf86cd799439011'));
console.log('Is valid:', ou.isValid('invalid'));

// Convert ObjectId to Date
const date = ou.toDate(newOid);
console.log('ObjectId timestamp:', date);

// Convert ObjectId to string
const str = ou.toString(newOid);
console.log('ObjectId as string:', str);
