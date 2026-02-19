
# ChatResponseDto


## Properties

Name | Type
------------ | -------------
`rideId` | string
`participants` | [ChatParticipantsDto](ChatParticipantsDto.md)
`messages` | [Array&lt;MessageResponseDto&gt;](MessageResponseDto.md)
`paging` | [ChatPagingDto](ChatPagingDto.md)

## Example

```typescript
import type { ChatResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "rideId": 123e4567-e89b-12d3-a456-426614174004,
  "participants": null,
  "messages": null,
  "paging": null,
} satisfies ChatResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChatResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


