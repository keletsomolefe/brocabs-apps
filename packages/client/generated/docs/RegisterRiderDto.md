
# RegisterRiderDto


## Properties

Name | Type
------------ | -------------
`avatar` | [RegisterRiderDtoAvatar](RegisterRiderDtoAvatar.md)
`fullName` | string
`gender` | string
`email` | string
`phoneNumber` | string
`password` | string
`confirmPassword` | string

## Example

```typescript
import type { RegisterRiderDto } from ''

// TODO: Update the object below with actual values
const example = {
  "avatar": null,
  "fullName": null,
  "gender": null,
  "email": null,
  "phoneNumber": null,
  "password": null,
  "confirmPassword": null,
} satisfies RegisterRiderDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegisterRiderDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


