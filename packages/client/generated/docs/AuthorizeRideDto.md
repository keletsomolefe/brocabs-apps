
# AuthorizeRideDto


## Properties

Name | Type
------------ | -------------
`quoteId` | string
`rideTypeId` | number
`paymentMethod` | string

## Example

```typescript
import type { AuthorizeRideDto } from ''

// TODO: Update the object below with actual values
const example = {
  "quoteId": null,
  "rideTypeId": null,
  "paymentMethod": null,
} satisfies AuthorizeRideDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AuthorizeRideDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


