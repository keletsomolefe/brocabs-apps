
# DriverActiveOfferDto


## Properties

Name | Type
------------ | -------------
`rideId` | string
`rideTypeId` | number
`riderName` | string
`riderRating` | number
`riderAvatarUrl` | string
`pickupLatitude` | number
`pickupLongitude` | number
`pickupAddress` | string
`dropoffLatitude` | number
`dropoffLongitude` | number
`dropoffAddress` | string
`distanceKm` | number
`distanceMeters` | number
`estimatedTimeSeconds` | number
`estimatedTimeMinutes` | number
`tripDistanceMeters` | number
`tripDurationSeconds` | number
`estimatedPrice` | number
`currency` | string
`createdAt` | string
`expiresAt` | number

## Example

```typescript
import type { DriverActiveOfferDto } from ''

// TODO: Update the object below with actual values
const example = {
  "rideId": a3d2...,
  "rideTypeId": 1,
  "riderName": Jane Doe,
  "riderRating": 5,
  "riderAvatarUrl": https://cdn.example.com/avatar.png,
  "pickupLatitude": -26.2041,
  "pickupLongitude": 28.0473,
  "pickupAddress": Sandton, Johannesburg,
  "dropoffLatitude": -25.7479,
  "dropoffLongitude": 28.2293,
  "dropoffAddress": Pretoria,
  "distanceKm": 2.4,
  "distanceMeters": 2400,
  "estimatedTimeSeconds": 420,
  "estimatedTimeMinutes": 7,
  "tripDistanceMeters": 56000,
  "tripDurationSeconds": 3600,
  "estimatedPrice": 120.5,
  "currency": ZAR,
  "createdAt": 2024-09-01T12:00:00.000Z,
  "expiresAt": 1725196800000,
} satisfies DriverActiveOfferDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DriverActiveOfferDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


