
# RideResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`riderProfileId` | string
`driverProfileId` | object
`quoteId` | string
`estimatedPrice` | number
`actualPrice` | object
`status` | string
`arrivedAt` | object
`arrivalTimeoutExpiresAt` | object
`arrivalTimeoutExpiresAtMs` | number
`arrivalTimeoutWaitDelayMs` | number
`createdAt` | Date
`pickup` | [RideLocationDto](RideLocationDto.md)
`destination` | [RideLocationDto](RideLocationDto.md)
`routePolyline` | string
`paymentMethodCode` | string
`paymentMethod` | object
`tradeSafeTransactionId` | object
`paymentStatus` | object
`riderProfile` | [ActiveRideRiderProfileDto](ActiveRideRiderProfileDto.md)
`driverProfile` | [ActiveRideDriverProfileDto](ActiveRideDriverProfileDto.md)

## Example

```typescript
import type { RideResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "riderProfileId": 123e4567-e89b-12d3-a456-426614174001,
  "driverProfileId": 123e4567-e89b-12d3-a456-426614174002,
  "quoteId": 123e4567-e89b-12d3-a456-426614174003,
  "estimatedPrice": 250.5,
  "actualPrice": 255,
  "status": searching,
  "arrivedAt": 2024-12-16T10:05:00.000Z,
  "arrivalTimeoutExpiresAt": 2024-12-16T10:07:00.000Z,
  "arrivalTimeoutExpiresAtMs": 1734343620000,
  "arrivalTimeoutWaitDelayMs": 5000,
  "createdAt": 2024-12-16T10:00Z,
  "pickup": null,
  "destination": null,
  "routePolyline": encoded_polyline_string,
  "paymentMethodCode": null,
  "paymentMethod": Wallet,
  "tradeSafeTransactionId": tx_12345,
  "paymentStatus": held,
  "riderProfile": null,
  "driverProfile": null,
} satisfies RideResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


