
# AdminRideListResponseDto


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;AdminRideResponseDto&gt;](AdminRideResponseDto.md)
`total` | number
`limit` | number
`offset` | number

## Example

```typescript
import type { AdminRideListResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "total": 1500,
  "limit": 10,
  "offset": 0,
} satisfies AdminRideListResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminRideListResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


