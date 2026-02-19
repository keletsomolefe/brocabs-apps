
# DriverApplicationDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`fullName` | string
`email` | string
`phoneNumber` | string
`avatarUrl` | object
`bankDetails` | [ApplicationBankDetailsDto](ApplicationBankDetailsDto.md)
`vehicle` | [ApplicationVehicleDto](ApplicationVehicleDto.md)
`documents` | [Array&lt;ApplicationDocumentDto&gt;](ApplicationDocumentDto.md)
`payment` | [ApplicationPaymentDto](ApplicationPaymentDto.md)
`operatingZones` | [Array&lt;ApplicationOperatingZoneDto&gt;](ApplicationOperatingZoneDto.md)
`status` | string
`submittedAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { DriverApplicationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "userId": 123e4567-e89b-12d3-a456-426614174001,
  "fullName": John Driver,
  "email": john.driver@example.com,
  "phoneNumber": +27123456789,
  "avatarUrl": https://storage.example.com/avatars/123.jpg,
  "bankDetails": null,
  "vehicle": null,
  "documents": null,
  "payment": null,
  "operatingZones": null,
  "status": REVIEW_PENDING,
  "submittedAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-12-10T15:45Z,
} satisfies DriverApplicationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DriverApplicationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


