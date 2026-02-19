
# SessionResponseDto


## Properties

Name | Type
------------ | -------------
`authenticated` | boolean
`applicationType` | string
`state` | [SessionResponseDtoState](SessionResponseDtoState.md)
`profileId` | string
`email` | string
`phoneNumber` | string
`gender` | string

## Example

```typescript
import type { SessionResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "authenticated": null,
  "applicationType": null,
  "state": null,
  "profileId": null,
  "email": null,
  "phoneNumber": null,
  "gender": null,
} satisfies SessionResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SessionResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


