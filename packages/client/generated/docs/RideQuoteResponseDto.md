
# RideQuoteResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`startLatitude` | number
`startLongitude` | number
`endLatitude` | number
`endLongitude` | number
`startAddress` | string
`endAddress` | string
`distanceMeters` | number
`durationSeconds` | number
`routePolyline` | string
`currency` | string
`prices` | [Array&lt;RideQuotePriceResponseDto&gt;](RideQuotePriceResponseDto.md)
`surgeMultiplier` | number
`expiresAt` | Date
`createdAt` | Date

## Example

```typescript
import type { RideQuoteResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": a3d2...,
  "startLatitude": -26.2041,
  "startLongitude": 28.0473,
  "endLatitude": -25.7479,
  "endLongitude": 28.2293,
  "startAddress": Sandton, Johannesburg,
  "endAddress": Pretoria,
  "distanceMeters": 56000,
  "durationSeconds": 3600,
  "routePolyline": encodedPolylineString,
  "currency": ZAR,
  "prices": null,
  "surgeMultiplier": 1.2,
  "expiresAt": null,
  "createdAt": null,
} satisfies RideQuoteResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideQuoteResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


