
# RegisterDriverDto


## Properties

Name | Type
------------ | -------------
`avatar` | [RegisterDriverDtoAvatar](RegisterDriverDtoAvatar.md)
`fullName` | string
`email` | string
`phoneNumber` | string
`password` | string
`confirmPassword` | string

## Example

```typescript
import type { RegisterDriverDto } from ''

// TODO: Update the object below with actual values
const example = {
  "avatar": null,
  "fullName": null,
  "email": null,
  "phoneNumber": null,
  "password": null,
  "confirmPassword": null,
} satisfies RegisterDriverDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegisterDriverDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


