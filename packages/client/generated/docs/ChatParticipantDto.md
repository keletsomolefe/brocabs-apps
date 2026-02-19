
# ChatParticipantDto


## Properties

Name | Type
------------ | -------------
`participantId` | string
`profileId` | string
`displayName` | string
`avatarUrl` | object
`lastSeenMessageId` | object
`lastSeenAt` | object

## Example

```typescript
import type { ChatParticipantDto } from ''

// TODO: Update the object below with actual values
const example = {
  "participantId": 123e4567-e89b-12d3-a456-426614174000,
  "profileId": 123e4567-e89b-12d3-a456-426614174001,
  "displayName": Keletso,
  "avatarUrl": https://cdn.brocabs.com/avatars/rider.png,
  "lastSeenMessageId": 123e4567-e89b-12d3-a456-426614174002,
  "lastSeenAt": 2024-12-16T10:00:00.000Z,
} satisfies ChatParticipantDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChatParticipantDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


