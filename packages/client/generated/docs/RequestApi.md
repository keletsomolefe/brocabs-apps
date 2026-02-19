# RequestApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**requestControllerCreate**](RequestApi.md#requestcontrollercreate) | **POST** /requests |  |
| [**requestControllerFindAll**](RequestApi.md#requestcontrollerfindall) | **GET** /requests |  |
| [**requestControllerFindOne**](RequestApi.md#requestcontrollerfindone) | **GET** /requests/{id} |  |
| [**requestControllerRemove**](RequestApi.md#requestcontrollerremove) | **DELETE** /requests/{id} |  |
| [**requestControllerUpdate**](RequestApi.md#requestcontrollerupdate) | **PATCH** /requests/{id} |  |



## requestControllerCreate

> requestControllerCreate(body)



### Example

```ts
import {
  Configuration,
  RequestApi,
} from '';
import type { RequestControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RequestApi();

  const body = {
    // object
    body: Object,
  } satisfies RequestControllerCreateRequest;

  try {
    const data = await api.requestControllerCreate(body);
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
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## requestControllerFindAll

> requestControllerFindAll()



### Example

```ts
import {
  Configuration,
  RequestApi,
} from '';
import type { RequestControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RequestApi();

  try {
    const data = await api.requestControllerFindAll();
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

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## requestControllerFindOne

> requestControllerFindOne(id)



### Example

```ts
import {
  Configuration,
  RequestApi,
} from '';
import type { RequestControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RequestApi();

  const body = {
    // string
    id: id_example,
  } satisfies RequestControllerFindOneRequest;

  try {
    const data = await api.requestControllerFindOne(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## requestControllerRemove

> requestControllerRemove(id)



### Example

```ts
import {
  Configuration,
  RequestApi,
} from '';
import type { RequestControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RequestApi();

  const body = {
    // string
    id: id_example,
  } satisfies RequestControllerRemoveRequest;

  try {
    const data = await api.requestControllerRemove(body);
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## requestControllerUpdate

> requestControllerUpdate(id, body)



### Example

```ts
import {
  Configuration,
  RequestApi,
} from '';
import type { RequestControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RequestApi();

  const body = {
    // string
    id: id_example,
    // object
    body: Object,
  } satisfies RequestControllerUpdateRequest;

  try {
    const data = await api.requestControllerUpdate(body);
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
| **body** | `object` |  | |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

