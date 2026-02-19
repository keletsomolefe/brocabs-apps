
# ApplicationVehicleDto


## Properties

Name | Type
------------ | -------------
`make` | string
`model` | string
`colour` | string
`registrationNumber` | string
`exteriorImageUrls` | Array&lt;string&gt;
`interiorImageUrls` | Array&lt;string&gt;

## Example

```typescript
import type { ApplicationVehicleDto } from ''

// TODO: Update the object below with actual values
const example = {
  "make": Toyota,
  "model": Corolla,
  "colour": White,
  "registrationNumber": ABC123GP,
  "exteriorImageUrls": null,
  "interiorImageUrls": null,
} satisfies ApplicationVehicleDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationVehicleDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


