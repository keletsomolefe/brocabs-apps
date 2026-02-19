
# RideCancellationReasonResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`code` | string
`displayName` | string
`order` | number

## Example

```typescript
import type { RideCancellationReasonResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 1,
  "code": null,
  "displayName": Inappropriate customer behavior,
  "order": 1,
} satisfies RideCancellationReasonResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideCancellationReasonResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


