
# WalletBalanceDto


## Properties

Name | Type
------------ | -------------
`balance` | number
`profileId` | string
`profileType` | string
`userId` | string

## Example

```typescript
import type { WalletBalanceDto } from ''

// TODO: Update the object below with actual values
const example = {
  "balance": 500.75,
  "profileId": 123e4567-e89b-12d3-a456-426614174000,
  "profileType": rider,
  "userId": 123e4567-e89b-12d3-a456-426614174000,
} satisfies WalletBalanceDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as WalletBalanceDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


