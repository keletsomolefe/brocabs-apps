
# RideQuotePriceResponseDto


## Properties

Name | Type
------------ | -------------
`rideTypeId` | number
`rideTypeCode` | string
`rideTypeName` | string
`estimatedPrice` | number
`currency` | string

## Example

```typescript
import type { RideQuotePriceResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "rideTypeId": 1,
  "rideTypeCode": standard,
  "rideTypeName": Standard,
  "estimatedPrice": 120.5,
  "currency": ZAR,
} satisfies RideQuotePriceResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideQuotePriceResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


