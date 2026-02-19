
# UpdateProfileDto


## Properties

Name | Type
------------ | -------------
`avatar` | [CreateAccountDtoAvatar](CreateAccountDtoAvatar.md)
`fullName` | string
`gender` | string

## Example

```typescript
import type { UpdateProfileDto } from ''

// TODO: Update the object below with actual values
const example = {
  "avatar": null,
  "fullName": null,
  "gender": null,
} satisfies UpdateProfileDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateProfileDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


