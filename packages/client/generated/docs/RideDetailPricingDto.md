
# RideDetailPricingDto


## Properties

Name | Type
------------ | -------------
`estimatedPrice` | number
`actualPrice` | object
`surgeMultiplier` | object
`distanceMeters` | object
`durationSeconds` | object
`currency` | object
`rideTypeId` | object
`rideTypeCode` | object

## Example

```typescript
import type { RideDetailPricingDto } from ''

// TODO: Update the object below with actual values
const example = {
  "estimatedPrice": 250.5,
  "actualPrice": 255,
  "surgeMultiplier": 1.2,
  "distanceMeters": 12800,
  "durationSeconds": 1800,
  "currency": ZAR,
  "rideTypeId": 3,
  "rideTypeCode": standard,
} satisfies RideDetailPricingDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideDetailPricingDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


