
# CreateUserTokenDto


## Properties

Name | Type
------------ | -------------
`givenName` | string
`familyName` | string
`email` | string
`mobile` | string

## Example

```typescript
import type { CreateUserTokenDto } from ''

// TODO: Update the object below with actual values
const example = {
  "givenName": null,
  "familyName": null,
  "email": null,
  "mobile": null,
} satisfies CreateUserTokenDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateUserTokenDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


