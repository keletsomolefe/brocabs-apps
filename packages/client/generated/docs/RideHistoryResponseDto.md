
# RideHistoryResponseDto


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;RideHistoryItemDto&gt;](RideHistoryItemDto.md)
`limit` | number
`hasMore` | boolean
`cursor` | object

## Example

```typescript
import type { RideHistoryResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "limit": 20,
  "hasMore": true,
  "cursor": 2024-12-16T10:00:00.000Z,
} satisfies RideHistoryResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideHistoryResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


