
# DriverAppProfileDto


## Properties

Name | Type
------------ | -------------
`id` | string
`fullName` | string
`gender` | string
`avatar` | [AvatarDto](AvatarDto.md)
`licenseNumber` | string
`licenseExpiry` | string
`totalRides` | number
`rating` | number
`vehicleId` | string

## Example

```typescript
import type { DriverAppProfileDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "fullName": null,
  "gender": null,
  "avatar": null,
  "licenseNumber": null,
  "licenseExpiry": null,
  "totalRides": null,
  "rating": null,
  "vehicleId": null,
} satisfies DriverAppProfileDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DriverAppProfileDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


