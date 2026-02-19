
# AdminSubscriptionResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`driverId` | string
`planId` | string
`status` | string
`startDate` | Date
`endDate` | object
`autoRenew` | boolean
`createdAt` | Date
`updatedAt` | Date
`driver` | [SubscriptionDriverInfoDto](SubscriptionDriverInfoDto.md)
`plan` | [SubscriptionPlanInfoDto](SubscriptionPlanInfoDto.md)

## Example

```typescript
import type { AdminSubscriptionResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "driverId": null,
  "planId": null,
  "status": null,
  "startDate": null,
  "endDate": null,
  "autoRenew": null,
  "createdAt": null,
  "updatedAt": null,
  "driver": null,
  "plan": null,
} satisfies AdminSubscriptionResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminSubscriptionResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


