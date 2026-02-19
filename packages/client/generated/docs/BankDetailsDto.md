
# BankDetailsDto


## Properties

Name | Type
------------ | -------------
`accountHolder` | string
`accountNumber` | string
`accountType` | string
`bank` | string
`bankName` | string
`branchCode` | string

## Example

```typescript
import type { BankDetailsDto } from ''

// TODO: Update the object below with actual values
const example = {
  "accountHolder": null,
  "accountNumber": 123***7890,
  "accountType": CHECKING,
  "bank": FNB,
  "bankName": First National Bank,
  "branchCode": 250655,
} satisfies BankDetailsDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BankDetailsDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


