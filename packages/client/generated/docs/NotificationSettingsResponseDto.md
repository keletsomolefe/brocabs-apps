
# NotificationSettingsResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`generalUpdates` | boolean
`safetySecurityAlerts` | boolean
`rideStatusUpdates` | boolean
`ratingReviews` | boolean
`appUpdates` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { NotificationSettingsResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userId": null,
  "generalUpdates": null,
  "safetySecurityAlerts": null,
  "rideStatusUpdates": null,
  "ratingReviews": null,
  "appUpdates": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies NotificationSettingsResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NotificationSettingsResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


