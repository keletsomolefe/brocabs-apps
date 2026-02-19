
# RideLocationDto


## Properties

Name | Type
------------ | -------------
`latitude` | number
`longitude` | number
`address` | string

## Example

```typescript
import type { RideLocationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "latitude": -33.9249,
  "longitude": 18.4241,
  "address": Cape Town City Centre, Cape Town, 8000,
} satisfies RideLocationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideLocationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


