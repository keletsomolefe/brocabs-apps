# RidesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**rideActionReasonsControllerListReasons**](RidesApi.md#rideactionreasonscontrollerlistreasons) | **GET** /rides/actions/reasons | List ride action reasons |
| [**rideCancellationReasonsControllerListReasons**](RidesApi.md#ridecancellationreasonscontrollerlistreasons) | **GET** /rides/cancellation-reasons | List ride cancellation reasons |
| [**rideQuotesControllerCreateRideQuote**](RidesApi.md#ridequotescontrollercreateridequote) | **POST** /rides/quotes | Create ride quotes for all ride types |
| [**rideRatingsControllerRateRide**](RidesApi.md#rideratingscontrollerrateride) | **POST** /rides/{id}/rate | Rate a completed ride |
| [**ridesControllerAcceptRide**](RidesApi.md#ridescontrolleracceptride) | **POST** /rides/{id}/accept | Accept a ride request as a driver |
| [**ridesControllerCancelRide**](RidesApi.md#ridescontrollercancelride) | **POST** /rides/{id}/cancel | Cancel a ride request |
| [**ridesControllerCompleteRide**](RidesApi.md#ridescontrollercompleteride) | **POST** /rides/{id}/complete | Complete the ride (dropoff) |
| [**ridesControllerConfirmArrival**](RidesApi.md#ridescontrollerconfirmarrival) | **POST** /rides/{id}/confirm-arrival | Confirm arrival at the pickup location |
| [**ridesControllerCreateRide**](RidesApi.md#ridescontrollercreateride) | **POST** /rides | Create a ride request from a quote |
| [**ridesControllerGetRideDetail**](RidesApi.md#ridescontrollergetridedetail) | **GET** /rides/{id} | Get ride details by id |
| [**ridesControllerGetRideHistory**](RidesApi.md#ridescontrollergetridehistory) | **GET** /rides/history | List ride history for the authenticated user |
| [**ridesControllerGetRideNavigation**](RidesApi.md#ridescontrollergetridenavigation) | **GET** /rides/{id}/navigation | Get navigation details for a ride |
| [**ridesControllerMarkRiderNoShow**](RidesApi.md#ridescontrollermarkridernoshow) | **POST** /rides/{id}/rider-no-show | Mark a rider as a no-show after arrival |
| [**ridesControllerRejectRide**](RidesApi.md#ridescontrollerrejectride) | **POST** /rides/{id}/reject | Reject a ride request as a driver |
| [**ridesControllerRetryRide**](RidesApi.md#ridescontrollerretryride) | **POST** /rides/{id}/retry | Retry a ride request when no driver was found |
| [**ridesControllerStartRide**](RidesApi.md#ridescontrollerstartride) | **POST** /rides/{id}/start | Start the ride (pickup -&gt; dropoff) |
| [**ridesMeControllerGetActiveRide**](RidesApi.md#ridesmecontrollergetactiveride) | **GET** /me/active-ride | Get active ride for the authenticated rider or driver |



## rideActionReasonsControllerListReasons

> RideActionReasonListResponseDto rideActionReasonsControllerListReasons(actionType, actorRole)

List ride action reasons

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RideActionReasonsControllerListReasonsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // 'end_trip' | 'cancel_ride'
    actionType: actionType_example,
    // 'driver' | 'rider' | 'system'
    actorRole: actorRole_example,
  } satisfies RideActionReasonsControllerListReasonsRequest;

  try {
    const data = await api.rideActionReasonsControllerListReasons(body);
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
| **actionType** | `end_trip`, `cancel_ride` |  | [Defaults to `undefined`] [Enum: end_trip, cancel_ride] |
| **actorRole** | `driver`, `rider`, `system` |  | [Defaults to `undefined`] [Enum: driver, rider, system] |

### Return type

[**RideActionReasonListResponseDto**](RideActionReasonListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rideCancellationReasonsControllerListReasons

> RideCancellationReasonListResponseDto rideCancellationReasonsControllerListReasons()

List ride cancellation reasons

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RideCancellationReasonsControllerListReasonsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  try {
    const data = await api.rideCancellationReasonsControllerListReasons();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**RideCancellationReasonListResponseDto**](RideCancellationReasonListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rideQuotesControllerCreateRideQuote

> RideQuoteResponseDto rideQuotesControllerCreateRideQuote(createRideQuoteDto)

Create ride quotes for all ride types

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RideQuotesControllerCreateRideQuoteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // CreateRideQuoteDto
    createRideQuoteDto: ...,
  } satisfies RideQuotesControllerCreateRideQuoteRequest;

  try {
    const data = await api.rideQuotesControllerCreateRideQuote(body);
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
| **createRideQuoteDto** | [CreateRideQuoteDto](CreateRideQuoteDto.md) |  | |

### Return type

[**RideQuoteResponseDto**](RideQuoteResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## rideRatingsControllerRateRide

> RateRideResponseDto rideRatingsControllerRateRide(id, rateRideDto)

Rate a completed ride

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RideRatingsControllerRateRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

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


## ridesControllerAcceptRide

> RideResponseDto ridesControllerAcceptRide(id)

Accept a ride request as a driver

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerAcceptRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerAcceptRideRequest;

  try {
    const data = await api.ridesControllerAcceptRide(body);
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

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerCancelRide

> RideResponseDto ridesControllerCancelRide(id, cancelRideDto)

Cancel a ride request

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerCancelRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
    // CancelRideDto
    cancelRideDto: ...,
  } satisfies RidesControllerCancelRideRequest;

  try {
    const data = await api.ridesControllerCancelRide(body);
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
| **cancelRideDto** | [CancelRideDto](CancelRideDto.md) |  | |

### Return type

[**RideResponseDto**](RideResponseDto.md)

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


## ridesControllerCompleteRide

> RideResponseDto ridesControllerCompleteRide(id, completeRideDto)

Complete the ride (dropoff)

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerCompleteRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
    // CompleteRideDto
    completeRideDto: ...,
  } satisfies RidesControllerCompleteRideRequest;

  try {
    const data = await api.ridesControllerCompleteRide(body);
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
| **completeRideDto** | [CompleteRideDto](CompleteRideDto.md) |  | |

### Return type

[**RideResponseDto**](RideResponseDto.md)

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


## ridesControllerConfirmArrival

> RideResponseDto ridesControllerConfirmArrival(id)

Confirm arrival at the pickup location

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerConfirmArrivalRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerConfirmArrivalRequest;

  try {
    const data = await api.ridesControllerConfirmArrival(body);
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

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerCreateRide

> RideResponseDto ridesControllerCreateRide(createRideDto)

Create a ride request from a quote

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerCreateRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // CreateRideDto
    createRideDto: ...,
  } satisfies RidesControllerCreateRideRequest;

  try {
    const data = await api.ridesControllerCreateRide(body);
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
| **createRideDto** | [CreateRideDto](CreateRideDto.md) |  | |

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerGetRideDetail

> RideDetailResponseDto ridesControllerGetRideDetail(id)

Get ride details by id

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerGetRideDetailRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerGetRideDetailRequest;

  try {
    const data = await api.ridesControllerGetRideDetail(body);
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

### Return type

[**RideDetailResponseDto**](RideDetailResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | Ride not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerGetRideHistory

> RideHistoryResponseDto ridesControllerGetRideHistory(cursor, status, limit)

List ride history for the authenticated user

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerGetRideHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string (optional)
    cursor: cursor_example,
    // 'all' | 'completed' | 'cancelled' (optional)
    status: status_example,
    // number (optional)
    limit: 56,
  } satisfies RidesControllerGetRideHistoryRequest;

  try {
    const data = await api.ridesControllerGetRideHistory(body);
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
| **cursor** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `all`, `completed`, `cancelled` |  | [Optional] [Defaults to `&#39;all&#39;`] [Enum: all, completed, cancelled] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**RideHistoryResponseDto**](RideHistoryResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerGetRideNavigation

> RideNavigationResponseDto ridesControllerGetRideNavigation(id)

Get navigation details for a ride

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerGetRideNavigationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerGetRideNavigationRequest;

  try {
    const data = await api.ridesControllerGetRideNavigation(body);
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

### Return type

[**RideNavigationResponseDto**](RideNavigationResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | Ride not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerMarkRiderNoShow

> RideResponseDto ridesControllerMarkRiderNoShow(id)

Mark a rider as a no-show after arrival

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerMarkRiderNoShowRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerMarkRiderNoShowRequest;

  try {
    const data = await api.ridesControllerMarkRiderNoShow(body);
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

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerRejectRide

> ridesControllerRejectRide(id)

Reject a ride request as a driver

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerRejectRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerRejectRideRequest;

  try {
    const data = await api.ridesControllerRejectRide(body);
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

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerRetryRide

> RideResponseDto ridesControllerRetryRide(id)

Retry a ride request when no driver was found

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerRetryRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerRetryRideRequest;

  try {
    const data = await api.ridesControllerRetryRide(body);
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

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesControllerStartRide

> RideResponseDto ridesControllerStartRide(id)

Start the ride (pickup -&gt; dropoff)

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesControllerStartRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  const body = {
    // string
    id: id_example,
  } satisfies RidesControllerStartRideRequest;

  try {
    const data = await api.ridesControllerStartRide(body);
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

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## ridesMeControllerGetActiveRide

> RideResponseDto ridesMeControllerGetActiveRide()

Get active ride for the authenticated rider or driver

### Example

```ts
import {
  Configuration,
  RidesApi,
} from '';
import type { RidesMeControllerGetActiveRideRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RidesApi();

  try {
    const data = await api.ridesMeControllerGetActiveRide();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**RideResponseDto**](RideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | No active ride |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

