
# ChargeCardResponseDto


## Properties

Name | Type
------------ | -------------
`success` | boolean
`transactionId` | string
`reference` | string
`state` | string

## Example

```typescript
import type { ChargeCardResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "success": null,
  "transactionId": null,
  "reference": null,
  "state": null,
} satisfies ChargeCardResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ChargeCardResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


