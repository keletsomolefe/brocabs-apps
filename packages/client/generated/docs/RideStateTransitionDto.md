
# RideStateTransitionDto


## Properties

Name | Type
------------ | -------------
`id` | string
`rideId` | string
`fromState` | string
`toState` | string
`changedByRole` | string
`changedAt` | Date
`reason` | object

## Example

```typescript
import type { RideStateTransitionDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": 123e4567-e89b-12d3-a456-426614174000,
  "rideId": 123e4567-e89b-12d3-a456-426614174001,
  "fromState": null,
  "toState": null,
  "changedByRole": null,
  "changedAt": 2024-12-16T10:15Z,
  "reason": driver_accepted,
} satisfies RideStateTransitionDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideStateTransitionDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


