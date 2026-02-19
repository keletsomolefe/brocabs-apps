
# CreatePlanDto


## Properties

Name | Type
------------ | -------------
`name` | string
`price` | number
`durationDays` | number
`description` | string
`chargebeePlanId` | string
`features` | Array&lt;string&gt;
`requiresApproval` | boolean
`isActive` | boolean

## Example

```typescript
import type { CreatePlanDto } from ''

// TODO: Update the object below with actual values
const example = {
  "name": null,
  "price": null,
  "durationDays": null,
  "description": null,
  "chargebeePlanId": null,
  "features": null,
  "requiresApproval": null,
  "isActive": null,
} satisfies CreatePlanDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as CreatePlanDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


