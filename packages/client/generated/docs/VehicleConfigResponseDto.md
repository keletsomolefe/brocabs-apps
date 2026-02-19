
# VehicleConfigResponseDto


## Properties

Name | Type
------------ | -------------
`makes` | [Array&lt;OptionDto&gt;](OptionDto.md)
`models` | [Array&lt;OptionDto&gt;](OptionDto.md)
`colors` | [Array&lt;OptionDto&gt;](OptionDto.md)

## Example

```typescript
import type { VehicleConfigResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "makes": null,
  "models": null,
  "colors": null,
} satisfies VehicleConfigResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VehicleConfigResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


