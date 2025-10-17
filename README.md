# oid-utils
Simple utilities for working with MongoDB ObjectIds

oid-utils is designed for development convenience and to prevent app crashes from unexpected exceptions. Most functions return safe fallback values or `false` instead of throwing errors. For example, `isAfter` returns `false` when comparing invalid data instead of throwing an exception.

This means you can safely use these functions without try-catch blocks, but be aware that silent failures may occur. Always check the return values and handle fallback cases appropriately in your application logic.

## Installation

This package requires `bson` as a peer dependency. You need to install it separately:

```bash
npm install oid-utils bson
```

## BSON Version Compatibility

This package is compatible with `bson` version 4.0.0 and above. Here's the compatibility matrix with MongoDB Node.js Driver:

| MongoDB Driver | bson 4.x | bson 5.x | bson 6.x |
|----------------|-----------|-----------|-----------|
| `mongodb@6.x` | ❌ N/A    | ❌ N/A    | ✅ ✓      |
| `mongodb@5.x` | ❌ N/A    | ✅ ✓      | ❌ N/A    |
| `mongodb@4.x` | ✅ ✓      | ❌ N/A    | ❌ N/A    |
| `mongodb@3.x` | ❌ N/A    | ❌ N/A    | ❌ N/A    |

**Note**: For detailed BSON documentation and API reference, visit the [official BSON documentation](https://mongodb.github.io/node-mongodb-native/Next/modules/BSON.html).

## Usage

```javascript
const ou = require('oid-utils');

// Create new ObjectId (no args)
const oid = ou.newOid();

// Create ObjectId from value (safe by default)
const oidFromString = ou.newOid('507f1f77bcf86cd799439011');

// Fallback mode (default): invalid or falsy(undefined|null|'') returns fallback
const maybeOid = ou.newOid('invalid', 'fallback-value'); // => 'fallback-value'
const maybeOid2 = ou.newOid(undefined); // => null (default fallback)

// Check if a value can be converted to ObjectId
const can = ou.canBeOid('507f1f77bcf86cd799439011');

// Check if a value is an ObjectId instance
const isOid = ou.isOid(oid);

// Check if two ObjectIds have the same value
const isSame = ou.isSameOid(oid1, oid2);

// Convert ObjectId to Date / string
const date = ou.toDate(oid, 'fallback-date'); // with fallback
const str = ou.toStr(oid); // template interpolation

// Compare (returns false on invalid inputs)
const isAfter = ou.isAfter(oid, ou.newOid());
const isBefore = ou.isBefore(oid, ou.newOid());

// Batch create (validOnly=true by default)
const many = ou.newOids(['507f1f77bcf86cd799439011', 'invalid']); // => [ObjectId] (skips invalid)
const manyStrict = ou.newOids(['507f1f77bcf86cd799439011', 'invalid'], false); // throws

// Unique ObjectIds (filters non-ObjectIds, preserves first occurrence order)
const unique = ou.uniqueOids([ou.newOid('507f1f77bcf86cd799439011'), ou.newOid('507f1f77bcf86cd799439011')]);
```

## API Reference

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `newOid` | `[value], [fallback=null]` | `ObjectId\|any` | Create ObjectId; returns fallback for invalid/falsy inputs |
| `newOids` | `values=[], validOnly=true` | `ObjectId[]` | Create multiple ObjectIds; skip invalid by default; throws when validOnly=false |
| `uniqueOids` | `oids=[]` | `ObjectId[]` | Remove duplicate ObjectIds; filters out non-ObjectId values |
| `canBeOid` | `value` | `boolean` | Check if a value can be converted to ObjectId |
| `isOid` | `value` | `boolean` | Check if a value is an ObjectId instance |
| `isSameOid` | `value1, value2` | `boolean` | Check if two ObjectIds have the same value; returns false for non-ObjectIds |
| `toDate` | `value, [fallback=null]` | `Date\|any` | Convert ObjectId to Date; returns fallback for non-ObjectId |
| `toStr` | `value` | `string` | Convert any value to string using template interpolation |
| `isAfter` | `value1, value2` | `boolean` | Check if first value is after second; returns false on invalid inputs |
| `isBefore` | `value1, value2` | `boolean` | Check if first value is before second; returns false on invalid inputs |

## Examples

See the [examples](./examples/) folder for more detailed usage examples.
