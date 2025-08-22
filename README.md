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

// Validate ObjectId string
const isValid = ou.isValid('507f1f77bcf86cd799439011');

// Convert ObjectId to Date
const date = ou.toDate(oid);

// Convert ObjectId to string
const str = ou.toString(oid);
```

## API Reference

- `ou.new([value])` - Create a new ObjectId
- `ou.isValid(value)` - Check if a value is a valid ObjectId
- `ou.toDate(oid)` - Convert ObjectId to Date
- `ou.toString(oid)` - Convert ObjectId to string

## Examples

See the [examples](./examples/) folder for more detailed usage examples.
