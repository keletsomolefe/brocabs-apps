
# RegisterDeviceDto


## Properties

Name | Type
------------ | -------------
`platform` | string
`pushToken` | string
`pushProvider` | string
`appVariant` | string
`appVersion` | string
`osVersion` | string
`model` | string

## Example

```typescript
import type { RegisterDeviceDto } from ''

// TODO: Update the object below with actual values
const example = {
  "platform": null,
  "pushToken": null,
  "pushProvider": null,
  "appVariant": null,
  "appVersion": null,
  "osVersion": null,
  "model": null,
} satisfies RegisterDeviceDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as RegisterDeviceDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


