
# ActiveRideVehicleDto


## Properties

Name | Type
------------ | -------------
`make` | string
`model` | string
`colour` | string
`registrationNumber` | string

## Example

```typescript
import type { ActiveRideVehicleDto } from ''

// TODO: Update the object below with actual values
const example = {
  "make": null,
  "model": null,
  "colour": null,
  "registrationNumber": null,
} satisfies ActiveRideVehicleDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ActiveRideVehicleDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


