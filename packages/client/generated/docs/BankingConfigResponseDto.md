
# BankingConfigResponseDto


## Properties

Name | Type
------------ | -------------
`accountTypes` | [Array&lt;OptionDto&gt;](OptionDto.md)
`bankNames` | [Array&lt;OptionDto&gt;](OptionDto.md)

## Example

```typescript
import type { BankingConfigResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "accountTypes": null,
  "bankNames": null,
} satisfies BankingConfigResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as BankingConfigResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


