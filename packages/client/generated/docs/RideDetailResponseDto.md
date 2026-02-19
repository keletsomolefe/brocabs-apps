
# RideDetailResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`status` | string
`createdAt` | Date
`startedAt` | object
`arrivedAt` | object
`completedAt` | object
`pickup` | [RideLocationDto](RideLocationDto.md)
`destination` | [RideLocationDto](RideLocationDto.md)
`routePolyline` | string
`pricing` | [RideDetailPricingDto](RideDetailPricingDto.md)
`paymentMethodCode` | string
`paymentMethod` | object
`paymentStatus` | object
`riderProfile` | [ActiveRideRiderProfileDto](ActiveRideRiderProfileDto.md)
`driverProfile` | [RideDetailDriverProfileDto](RideDetailDriverProfileDto.md)
`stateHistory` | [Array&lt;RideStateTransitionDto&gt;](RideStateTransitionDto.md)

## Example

```typescript
import type { RideDetailResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "status": completed,
  "createdAt": 2024-12-16T10:00Z,
  "startedAt": 2024-12-16T10:05:00.000Z,
  "arrivedAt": 2024-12-16T10:12:00.000Z,
  "completedAt": 2024-12-16T10:45:00.000Z,
  "pickup": null,
  "destination": null,
  "routePolyline": encoded_polyline_string,
  "pricing": null,
  "paymentMethodCode": null,
  "paymentMethod": Wallet,
  "paymentStatus": paid,
  "riderProfile": null,
  "driverProfile": null,
  "stateHistory": null,
} satisfies RideDetailResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideDetailResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


