
# PaymentResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`amount` | number
`type` | string
`source` | string
`status` | string
`reference` | string
`providerReference` | object
`description` | object
`metadata` | object
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { PaymentResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "amount": 100.5,
  "type": null,
  "source": null,
  "status": null,
  "reference": 123e4567-e89b-12d3-a456-426614174000,
  "providerReference": TRADESAFE-TX-12345,
  "description": Payment for ride #12345,
  "metadata": {"cardLast4":"4242","rideId":"12345"},
  "createdAt": null,
  "updatedAt": null,
} satisfies PaymentResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PaymentResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


