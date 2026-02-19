# OperatingZonesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**operatingZonesControllerCheckPoint**](OperatingZonesApi.md#operatingzonescontrollercheckpoint) | **GET** /operating-zones/check-point | Check if a point is within an active operating zone |
| [**operatingZonesControllerCreate**](OperatingZonesApi.md#operatingzonescontrollercreate) | **POST** /operating-zones | Create a new operating zone |
| [**operatingZonesControllerFindAll**](OperatingZonesApi.md#operatingzonescontrollerfindall) | **GET** /operating-zones | Get all operating zones |
| [**operatingZonesControllerFindOne**](OperatingZonesApi.md#operatingzonescontrollerfindone) | **GET** /operating-zones/{id} | Get a single operating zone by ID |
| [**operatingZonesControllerRemove**](OperatingZonesApi.md#operatingzonescontrollerremove) | **DELETE** /operating-zones/{id} | Delete an operating zone |
| [**operatingZonesControllerUpdate**](OperatingZonesApi.md#operatingzonescontrollerupdate) | **PATCH** /operating-zones/{id} | Update an operating zone |



## operatingZonesControllerCheckPoint

> OperatingZonesControllerCheckPoint200Response operatingZonesControllerCheckPoint(latitude, longitude)

Check if a point is within an active operating zone

### Example

```ts
import {
  Configuration,
  OperatingZonesApi,
} from '';
import type { OperatingZonesControllerCheckPointRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OperatingZonesApi();

  const body = {
    // number
    latitude: 8.14,
    // number
    longitude: 8.14,
  } satisfies OperatingZonesControllerCheckPointRequest;

  try {
    const data = await api.operatingZonesControllerCheckPoint(body);
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
| **latitude** | `number` |  | [Defaults to `undefined`] |
| **longitude** | `number` |  | [Defaults to `undefined`] |

### Return type

[**OperatingZonesControllerCheckPoint200Response**](OperatingZonesControllerCheckPoint200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Point check result |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## operatingZonesControllerCreate

> OperatingZoneResponseDto operatingZonesControllerCreate(createOperatingZoneDto)

Create a new operating zone

### Example

```ts
import {
  Configuration,
  OperatingZonesApi,
} from '';
import type { OperatingZonesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OperatingZonesApi();

  const body = {
    // CreateOperatingZoneDto
    createOperatingZoneDto: ...,
  } satisfies OperatingZonesControllerCreateRequest;

  try {
    const data = await api.operatingZonesControllerCreate(body);
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
| **createOperatingZoneDto** | [CreateOperatingZoneDto](CreateOperatingZoneDto.md) |  | |

### Return type

[**OperatingZoneResponseDto**](OperatingZoneResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Operating zone created successfully |  -  |
| **400** | Invalid input or duplicate name |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## operatingZonesControllerFindAll

> Array&lt;OperatingZoneResponseDto&gt; operatingZonesControllerFindAll(activeOnly)

Get all operating zones

### Example

```ts
import {
  Configuration,
  OperatingZonesApi,
} from '';
import type { OperatingZonesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OperatingZonesApi();

  const body = {
    // boolean | Filter to only active zones (optional)
    activeOnly: true,
  } satisfies OperatingZonesControllerFindAllRequest;

  try {
    const data = await api.operatingZonesControllerFindAll(body);
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
| **activeOnly** | `boolean` | Filter to only active zones | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;OperatingZoneResponseDto&gt;**](OperatingZoneResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of operating zones |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## operatingZonesControllerFindOne

> OperatingZoneResponseDto operatingZonesControllerFindOne(id)

Get a single operating zone by ID

### Example

```ts
import {
  Configuration,
  OperatingZonesApi,
} from '';
import type { OperatingZonesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OperatingZonesApi();

  const body = {
    // string
    id: id_example,
  } satisfies OperatingZonesControllerFindOneRequest;

  try {
    const data = await api.operatingZonesControllerFindOne(body);
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

[**OperatingZoneResponseDto**](OperatingZoneResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Operating zone details |  -  |
| **404** | Operating zone not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## operatingZonesControllerRemove

> operatingZonesControllerRemove(id)

Delete an operating zone

### Example

```ts
import {
  Configuration,
  OperatingZonesApi,
} from '';
import type { OperatingZonesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OperatingZonesApi();

  const body = {
    // string
    id: id_example,
  } satisfies OperatingZonesControllerRemoveRequest;

  try {
    const data = await api.operatingZonesControllerRemove(body);
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
| **200** | Operating zone deleted successfully |  -  |
| **404** | Operating zone not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## operatingZonesControllerUpdate

> OperatingZoneResponseDto operatingZonesControllerUpdate(id, updateOperatingZoneDto)

Update an operating zone

### Example

```ts
import {
  Configuration,
  OperatingZonesApi,
} from '';
import type { OperatingZonesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OperatingZonesApi();

  const body = {
    // string
    id: id_example,
    // UpdateOperatingZoneDto
    updateOperatingZoneDto: ...,
  } satisfies OperatingZonesControllerUpdateRequest;

  try {
    const data = await api.operatingZonesControllerUpdate(body);
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
| **updateOperatingZoneDto** | [UpdateOperatingZoneDto](UpdateOperatingZoneDto.md) |  | |

### Return type

[**OperatingZoneResponseDto**](OperatingZoneResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Operating zone updated successfully |  -  |
| **404** | Operating zone not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

