# X-API-Key Authentication

## Overview

The Visa Evaluation Tool now supports optional API key authentication for partners who want to integrate programmatically.

## Features

- ✅ Optional API key support (web requests work without keys)
- ✅ Rate limiting per API key (default: 100 requests/day)
- ✅ Usage tracking
- ✅ Key expiration support
- ✅ Secure key generation and storage

## Generating an API Key

Run the key generation script:

```bash
cd server
node src/scripts/generate-api-key.js
```

This will create a test API key and display it. **Save the key securely - it's only shown once!**

Example output:

```
🔑 API KEY (Save this securely - shown only once!):
   veval_a1b2c3d4e5f6g7h8_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9
```

## Using the API Key

Add the `X-API-Key` header to your requests:

### cURL Example

```bash
curl -X POST http://localhost:5000/api/evaluations \
  -H "X-API-Key: veval_a1b2c3d4e5f6g7h8_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9" \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "countryCode=IE" \
  -F "visaTypeId=critical-skills" \
  -F "resume=@/path/to/resume.pdf"
```

### JavaScript/Axios Example

```javascript
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");
formData.append("countryCode", "IE");
formData.append("visaTypeId", "critical-skills");
formData.append("resume", fs.createReadStream("/path/to/resume.pdf"));

axios
  .post("http://localhost:5000/api/evaluations", formData, {
    headers: {
      ...formData.getHeaders(),
      "X-API-Key":
        "veval_a1b2c3d4e5f6g7h8_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9",
    },
  })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error.response.data));
```

### Python Example

```python
import requests

url = 'http://localhost:5000/api/evaluations'
headers = {
    'X-API-Key': 'veval_a1b2c3d4e5f6g7h8_x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9'
}
files = {
    'resume': open('/path/to/resume.pdf', 'rb')
}
data = {
    'name': 'John Doe',
    'email': 'john@example.com',
    'countryCode': 'IE',
    'visaTypeId': 'critical-skills'
}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())
```

## API Key Format

Format: `veval_{keyId}_{secret}`

- `veval` - Prefix identifier
- `keyId` - 16-character hex identifier
- `secret` - 48-character hex secret

## Rate Limits

Default rate limits:

- **100 requests per day** per API key
- Rate limit resets at midnight UTC

Response when limit exceeded:

```json
{
  "success": false,
  "message": "API key rate limit exceeded. Please try again tomorrow."
}
```

## Error Responses

### Invalid API Key Format

```json
{
  "success": false,
  "message": "Invalid API key format"
}
```

### Invalid or Inactive Key

```json
{
  "success": false,
  "message": "Invalid or inactive API key"
}
```

### Expired Key

```json
{
  "success": false,
  "message": "API key has expired"
}
```

## Database Schema

API keys are stored in the `apikeys` collection with:

- `keyId` - Unique identifier
- `keyHash` - Bcrypt hash of the secret
- `name` - Descriptive name
- `partnerInfo` - Partner details (name, email, organization)
- `isActive` - Active status
- `rateLimit.requestsPerDay` - Daily request limit
- `usage.totalRequests` - Total requests made
- `usage.lastUsedAt` - Last usage timestamp
- `expiresAt` - Optional expiration date

## Security Notes

1. **Never expose API keys in client-side code**
2. Keys are hashed using bcrypt before storage
3. Full keys are only shown once during generation
4. Keys can be revoked by setting `isActive: false`
5. Consider adding IP whitelisting for production use

## Managing API Keys

### View All Keys (MongoDB Shell)

```javascript
use visa-evaluation
db.apikeys.find({}, { keyHash: 0 }).pretty()
```

### Deactivate a Key

```javascript
db.apikeys.updateOne(
  { keyId: "a1b2c3d4e5f6g7h8" },
  { $set: { isActive: false } }
);
```

### Update Rate Limit

```javascript
db.apikeys.updateOne(
  { keyId: "a1b2c3d4e5f6g7h8" },
  { $set: { "rateLimit.requestsPerDay": 500 } }
);
```

## Future Enhancements

- [ ] Admin dashboard for key management
- [ ] Different rate limit tiers
- [ ] IP whitelisting per key
- [ ] Webhook notifications
- [ ] Usage analytics endpoint
- [ ] Request signing for added security
