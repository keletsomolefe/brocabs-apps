
# AdminStatsResponseDto


## Properties

Name | Type
------------ | -------------
`totalUsers` | number
`totalRiders` | number
`totalDrivers` | number
`activeDrivers` | number
`totalRides` | number
`todayRides` | number
`activeRides` | number
`totalRevenue` | number
`todayRevenue` | number
`pendingTransactions` | number
`totalDeposits` | number
`generatedAt` | Date

## Example

```typescript
import type { AdminStatsResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "totalUsers": 1250,
  "totalRiders": 1000,
  "totalDrivers": 250,
  "activeDrivers": 45,
  "totalRides": 15000,
  "todayRides": 320,
  "activeRides": 12,
  "totalRevenue": 750000.5,
  "todayRevenue": 12500,
  "pendingTransactions": 5,
  "totalDeposits": 500000,
  "generatedAt": 2024-12-16T10:30Z,
} satisfies AdminStatsResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as AdminStatsResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


