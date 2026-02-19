
# BroScholarApplicationResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`user` | object
`studentName` | string
`institution` | string
`status` | string
`rejectionReason` | string
`reviewedAt` | Date
`reviewedBy` | string
`reviewer` | object
`createdAt` | Date
`updatedAt` | Date
`studentFaceImageFile` | string
`studentCardFile` | string
`selfieWithStudentCardFile` | string

## Example

```typescript
import type { BroScholarApplicationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userId": null,
  "user": null,
  "studentName": John Doe,
  "institution": University of Johannesburg,
  "status": PENDING,
  "rejectionReason": null,
  "reviewedAt": null,
  "reviewedBy": null,
  "reviewer": null,
  "createdAt": null,
  "updatedAt": null,
  "studentFaceImageFile": null,
  "studentCardFile": null,
  "selfieWithStudentCardFile": null,
} satisfies BroScholarApplicationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BroScholarApplicationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


