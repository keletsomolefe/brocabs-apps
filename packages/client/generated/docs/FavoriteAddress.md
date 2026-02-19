
# FavoriteAddress


## Properties

Name | Type
------------ | -------------
`id` | string
`label` | string
`address` | string
`latitude` | number
`longitude` | number
`placeId` | string
`riderProfileId` | string
`createdAt` | Date
`updatedAt` | Date

## Example

```typescript
import type { FavoriteAddress } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "label": null,
  "address": null,
  "latitude": null,
  "longitude": null,
  "placeId": null,
  "riderProfileId": null,
  "createdAt": null,
  "updatedAt": null,
} satisfies FavoriteAddress

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FavoriteAddress
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


