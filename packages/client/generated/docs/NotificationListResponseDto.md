
# NotificationListResponseDto


## Properties

Name | Type
------------ | -------------
`notifications` | [Array&lt;NotificationResponseDto&gt;](NotificationResponseDto.md)
`hasMore` | boolean
`cursor` | string

## Example

```typescript
import type { NotificationListResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "notifications": null,
  "hasMore": null,
  "cursor": null,
} satisfies NotificationListResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NotificationListResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


