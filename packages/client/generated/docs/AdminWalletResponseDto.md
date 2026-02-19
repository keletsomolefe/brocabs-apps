
# AdminWalletResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`balance` | number
`userId` | string
`userName` | string
`userEmail` | string
`userPhoneNumber` | string
`userType` | string
`userIsActive` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { AdminWalletResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "balance": 1500,
  "userId": null,
  "userName": John Doe,
  "userEmail": john@example.com,
  "userPhoneNumber": null,
  "userType": rider,
  "userIsActive": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies AdminWalletResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminWalletResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


