
# VerifyOtpResponseDataDto


## Properties

Name | Type
------------ | -------------
`id` | string
`fullName` | string
`email` | string
`status` | string
`requiresRegistration` | [VerifyOtpSessionDto](VerifyOtpSessionDto.md)

## Example

```typescript
import type { VerifyOtpResponseDataDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "fullName": null,
  "email": null,
  "status": null,
  "requiresRegistration": null,
} satisfies VerifyOtpResponseDataDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VerifyOtpResponseDataDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


