
# ApplicationDocumentDto


## Properties

Name | Type
------------ | -------------
`id` | string
`documentType` | string
`fileUrl` | string
`expirationDate` | Date
`uploadedAt` | Date

## Example

```typescript
import type { ApplicationDocumentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "documentType": National ID,
  "fileUrl": https://storage.example.com/docs/123.pdf,
  "expirationDate": null,
  "uploadedAt": 2024-01-15T10:30Z,
} satisfies ApplicationDocumentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationDocumentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


