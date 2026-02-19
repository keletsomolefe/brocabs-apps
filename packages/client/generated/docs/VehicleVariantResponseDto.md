
# VehicleVariantResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`modelId` | string
`yearFrom` | number
`yearTo` | object
`trim` | object
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { VehicleVariantResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 550e8400-e29b-41d4-a716-446655440000,
  "modelId": 550e8400-e29b-41d4-a716-446655440000,
  "yearFrom": 2020,
  "yearTo": 2024,
  "trim": SE,
  "createdAt": null,
  "updatedAt": null,
} satisfies VehicleVariantResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VehicleVariantResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


