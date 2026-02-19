
# VerifyOtpResponseDtoDataUser


## Properties

Name | Type
------------ | -------------
`id` | string
`fusionAuthId` | string
`email` | string
`phoneNumber` | string
`gender` | string
`isActive` | boolean

## Example

```typescript
import type { VerifyOtpResponseDtoDataUser } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "fusionAuthId": null,
  "email": null,
  "phoneNumber": null,
  "gender": null,
  "isActive": null,
} satisfies VerifyOtpResponseDtoDataUser

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VerifyOtpResponseDtoDataUser
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


