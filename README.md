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
import ou from 'oid-utils';

// Create new ObjectId
const oid = ou.new();

// Create ObjectId from string
const oidFromString = ou.new('507f1f77bcf86cd799439011');

// Create ObjectId from existing ObjectId (returns the same instance)
const existingOid = new ObjectId('507f1f77bcf86cd799439011');
const sameOid = ou.new(existingOid);

// Validate ObjectId string
const isValid = ou.isValid('507f1f77bcf86cd799439011');

// Convert ObjectId to Date
const date = ou.toDate(oid);

// Convert ObjectId to string
const str = ou.toString(oid);

// Compare ObjectIds
const isAfter = ou.isAfter(oid1, oid2);
const isBefore = ou.isBefore(oid1, oid2);
```

## API Reference

- `ou.new([value])` - Create a new ObjectId. If no value is provided, generates a new ObjectId. If a string, number, or existing ObjectId is provided, creates an ObjectId from that value.
- `ou.isValid(value)` - Check if a value is a valid ObjectId string or ObjectId instance
- `ou.toDate(oid)` - Convert ObjectId to Date object
- `ou.toString(oid)` - Convert ObjectId to string representation
- `ou.isAfter(value1, value2)` - Check if first value (ObjectId or Date) is after second value
- `ou.isBefore(value1, value2)` - Check if first value (ObjectId or Date) is before second value

## Examples

See the [examples](./examples/) folder for more detailed usage examples.
