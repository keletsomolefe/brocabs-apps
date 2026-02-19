
# UploadUrlResponseDto


## Properties

Name | Type
------------ | -------------
`uploadUri` | string
`fileName` | string
`storagePath` | string
`originalFileExtension` | string

## Example

```typescript
import type { UploadUrlResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "uploadUri": null,
  "fileName": null,
  "storagePath": null,
  "originalFileExtension": null,
} satisfies UploadUrlResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UploadUrlResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


