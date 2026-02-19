
# UpdateRideTypeDto


## Properties

Name | Type
------------ | -------------
`code` | string
`displayName` | string
`description` | string
`capacity` | number
`order` | number
`dispatchRank` | number
`baseFare` | number
`perMinuteRate` | number
`perKmRate` | number
`minFare` | number
`active` | boolean

## Example

```typescript
import type { UpdateRideTypeDto } from ''

// TODO: Update the object below with actual values
const example = {
  "code": null,
  "displayName": null,
  "description": null,
  "capacity": null,
  "order": null,
  "dispatchRank": null,
  "baseFare": null,
  "perMinuteRate": null,
  "perKmRate": null,
  "minFare": null,
  "active": null,
} satisfies UpdateRideTypeDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateRideTypeDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


