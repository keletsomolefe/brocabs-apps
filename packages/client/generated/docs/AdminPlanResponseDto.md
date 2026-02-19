
# AdminPlanResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`name` | string
`price` | number
`durationDays` | number
`description` | object
`chargebeePlanId` | object
`features` | Array&lt;string&gt;
`requiresApproval` | boolean
`isActive` | boolean
`activeSubscriptionsCount` | number
`totalSubscriptionsCount` | number
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { AdminPlanResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "price": null,
  "durationDays": null,
  "description": null,
  "chargebeePlanId": null,
  "features": null,
  "requiresApproval": null,
  "isActive": null,
  "activeSubscriptionsCount": null,
  "totalSubscriptionsCount": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies AdminPlanResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminPlanResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


