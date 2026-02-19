
# MessageResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`rideId` | string
`senderType` | string
`messageType` | string
`body` | string
`metadata` | object
`createdAt` | Date

## Example

```typescript
import type { MessageResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "rideId": 123e4567-e89b-12d3-a456-426614174001,
  "senderType": rider,
  "messageType": text,
  "body": I'm at the pickup point.,
  "metadata": {"lat":-33.9249,"lng":18.4241},
  "createdAt": 2024-12-16T10:00Z,
} satisfies MessageResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as MessageResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


