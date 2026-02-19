
# DriverSubscription


## Properties

Name | Type
------------ | -------------
`id` | string
`driverProfileId` | string
`planId` | string
`plan` | [SubscriptionPlan](SubscriptionPlan.md)
`status` | string
`startDate` | Date
`endDate` | object
`autoRenew` | boolean
`chargebeeSubscriptionId` | object
`chargebeeCustomerId` | object
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { DriverSubscription } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "driverProfileId": null,
  "planId": null,
  "plan": null,
  "status": null,
  "startDate": null,
  "endDate": null,
  "autoRenew": null,
  "chargebeeSubscriptionId": null,
  "chargebeeCustomerId": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies DriverSubscription

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DriverSubscription
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


