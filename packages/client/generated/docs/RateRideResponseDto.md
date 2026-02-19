
# RateRideResponseDto


## Properties

Name | Type
------------ | -------------
`rating` | [RideRatingResponseDto](RideRatingResponseDto.md)
`targetAverageRating` | number

## Example

```typescript
import type { RateRideResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "rating": null,
  "targetAverageRating": null,
} satisfies RateRideResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RateRideResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


