
# RideNavigationResponseDto


## Properties

Name | Type
------------ | -------------
`rideId` | string
`rideStatus` | string
`driver` | [RideNavigationDriverDto](RideNavigationDriverDto.md)
`route` | [RideNavigationRouteDto](RideNavigationRouteDto.md)
`target` | [RideNavigationTargetDto](RideNavigationTargetDto.md)
`lastUpdatedAt` | string

## Example

```typescript
import type { RideNavigationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "rideId": ride_123,
  "rideStatus": accepted,
  "driver": null,
  "route": null,
  "target": null,
  "lastUpdatedAt": 2026-01-21T00:41:22Z,
} satisfies RideNavigationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideNavigationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


