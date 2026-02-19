
# UploadDocumentDto


## Properties

Name | Type
------------ | -------------
`documentType` | string
`file` | [CreateProfileDtoAvatar](CreateProfileDtoAvatar.md)
`expirationDate` | string

## Example

```typescript
import type { UploadDocumentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "documentType": null,
  "file": null,
  "expirationDate": null,
} satisfies UploadDocumentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UploadDocumentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


