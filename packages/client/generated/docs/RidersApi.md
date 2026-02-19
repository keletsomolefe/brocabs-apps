# RidersApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**rideRatingsControllerRateRide**](RidersApi.md#rideratingscontrollerrateride) | **POST** /riders/{id}/rate | Rate a completed ride |



## rideRatingsControllerRateRide

> RateRideResponseDto rideRatingsControllerRateRide(id, rateRideDto)

Rate a completed ride

### Example

```ts
import {
  Configuration,
  RidersApi,
} from '';
import type { RideRatingsControllerRateRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidersApi();

  const body = {
    // string
    id: id_example,
    // RateRideDto
    rateRideDto: ...,
  } satisfies RideRatingsControllerRateRideRequest;

  try {
    const data = await api.rideRatingsControllerRateRide(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **id** | `string` |  | [Defaults to `undefined`] |
| **rateRideDto** | [RateRideDto](RateRideDto.md) |  | |

### Return type

[**RateRideResponseDto**](RateRideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

