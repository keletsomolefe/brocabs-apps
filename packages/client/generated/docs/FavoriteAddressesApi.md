# FavoriteAddressesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**favoriteAddressesControllerCreate**](FavoriteAddressesApi.md#favoriteaddressescontrollercreate) | **POST** /favorite-addresses | Create a favorite address |
| [**favoriteAddressesControllerFindAll**](FavoriteAddressesApi.md#favoriteaddressescontrollerfindall) | **GET** /favorite-addresses | List all favorite addresses |
| [**favoriteAddressesControllerFindOne**](FavoriteAddressesApi.md#favoriteaddressescontrollerfindone) | **GET** /favorite-addresses/{id} | Get a favorite address by id |
| [**favoriteAddressesControllerRemove**](FavoriteAddressesApi.md#favoriteaddressescontrollerremove) | **DELETE** /favorite-addresses/{id} | Delete a favorite address |
| [**favoriteAddressesControllerUpdate**](FavoriteAddressesApi.md#favoriteaddressescontrollerupdate) | **PATCH** /favorite-addresses/{id} | Update a favorite address |



## favoriteAddressesControllerCreate

> FavoriteAddress favoriteAddressesControllerCreate(createFavoriteAddressDto)

Create a favorite address

### Example

```ts
import {
  Configuration,
  FavoriteAddressesApi,
} from '';
import type { FavoriteAddressesControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FavoriteAddressesApi();

  const body = {
    // CreateFavoriteAddressDto
    createFavoriteAddressDto: ...,
  } satisfies FavoriteAddressesControllerCreateRequest;

  try {
    const data = await api.favoriteAddressesControllerCreate(body);
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
| **createFavoriteAddressDto** | [CreateFavoriteAddressDto](CreateFavoriteAddressDto.md) |  | |

### Return type

[**FavoriteAddress**](FavoriteAddress.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The favorite address has been successfully created. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## favoriteAddressesControllerFindAll

> Array&lt;FavoriteAddress&gt; favoriteAddressesControllerFindAll()

List all favorite addresses

### Example

```ts
import {
  Configuration,
  FavoriteAddressesApi,
} from '';
import type { FavoriteAddressesControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FavoriteAddressesApi();

  try {
    const data = await api.favoriteAddressesControllerFindAll();
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

[**Array&lt;FavoriteAddress&gt;**](FavoriteAddress.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of all favorite addresses for the rider. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## favoriteAddressesControllerFindOne

> FavoriteAddress favoriteAddressesControllerFindOne(id)

Get a favorite address by id

### Example

```ts
import {
  Configuration,
  FavoriteAddressesApi,
} from '';
import type { FavoriteAddressesControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FavoriteAddressesApi();

  const body = {
    // string
    id: id_example,
  } satisfies FavoriteAddressesControllerFindOneRequest;

  try {
    const data = await api.favoriteAddressesControllerFindOne(body);
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

[**FavoriteAddress**](FavoriteAddress.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The favorite address. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## favoriteAddressesControllerRemove

> favoriteAddressesControllerRemove(id)

Delete a favorite address

### Example

```ts
import {
  Configuration,
  FavoriteAddressesApi,
} from '';
import type { FavoriteAddressesControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FavoriteAddressesApi();

  const body = {
    // string
    id: id_example,
  } satisfies FavoriteAddressesControllerRemoveRequest;

  try {
    const data = await api.favoriteAddressesControllerRemove(body);
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
| **200** | The favorite address has been successfully deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## favoriteAddressesControllerUpdate

> FavoriteAddress favoriteAddressesControllerUpdate(id, updateFavoriteAddressDto)

Update a favorite address

### Example

```ts
import {
  Configuration,
  FavoriteAddressesApi,
} from '';
import type { FavoriteAddressesControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FavoriteAddressesApi();

  const body = {
    // string
    id: id_example,
    // UpdateFavoriteAddressDto
    updateFavoriteAddressDto: ...,
  } satisfies FavoriteAddressesControllerUpdateRequest;

  try {
    const data = await api.favoriteAddressesControllerUpdate(body);
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
| **updateFavoriteAddressDto** | [UpdateFavoriteAddressDto](UpdateFavoriteAddressDto.md) |  | |

### Return type

[**FavoriteAddress**](FavoriteAddress.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | The updated favorite address. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

