
# RideNavigationTargetDto


## Properties

Name | Type
------------ | -------------
`latitude` | number
`longitude` | number
`address` | string

## Example

```typescript
import type { RideNavigationTargetDto } from ''

// TODO: Update the object below with actual values
const example = {
  "latitude": -26.2041,
  "longitude": 28.0473,
  "address": 123 Main Street, Johannesburg,
} satisfies RideNavigationTargetDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideNavigationTargetDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


