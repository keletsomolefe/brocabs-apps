# RideTypesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**rideTypesControllerFindOne**](RideTypesApi.md#ridetypescontrollerfindone) | **GET** /ride-types/{id} | Get a ride type by ID |
| [**rideTypesControllerListActiveRideTypes**](RideTypesApi.md#ridetypescontrollerlistactiveridetypes) | **GET** /ride-types | List active ride types |
| [**rideTypesControllerListAllRideTypes**](RideTypesApi.md#ridetypescontrollerlistallridetypes) | **GET** /ride-types/all | List all ride types (active/inactive) |
| [**rideTypesControllerUpdate**](RideTypesApi.md#ridetypescontrollerupdate) | **PATCH** /ride-types/{id} | Update a ride type |



## rideTypesControllerFindOne

> RideTypeResponseDto rideTypesControllerFindOne(id)

Get a ride type by ID

### Example

```ts
import {
  Configuration,
  RideTypesApi,
} from '';
import type { RideTypesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RideTypesApi();

  const body = {
    // number
    id: 8.14,
  } satisfies RideTypesControllerFindOneRequest;

  try {
    const data = await api.rideTypesControllerFindOne(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**RideTypeResponseDto**](RideTypeResponseDto.md)

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


## rideTypesControllerListActiveRideTypes

> RideTypeListResponseDto rideTypesControllerListActiveRideTypes()

List active ride types

### Example

```ts
import {
  Configuration,
  RideTypesApi,
} from '';
import type { RideTypesControllerListActiveRideTypesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RideTypesApi();

  try {
    const data = await api.rideTypesControllerListActiveRideTypes();
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

[**RideTypeListResponseDto**](RideTypeListResponseDto.md)

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


## rideTypesControllerListAllRideTypes

> RideTypeListResponseDto rideTypesControllerListAllRideTypes()

List all ride types (active/inactive)

### Example

```ts
import {
  Configuration,
  RideTypesApi,
} from '';
import type { RideTypesControllerListAllRideTypesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RideTypesApi();

  try {
    const data = await api.rideTypesControllerListAllRideTypes();
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

[**RideTypeListResponseDto**](RideTypeListResponseDto.md)

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


## rideTypesControllerUpdate

> RideTypeResponseDto rideTypesControllerUpdate(id, updateRideTypeDto)

Update a ride type

### Example

```ts
import {
  Configuration,
  RideTypesApi,
} from '';
import type { RideTypesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RideTypesApi();

  const body = {
    // number
    id: 8.14,
    // UpdateRideTypeDto
    updateRideTypeDto: ...,
  } satisfies RideTypesControllerUpdateRequest;

  try {
    const data = await api.rideTypesControllerUpdate(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |
| **updateRideTypeDto** | [UpdateRideTypeDto](UpdateRideTypeDto.md) |  | |

### Return type

[**RideTypeResponseDto**](RideTypeResponseDto.md)

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

