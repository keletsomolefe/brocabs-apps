
# ApplicationPaymentDto


## Properties

Name | Type
------------ | -------------
`amount` | number
`reference` | string
`status` | string
`paymentMethod` | string
`paidAt` | Date

## Example

```typescript
import type { ApplicationPaymentDto } from ''

// TODO: Update the object below with actual values
const example = {
  "amount": 500,
  "reference": 123e4567-e89b-12d3-a456-426614174000,
  "status": COMPLETED,
  "paymentMethod": CARD,
  "paidAt": 2024-01-15T10:30Z,
} satisfies ApplicationPaymentDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApplicationPaymentDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


