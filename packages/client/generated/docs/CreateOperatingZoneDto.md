
# CreateOperatingZoneDto


## Properties

Name | Type
------------ | -------------
`name` | string
`description` | string
`boundary` | [CreateOperatingZoneDtoBoundary](CreateOperatingZoneDtoBoundary.md)
`isActive` | boolean

## Example

```typescript
import type { CreateOperatingZoneDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "description": null,
  "boundary": null,
  "isActive": null,
} satisfies CreateOperatingZoneDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateOperatingZoneDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


