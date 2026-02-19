
# DeviceResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | object
`platform` | string
`pushToken` | string
`pushProvider` | string
`appVariant` | string
`appVersion` | object
`osVersion` | object
`model` | object
`isActive` | boolean
`lastSeenAt` | Date
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { DeviceResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "userId": 123e4567-e89b-12d3-a456-426614174001,
  "platform": ios,
  "pushToken": fcm_token_here,
  "pushProvider": fcm,
  "appVariant": rider,
  "appVersion": 1.2.3,
  "osVersion": 17.4,
  "model": iPhone 15 Pro,
  "isActive": true,
  "lastSeenAt": 2024-12-16T10:30Z,
  "createdAt": 2024-12-16T10:30Z,
  "updatedAt": 2024-12-16T10:30Z,
} satisfies DeviceResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeviceResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


