/**
 * Basic usage example for oid-utils
 */

const ou = require('../src/index');

// Create new ObjectId
const newOid = ou.newOid();
console.log('New ObjectId:', newOid.toString());

// Create ObjectId from string (safe by default)
const oidFromString = ou.newOid('507f1f77bcf86cd799439011');
console.log('ObjectId from string:', oidFromString.toString());

// Create ObjectId from timestamp number
const timestamp = Math.floor(new Date('2023-01-01T00:00:00.000Z').getTime() / 1000);
const oidFromTimestamp = ou.newOid(timestamp, { suppressFallback: true });
console.log('ObjectId from timestamp:', oidFromTimestamp.toString());

// Create ObjectId from existing ObjectId (returns the same instance)
const existingOid = ou.newOid('507f1f77bcf86cd799439011');
const sameOid = ou.newOid(existingOid);
console.log('Same ObjectId instance:', sameOid === existingOid); // true
console.log('ObjectId from existing ObjectId:', sameOid.toString());

// Validate ObjectId
console.log('Can be ObjectId:', ou.canBeOid('507f1f77bcf86cd799439011'));
console.log('Can be ObjectId:', ou.canBeOid('invalid'));

// Convert ObjectId to Date
const date = ou.toDate(newOid);
console.log('ObjectId timestamp:', date);

// Convert ObjectId to string
const str = ou.toString(newOid);
console.log('ObjectId as string:', str);

// Compare ObjectIds
const oid1 = ou.newOid();
const oid2 = ou.newOid();
console.log('oid1 is after oid2:', ou.isAfter(oid1, oid2));
console.log('oid1 is before oid2:', ou.isBefore(oid1, oid2));

// Compare with Date
const pastDate = new Date('2020-01-01T00:00:00.000Z');
const futureDate = new Date('2030-01-01T00:00:00.000Z');
console.log('oid1 is after past date:', ou.isAfter(oid1, pastDate));
console.log('oid1 is before future date:', ou.isBefore(oid1, futureDate));
