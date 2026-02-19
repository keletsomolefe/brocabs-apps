
# ChatPagingDto


## Properties

Name | Type
------------ | -------------
`limit` | number
`hasMore` | boolean
`cursor` | object

## Example

```typescript
import type { ChatPagingDto } from ''

// TODO: Update the object below with actual values
const example = {
  "limit": 50,
  "hasMore": false,
  "cursor": 123e4567-e89b-12d3-a456-426614174003,
} satisfies ChatPagingDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChatPagingDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


