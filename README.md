# oid-utils
Simple utilities for working with MongoDB ObjectIds

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
const maybeOid = ou.newOid('invalid', { fallback: null }); // => null

// Unsafe mode: suppress fallback and throw on invalid
const forcedOid = ou.newOid('507f1f77bcf86cd799439011', { suppressFallback: true });

// Intentional epoch-based ObjectIds
const oidFromZero = ou.newOid(0, { suppressFallback: true }); // 1970-01-01

// Check if a value can be converted to ObjectId
const can = ou.canBeOid('507f1f77bcf86cd799439011');

// Convert ObjectId to Date / string
const date = ou.toDate(oid);
const str = ou.toString(oid);

// Compare
const isAfter = ou.isAfter(oid, ou.newOid());
const isBefore = ou.isBefore(oid, ou.newOid());

// Batch create (validOnly=true by default)
const many = ou.newOids(['507f1f77bcf86cd799439011', 'invalid']); // => [ObjectId]
const manyStrict = ou.newOids(['507f1f77bcf86cd799439011', 'invalid'], { validOnly: false }); // throws

// Unique ObjectIds (preserves first occurrence order)
const unique = ou.unique([ou.newOid('507f1f77bcf86cd799439011'), ou.newOid('507f1f77bcf86cd799439011')]);
```

## API Reference

- `ou.newOid([value], [options])`
  - No args → fresh ObjectId
  - Safe(default): `undefined|null|''` or non-convertible → returns `options.fallback ?? null`
  - Unsafe: `{ suppressFallback: true }` → constructs or throws
- `ou.newOids(values=[], { validOnly=true })` - Create many; skip invalid by default; set `validOnly=false` to throw
- `ou.unique(oids=[])` - Remove duplicates by string key, preserves order
- `ou.canBeOid(value)` - Check if a value can be converted to ObjectId
- `ou.isOid(value)` - Check if a value is an ObjectId instance
- `ou.isSameOid(a, b)` - Value-based ObjectId equality
- `ou.toDate(oid)` - Convert ObjectId to Date object
- `ou.toString(oid)` - Convert ObjectId to string representation
- `ou.isAfter(value1, value2)` - Check if first value (ObjectId or Date) is after second value
- `ou.isBefore(value1, value2)` - Check if first value (ObjectId or Date) is before second value

## Examples

See the [examples](./examples/) folder for more detailed usage examples.
