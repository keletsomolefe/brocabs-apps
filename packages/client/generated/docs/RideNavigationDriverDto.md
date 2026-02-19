
# RideNavigationDriverDto


## Properties

Name | Type
------------ | -------------
`id` | string
`lat` | number
`lon` | number
`heading` | number

## Example

```typescript
import type { RideNavigationDriverDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": drv_456,
  "lat": -26.2041,
  "lon": 28.0473,
  "heading": 92,
} satisfies RideNavigationDriverDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideNavigationDriverDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


