
# AdminNotificationSettingsDto


## Properties

Name | Type
------------ | -------------
`generalUpdates` | boolean
`safetySecurityAlerts` | boolean
`rideStatusUpdates` | boolean
`ratingReviews` | boolean
`appUpdates` | boolean

## Example

```typescript
import type { AdminNotificationSettingsDto } from ''

// TODO: Update the object below with actual values
const example = {
  "generalUpdates": true,
  "safetySecurityAlerts": true,
  "rideStatusUpdates": true,
  "ratingReviews": true,
  "appUpdates": true,
} satisfies AdminNotificationSettingsDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminNotificationSettingsDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


