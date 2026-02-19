# DriversApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**driverOffersControllerGetActiveOffers**](DriversApi.md#driverofferscontrollergetactiveoffers) | **GET** /drivers/active-offers | Get active ride offers for the authenticated driver |
| [**driverStatusControllerGetStatus**](DriversApi.md#driverstatuscontrollergetstatus) | **GET** /drivers/me/status | Get current status |
| [**driverStatusControllerGoOffline**](DriversApi.md#driverstatuscontrollergooffline) | **POST** /drivers/me/offline | Go offline |
| [**driverStatusControllerGoOnline**](DriversApi.md#driverstatuscontrollergoonline) | **POST** /drivers/me/online | Go online |



## driverOffersControllerGetActiveOffers

> Array&lt;DriverActiveOfferDto&gt; driverOffersControllerGetActiveOffers()

Get active ride offers for the authenticated driver

### Example

```ts
import {
  Configuration,
  DriversApi,
} from '';
import type { DriverOffersControllerGetActiveOffersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DriversApi();

  try {
    const data = await api.driverOffersControllerGetActiveOffers();
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

[**Array&lt;DriverActiveOfferDto&gt;**](DriverActiveOfferDto.md)

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


## driverStatusControllerGetStatus

> DriverStatusResponseDto driverStatusControllerGetStatus()

Get current status

### Example

```ts
import {
  Configuration,
  DriversApi,
} from '';
import type { DriverStatusControllerGetStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DriversApi();

  try {
    const data = await api.driverStatusControllerGetStatus();
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

[**DriverStatusResponseDto**](DriverStatusResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The current online status of the driver |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## driverStatusControllerGoOffline

> DriverStatusResponseDto driverStatusControllerGoOffline()

Go offline

### Example

```ts
import {
  Configuration,
  DriversApi,
} from '';
import type { DriverStatusControllerGoOfflineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DriversApi();

  try {
    const data = await api.driverStatusControllerGoOffline();
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

[**DriverStatusResponseDto**](DriverStatusResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Driver is now offline |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## driverStatusControllerGoOnline

> DriverStatusResponseDto driverStatusControllerGoOnline()

Go online

### Example

```ts
import {
  Configuration,
  DriversApi,
} from '';
import type { DriverStatusControllerGoOnlineRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DriversApi();

  try {
    const data = await api.driverStatusControllerGoOnline();
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

[**DriverStatusResponseDto**](DriverStatusResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Driver is now online |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

