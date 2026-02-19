
# AdminUserListResponseDto


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;AdminUserResponseDto&gt;](AdminUserResponseDto.md)
`total` | number
`limit` | number
`offset` | number

## Example

```typescript
import type { AdminUserListResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "total": 100,
  "limit": 10,
  "offset": 0,
} satisfies AdminUserListResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminUserListResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


