
# OperatingZoneResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`description` | string
`boundary` | [OperatingZoneResponseDtoBoundary](OperatingZoneResponseDtoBoundary.md)
`isActive` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { OperatingZoneResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "description": null,
  "boundary": null,
  "isActive": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies OperatingZoneResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as OperatingZoneResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


