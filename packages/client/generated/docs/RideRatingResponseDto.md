
# RideRatingResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`rideId` | string
`target` | string
`profileType` | string
`rating` | number
`comment` | string
`createdAt` | Date

## Example

```typescript
import type { RideRatingResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "rideId": null,
  "target": null,
  "profileType": null,
  "rating": null,
  "comment": null,
  "createdAt": null,
} satisfies RideRatingResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideRatingResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


