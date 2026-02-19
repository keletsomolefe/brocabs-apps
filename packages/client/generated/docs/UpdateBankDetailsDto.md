
# UpdateBankDetailsDto


## Properties

Name | Type
------------ | -------------
`accountHolderName` | string
`accountNumber` | string
`accountType` | string
`bankName` | string
`bank` | string
`branchCode` | string
`idNumber` | string

## Example

```typescript
import type { UpdateBankDetailsDto } from ''

// TODO: Update the object below with actual values
const example = {
  "accountHolderName": John Doe,
  "accountNumber": 123***7890,
  "accountType": CHECKING,
  "bankName": FNB,
  "bank": FNB,
  "branchCode": 250655,
  "idNumber": 9001015800080,
} satisfies UpdateBankDetailsDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as UpdateBankDetailsDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


