
# ContentResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`type` | string
`target` | string
`title` | string
`body` | string
`sortOrder` | number
`isActive` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { ContentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "type": faq,
  "target": all,
  "title": What is this app?,
  "body": This is the app description content...,
  "sortOrder": 0,
  "isActive": true,
  "createdAt": null,
  "updatedAt": null,
} satisfies ContentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ContentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


