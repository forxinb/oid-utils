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
const oidFromTimestamp = ou.newOid(timestamp);
console.log('ObjectId from timestamp:', oidFromTimestamp.toString());

// Create ObjectId from existing ObjectId (returns the same instance)
const existingOid = ou.newOid('507f1f77bcf86cd799439011');
const sameOid = ou.newOid(existingOid);
console.log('Same ObjectId instance:', sameOid === existingOid); // true
console.log('ObjectId from existing ObjectId:', sameOid.toString());

// Check ObjectId types
console.log('Can be ObjectId:', ou.canBeOid('507f1f77bcf86cd799439011'));
console.log('Can be ObjectId:', ou.canBeOid('invalid'));
console.log('Is ObjectId instance:', ou.isOid(oidFromString));
console.log('Is ObjectId instance:', ou.isOid('507f1f77bcf86cd799439011'));

// Check if two ObjectIds are the same
const sameOid1 = ou.newOid('507f1f77bcf86cd799439011');
const sameOid2 = ou.newOid('507f1f77bcf86cd799439011');
console.log('Same ObjectId values:', ou.isSameOid(sameOid1, sameOid2));

// Convert ObjectId to Date (with fallback)
const date = ou.toDate(newOid, 'not-a-date');
console.log('ObjectId timestamp:', date);
const invalidDate = ou.toDate('invalid', 'fallback-date');
console.log('Invalid input fallback:', invalidDate);

// Convert ObjectId to string (template interpolation)
const str = ou.toStr(newOid);
console.log('ObjectId as string:', str);
const anyStr = ou.toStr(null);
console.log('Any value to string:', anyStr);

// Compare ObjectIds
const oid1 = ou.newOid();
const oid2 = ou.newOid();
console.log('oid1 is after oid2:', ou.isAfter(oid1, oid2));
console.log('oid1 is before oid2:', ou.isBefore(oid1, oid2));

// Compare with invalid inputs (returns false)
console.log('Invalid comparison:', ou.isAfter('invalid', 'invalid'));
console.log('Mixed invalid comparison:', ou.isAfter(oid1, 'invalid'));

// Compare with Date
const pastDate = new Date('2020-01-01T00:00:00.000Z');
const futureDate = new Date('2030-01-01T00:00:00.000Z');
console.log('oid1 is after past date:', ou.isAfter(oid1, pastDate));
console.log('oid1 is before future date:', ou.isBefore(oid1, futureDate));

// Batch create ObjectIds
const values = ['507f1f77bcf86cd799439011', 'invalid', 123, null];
const manyOids = ou.newOids(values); // skips invalid by default
console.log('Batch created (validOnly=true):', manyOids.length);

// Unique ObjectIds
const duplicateOids = [oid1, oid2, ou.newOid('507f1f77bcf86cd799439011')];
const uniqueOidsResult = ou.uniqueOids(duplicateOids);
console.log('Unique ObjectIds:', uniqueOidsResult.length);

// Fallback usage (practical scenarios)
console.log('\n=== Fallback Usage ===');
const dbId = undefined; // from database
const safeOid = ou.newOid(dbId, ou.newOid()); // fallback to new ObjectId
console.log('Safe ObjectId from undefined:', safeOid.toString());

const emptyId = '';
const fallbackOid = ou.newOid(emptyId, 'no-id');
console.log('Fallback for empty string:', fallbackOid);

// newOids with validOnly=false (throws on invalid)
console.log('\n=== newOids validOnly=false ===');
try {
  const strictOids = ou.newOids(['507f1f77bcf86cd799439011', 'invalid'], false);
  console.log('Strict mode result:', strictOids.length);
} catch (error) {
  console.log('Strict mode error:', error.message);
}

// uniqueOids filtering behavior
console.log('\n=== uniqueOids Filtering ===');
const mixedArray = [
  ou.newOid('507f1f77bcf86cd799439011'),
  'string-value',
  123,
  null,
  ou.newOid('507f1f77bcf86cd799439012'),
  ou.newOid('507f1f77bcf86cd799439011'), // duplicate
  { object: 'value' }
];
const filteredOids = ou.uniqueOids(mixedArray);
console.log('Original array length:', mixedArray.length);
console.log('Filtered ObjectIds length:', filteredOids.length);
console.log('Only ObjectIds remain:', filteredOids.every(ou.isOid));

// toStr - safe ObjectId to string conversion
console.log('\n=== toStr Safe Conversion ===');
const exampleOid = ou.newOid('507f1f77bcf86cd799439011');
console.log('Safe ObjectId to string:', ou.toStr(exampleOid));

// toStr handles null/undefined gracefully (unlike oid.toString())
const nullStr = ou.toStr(null);
const undefinedStr = ou.toStr(undefined);
console.log('Null to string:', nullStr);
console.log('Undefined to string:', undefinedStr);

// Compare with direct toString() which would throw
try {
  const directStr = null.toString();
  console.log('Direct toString result:', directStr);
} catch (error) {
  console.log('Direct toString error:', error.message);
}

// Practical database scenario
console.log('\n=== Practical Database Scenario ===');
const apiResponse = {
  users: [
    { id: '507f1f77bcf86cd799439011', name: 'Alice' }, // string ID
    { id: '507f1f77bcf86cd799439012', name: 'Bob' }, // string ID
    { id: null, name: 'Charlie' }, // missing ID
    { id: 'invalid', name: 'David' }, // invalid ID
    { id: ou.newOid('507f1f77bcf86cd799439013'), name: 'Eve' } // BSON ObjectId instance
  ]
};

const userIds = apiResponse.users.map(user => user.id);
console.log('Raw user IDs:', userIds.map(id => typeof id === 'object' ? 'ObjectId' : typeof id));

const validUserIds = ou.newOids(userIds); // automatically filters invalid
console.log('Valid user IDs:', validUserIds.length);

const uniqueUserIds = ou.uniqueOids(validUserIds);
console.log('Unique valid user IDs:', uniqueUserIds.length);

// Check if IDs are ObjectId instances
console.log('All valid IDs are ObjectId instances:', validUserIds.every(ou.isOid));
