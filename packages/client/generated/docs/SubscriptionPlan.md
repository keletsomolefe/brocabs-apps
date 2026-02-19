
# SubscriptionPlan


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`price` | number
`durationDays` | number
`description` | object
`features` | Array&lt;string&gt;
`chargebeePlanId` | string
`requiresApproval` | boolean
`isActive` | boolean
`isPopular` | boolean
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { SubscriptionPlan } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "price": null,
  "durationDays": null,
  "description": null,
  "features": null,
  "chargebeePlanId": null,
  "requiresApproval": null,
  "isActive": null,
  "isPopular": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies SubscriptionPlan

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SubscriptionPlan
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


