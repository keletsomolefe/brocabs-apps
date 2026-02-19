
# RideHistoryItemDto


## Properties

Name | Type
------------ | -------------
`id` | string
`status` | string
`createdAt` | Date
`completedAt` | object
`cancelledAt` | object
`pickupAddress` | string
`destinationAddress` | string
`estimatedPrice` | number
`actualPrice` | object
`driverRating` | object
`paymentMethodCode` | string

## Example

```typescript
import type { RideHistoryItemDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "status": completed,
  "createdAt": 2024-12-16T10:00Z,
  "completedAt": 2024-12-16T10:45:00.000Z,
  "cancelledAt": 2024-12-16T10:12:00.000Z,
  "pickupAddress": 123 Main Street, Johannesburg,
  "destinationAddress": 456 Park Avenue, Sandton,
  "estimatedPrice": 150,
  "actualPrice": 145,
  "driverRating": 4.9,
  "paymentMethodCode": null,
} satisfies RideHistoryItemDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideHistoryItemDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


