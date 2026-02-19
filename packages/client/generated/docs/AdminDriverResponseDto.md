
# AdminDriverResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`fullName` | string
`email` | string
`phoneNumber` | string
`status` | string
`vehicleType` | string
`licenseNumber` | string
`licenseExpiry` | Date
`rating` | number
`totalRides` | number
`isVerified` | boolean
`isActive` | boolean
`avatarUrl` | object
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { AdminDriverResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "userId": 123e4567-e89b-12d3-a456-426614174001,
  "fullName": John Driver,
  "email": john.driver@example.com,
  "phoneNumber": +27123456789,
  "status": online,
  "vehicleType": Sedan,
  "licenseNumber": DL123456,
  "licenseExpiry": null,
  "rating": 4.8,
  "totalRides": 250,
  "isVerified": true,
  "isActive": true,
  "avatarUrl": https://storage.example.com/avatars/123.jpg,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-12-10T15:45Z,
} satisfies AdminDriverResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminDriverResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


