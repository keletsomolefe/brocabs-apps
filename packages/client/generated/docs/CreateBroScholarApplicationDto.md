
# CreateBroScholarApplicationDto


## Properties

Name | Type
------------ | -------------
`studentName` | string
`institution` | string
`studentFaceImage` | [CreateBroScholarApplicationDtoStudentFaceImage](CreateBroScholarApplicationDtoStudentFaceImage.md)
`studentCard` | [CreateBroScholarApplicationDtoStudentCard](CreateBroScholarApplicationDtoStudentCard.md)
`selfieWithStudentCard` | [CreateBroScholarApplicationDtoSelfieWithStudentCard](CreateBroScholarApplicationDtoSelfieWithStudentCard.md)

## Example

```typescript
import type { CreateBroScholarApplicationDto } from ''

// TODO: Update the object below with actual values
const example = {
  "studentName": null,
  "institution": null,
  "studentFaceImage": null,
  "studentCard": null,
  "selfieWithStudentCard": null,
} satisfies CreateBroScholarApplicationDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateBroScholarApplicationDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


