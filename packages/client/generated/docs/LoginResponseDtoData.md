
# LoginResponseDtoData


## Properties

Name | Type
------------ | -------------
`nextStep` | string
`applicationType` | string
`onboardingState` | string
`identifier` | string
`identifierType` | string

## Example

```typescript
import type { LoginResponseDtoData } from ''

// TODO: Update the object below with actual values
const example = {
  "nextStep": null,
  "applicationType": null,
  "onboardingState": null,
  "identifier": null,
  "identifierType": null,
} satisfies LoginResponseDtoData

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as LoginResponseDtoData
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


