
# RideTypeResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`code` | string
`displayName` | string
`description` | string
`capacity` | number
`seatCount` | number
`order` | number
`dispatchRank` | number
`baseFare` | number
`perMinuteRate` | number
`perKmRate` | number
`minFare` | number
`active` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { RideTypeResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 1,
  "code": big_bro,
  "displayName": Big Bro,
  "description": A {{capacity}}-seater compact ride — comfortable and convenient for small groups.,
  "capacity": 3,
  "seatCount": 3,
  "order": 1,
  "dispatchRank": 1,
  "baseFare": 10,
  "perMinuteRate": 1.2,
  "perKmRate": 6,
  "minFare": 20,
  "active": true,
  "createdAt": null,
  "updatedAt": null,
} satisfies RideTypeResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideTypeResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


