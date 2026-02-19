
# AdminUserResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`fusionAuthId` | string
`fullName` | string
`email` | string
`phoneNumber` | string
`applicationType` | string
`gender` | object
`isActive` | boolean
`avatarUrl` | object
`createdAt` | Date
`updatedAt` | Date
`notificationSettings` | [AdminNotificationSettingsDto](AdminNotificationSettingsDto.md)

## Example

```typescript
import type { AdminUserResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "fusionAuthId": 123e4567-e89b-12d3-a456-426614174001,
  "fullName": John Doe,
  "email": john@example.com,
  "phoneNumber": +27123456789,
  "applicationType": rider,
  "gender": male,
  "isActive": true,
  "avatarUrl": https://storage.example.com/avatars/123.jpg,
  "createdAt": 2024-01-15T10:30Z,
  "updatedAt": 2024-12-10T15:45Z,
  "notificationSettings": null,
} satisfies AdminUserResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminUserResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


