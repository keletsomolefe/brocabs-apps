
# ApplicationOperatingZoneDto


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`description` | string
`isActive` | boolean

## Example

```typescript
import type { ApplicationOperatingZoneDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "name": Johannesburg CBD,
  "description": Central business district area,
  "isActive": true,
} satisfies ApplicationOperatingZoneDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationOperatingZoneDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


