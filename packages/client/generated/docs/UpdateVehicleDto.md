
# UpdateVehicleDto


## Properties

Name | Type
------------ | -------------
`make` | string
`model` | string
`colour` | string
`registrationNumber` | string
`rideTypeId` | number
`exteriorImages` | [Array&lt;CreateProfileDtoAvatar&gt;](CreateProfileDtoAvatar.md)
`interiorImages` | [Array&lt;CreateProfileDtoAvatar&gt;](CreateProfileDtoAvatar.md)

## Example

```typescript
import type { UpdateVehicleDto } from ''

// TODO: Update the object below with actual values
const example = {
  "make": null,
  "model": null,
  "colour": null,
  "registrationNumber": null,
  "rideTypeId": null,
  "exteriorImages": null,
  "interiorImages": null,
} satisfies UpdateVehicleDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateVehicleDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


