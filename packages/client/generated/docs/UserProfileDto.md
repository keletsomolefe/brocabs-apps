
# UserProfileDto


## Properties

Name | Type
------------ | -------------
`type` | string
`state` | string
`identity` | [IdentityDto](IdentityDto.md)
`profile` | [ProfileStatsDto](ProfileStatsDto.md)

## Example

```typescript
import type { UserProfileDto } from ''

// TODO: Update the object below with actual values
const example = {
  "type": null,
  "state": null,
  "identity": null,
  "profile": null,
} satisfies UserProfileDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UserProfileDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


