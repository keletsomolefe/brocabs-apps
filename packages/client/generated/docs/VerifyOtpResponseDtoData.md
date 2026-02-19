
# VerifyOtpResponseDtoData


## Properties

Name | Type
------------ | -------------
`nextStep` | string
`applicationType` | string
`user` | [VerifyOtpResponseDtoDataUser](VerifyOtpResponseDtoDataUser.md)
`driverProfile` | [VerifyOtpResponseDtoDataDriverProfile](VerifyOtpResponseDtoDataDriverProfile.md)
`riderProfile` | [VerifyOtpResponseDtoDataRiderProfile](VerifyOtpResponseDtoDataRiderProfile.md)

## Example

```typescript
import type { VerifyOtpResponseDtoData } from ''

// TODO: Update the object below with actual values
const example = {
  "nextStep": null,
  "applicationType": null,
  "user": null,
  "driverProfile": null,
  "riderProfile": null,
} satisfies VerifyOtpResponseDtoData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as VerifyOtpResponseDtoData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


