
# VerifyOtpResponseDtoDataRiderProfile


## Properties

Name | Type
------------ | -------------
`id` | string
`fullName` | string
`gender` | string
`avatar` | [VerifyOtpResponseDtoDataDriverProfileAvatar](VerifyOtpResponseDtoDataDriverProfileAvatar.md)
`totalRides` | number
`tradeSafeTokenId` | string

## Example

```typescript
import type { VerifyOtpResponseDtoDataRiderProfile } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "fullName": null,
  "gender": null,
  "avatar": null,
  "totalRides": null,
  "tradeSafeTokenId": null,
} satisfies VerifyOtpResponseDtoDataRiderProfile

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VerifyOtpResponseDtoDataRiderProfile
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


