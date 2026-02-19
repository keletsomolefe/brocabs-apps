
# AdminSubscriptionStatsDto


## Properties

Name | Type
------------ | -------------
`totalSubscriptions` | number
`activeSubscriptions` | number
`pendingApproval` | number
`expiredSubscriptions` | number
`cancelledSubscriptions` | number
`paymentFailedSubscriptions` | number
`rejectedSubscriptions` | number
`totalRevenue` | number
`monthlyRevenue` | number
`activePlansCount` | number
`subscriptionsByPlan` | object

## Example

```typescript
import type { AdminSubscriptionStatsDto } from ''

// TODO: Update the object below with actual values
const example = {
  "totalSubscriptions": null,
  "activeSubscriptions": null,
  "pendingApproval": null,
  "expiredSubscriptions": null,
  "cancelledSubscriptions": null,
  "paymentFailedSubscriptions": null,
  "rejectedSubscriptions": null,
  "totalRevenue": null,
  "monthlyRevenue": null,
  "activePlansCount": null,
  "subscriptionsByPlan": null,
} satisfies AdminSubscriptionStatsDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminSubscriptionStatsDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


