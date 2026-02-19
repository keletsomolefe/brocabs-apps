
# NotificationResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`userId` | string
`type` | string
`profileType` | string
`title` | string
`description` | string
`isRead` | boolean
`createdAt` | Date

## Example

```typescript
import type { NotificationResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userId": null,
  "type": null,
  "profileType": null,
  "title": null,
  "description": null,
  "isRead": null,
  "createdAt": null,
} satisfies NotificationResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as NotificationResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


