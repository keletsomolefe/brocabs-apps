
# RideNavigationRouteDto


## Properties

Name | Type
------------ | -------------
`polyline` | string
`distanceMeters` | number
`durationSeconds` | number

## Example

```typescript
import type { RideNavigationRouteDto } from ''

// TODO: Update the object below with actual values
const example = {
  "polyline": abc123,
  "distanceMeters": 1800,
  "durationSeconds": 240,
} satisfies RideNavigationRouteDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideNavigationRouteDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


