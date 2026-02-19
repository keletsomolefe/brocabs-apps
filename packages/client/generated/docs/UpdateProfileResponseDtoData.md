
# UpdateProfileResponseDtoData


## Properties

Name | Type
------------ | -------------
`fullName` | string
`gender` | string
`avatar` | [UpdateProfileResponseDtoDataAvatar](UpdateProfileResponseDtoDataAvatar.md)

## Example

```typescript
import type { UpdateProfileResponseDtoData } from ''

// TODO: Update the object below with actual values
const example = {
  "fullName": null,
  "gender": null,
  "avatar": null,
} satisfies UpdateProfileResponseDtoData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateProfileResponseDtoData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


