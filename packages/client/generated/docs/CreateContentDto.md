
# CreateContentDto


## Properties

Name | Type
------------ | -------------
`type` | string
`target` | string
`title` | string
`body` | string
`sortOrder` | number
`isActive` | boolean

## Example

```typescript
import type { CreateContentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "type": faq,
  "target": all,
  "title": What is this app?,
  "body": This is the app description content...,
  "sortOrder": 0,
  "isActive": true,
} satisfies CreateContentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreateContentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


