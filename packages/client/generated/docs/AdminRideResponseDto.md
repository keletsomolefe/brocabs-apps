
# AdminRideResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`userName` | string
`driverId` | object
`driverName` | object
`quoteId` | string
`startAddress` | string
`endAddress` | string
`estimatedPrice` | number
`actualPrice` | object
`status` | string
`createdAt` | Date
`startedAt` | object
`completedAt` | object

## Example

```typescript
import type { AdminRideResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "userId": 123e4567-e89b-12d3-a456-426614174001,
  "userName": John Rider,
  "driverId": 123e4567-e89b-12d3-a456-426614174002,
  "driverName": Jane Driver,
  "quoteId": 123e4567-e89b-12d3-a456-426614174999,
  "startAddress": 123 Main Street, Johannesburg,
  "endAddress": 456 Park Avenue, Sandton,
  "estimatedPrice": 150,
  "actualPrice": 145,
  "status": completed,
  "createdAt": 2024-12-16T10:00Z,
  "startedAt": 2024-12-16T10:15:00.000Z,
  "completedAt": 2024-12-16T10:45:00.000Z,
} satisfies AdminRideResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminRideResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


