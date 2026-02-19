
# RideActionReasonResponseDto


## Properties

Name | Type
------------ | -------------
`id` | string
`actionType` | string
`actorRole` | string
`code` | string
`label` | string
`requiresComment` | boolean
`isPenalizable` | boolean
`affectsRating` | boolean
`sortOrder` | number

## Example

```typescript
import type { RideActionReasonResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": b2c1f40e-2f6d-4d14-9c2a-8cb4e83ad8b0,
  "actionType": null,
  "actorRole": null,
  "code": unsafe_dropoff,
  "label": Unsafe drop-off,
  "requiresComment": false,
  "isPenalizable": false,
  "affectsRating": false,
  "sortOrder": 0,
} satisfies RideActionReasonResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideActionReasonResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


