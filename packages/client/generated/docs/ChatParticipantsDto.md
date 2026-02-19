
# ChatParticipantsDto


## Properties

Name | Type
------------ | -------------
`rider` | [ChatParticipantDto](ChatParticipantDto.md)
`driver` | [ChatParticipantDto](ChatParticipantDto.md)

## Example

```typescript
import type { ChatParticipantsDto } from ''

// TODO: Update the object below with actual values
const example = {
  "rider": null,
  "driver": null,
} satisfies ChatParticipantsDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChatParticipantsDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


