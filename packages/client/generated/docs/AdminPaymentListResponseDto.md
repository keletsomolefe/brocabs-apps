
# AdminPaymentListResponseDto


## Properties

Name | Type
------------ | -------------
`data` | [Array&lt;AdminPaymentResponseDto&gt;](AdminPaymentResponseDto.md)
`total` | number
`limit` | number
`offset` | number

## Example

```typescript
import type { AdminPaymentListResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "data": null,
  "total": 5000,
  "limit": 10,
  "offset": 0,
} satisfies AdminPaymentListResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminPaymentListResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


