
# RideDetailDriverProfileDto


## Properties

Name | Type
------------ | -------------
`id` | string
`fullName` | string
`phoneNumber` | string
`avatar` | [ActiveRideAvatarDto](ActiveRideAvatarDto.md)
`rating` | number
`vehicle` | [ActiveRideVehicleDto](ActiveRideVehicleDto.md)
`avatarUrl` | object

## Example

```typescript
import type { RideDetailDriverProfileDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "fullName": null,
  "phoneNumber": null,
  "avatar": null,
  "rating": null,
  "vehicle": null,
  "avatarUrl": https://cdn.brocabs.com/avatars/driver.png,
} satisfies RideDetailDriverProfileDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RideDetailDriverProfileDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


