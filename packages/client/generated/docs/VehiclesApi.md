# VehiclesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**vehiclesControllerCreateMake**](VehiclesApi.md#vehiclescontrollercreatemake) | **POST** /vehicles/makes | Create a vehicle make (admin only) |
| [**vehiclesControllerCreateModel**](VehiclesApi.md#vehiclescontrollercreatemodel) | **POST** /vehicles/models | Create a vehicle model (admin only) |
| [**vehiclesControllerCreateVariant**](VehiclesApi.md#vehiclescontrollercreatevariant) | **POST** /vehicles/variants | Create a vehicle variant (admin only) |
| [**vehiclesControllerSearchMakes**](VehiclesApi.md#vehiclescontrollersearchmakes) | **GET** /vehicles/makes | Search vehicle makes |
| [**vehiclesControllerSearchModels**](VehiclesApi.md#vehiclescontrollersearchmodels) | **GET** /vehicles/models | Search vehicle models by make |
| [**vehiclesControllerSearchVariants**](VehiclesApi.md#vehiclescontrollersearchvariants) | **GET** /vehicles/variants | Search vehicle variants by model and optional year |
| [**vehiclesControllerUpdateMake**](VehiclesApi.md#vehiclescontrollerupdatemake) | **PATCH** /vehicles/makes/{id} | Update a vehicle make (admin only) |
| [**vehiclesControllerUpdateModel**](VehiclesApi.md#vehiclescontrollerupdatemodel) | **PATCH** /vehicles/models/{id} | Update a vehicle model (admin only) |
| [**vehiclesControllerUpdateVariant**](VehiclesApi.md#vehiclescontrollerupdatevariant) | **PATCH** /vehicles/variants/{id} | Update a vehicle variant (admin only) |



## vehiclesControllerCreateMake

> VehicleMakeResponseDto vehiclesControllerCreateMake(createMakeDto)

Create a vehicle make (admin only)

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerCreateMakeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // CreateMakeDto
    createMakeDto: ...,
  } satisfies VehiclesControllerCreateMakeRequest;

  try {
    const data = await api.vehiclesControllerCreateMake(body);
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
| **createMakeDto** | [CreateMakeDto](CreateMakeDto.md) |  | |

### Return type

[**VehicleMakeResponseDto**](VehicleMakeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **409** | Make already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerCreateModel

> VehicleModelResponseDto vehiclesControllerCreateModel(createModelDto)

Create a vehicle model (admin only)

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerCreateModelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // CreateModelDto
    createModelDto: ...,
  } satisfies VehiclesControllerCreateModelRequest;

  try {
    const data = await api.vehiclesControllerCreateModel(body);
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
| **createModelDto** | [CreateModelDto](CreateModelDto.md) |  | |

### Return type

[**VehicleModelResponseDto**](VehicleModelResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | Make does not exist |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **409** | Model already exists for this make |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerCreateVariant

> VehicleVariantResponseDto vehiclesControllerCreateVariant(createVariantDto)

Create a vehicle variant (admin only)

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerCreateVariantRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // CreateVariantDto
    createVariantDto: ...,
  } satisfies VehiclesControllerCreateVariantRequest;

  try {
    const data = await api.vehiclesControllerCreateVariant(body);
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
| **createVariantDto** | [CreateVariantDto](CreateVariantDto.md) |  | |

### Return type

[**VehicleVariantResponseDto**](VehicleVariantResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |
| **400** | Model does not exist |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **409** | Variant already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerSearchMakes

> PaginatedMakesResponseDto vehiclesControllerSearchMakes(page, limit, search)

Search vehicle makes

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerSearchMakesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string (optional)
    search: search_example,
  } satisfies VehiclesControllerSearchMakesRequest;

  try {
    const data = await api.vehiclesControllerSearchMakes(body);
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
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PaginatedMakesResponseDto**](PaginatedMakesResponseDto.md)

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


## vehiclesControllerSearchModels

> PaginatedModelsResponseDto vehiclesControllerSearchModels(makeId, page, limit, search)

Search vehicle models by make

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerSearchModelsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // string
    makeId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // number (optional)
    page: 56,
    // number (optional)
    limit: 56,
    // string (optional)
    search: search_example,
  } satisfies VehiclesControllerSearchModelsRequest;

  try {
    const data = await api.vehiclesControllerSearchModels(body);
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
| **makeId** | `string` |  | [Defaults to `undefined`] |
| **page** | `number` |  | [Optional] [Defaults to `1`] |
| **limit** | `number` |  | [Optional] [Defaults to `20`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PaginatedModelsResponseDto**](PaginatedModelsResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Make does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerSearchVariants

> Array&lt;VehicleVariantResponseDto&gt; vehiclesControllerSearchVariants(modelId, year)

Search vehicle variants by model and optional year

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerSearchVariantsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // string
    modelId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // number (optional)
    year: 56,
  } satisfies VehiclesControllerSearchVariantsRequest;

  try {
    const data = await api.vehiclesControllerSearchVariants(body);
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
| **modelId** | `string` |  | [Defaults to `undefined`] |
| **year** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;VehicleVariantResponseDto&gt;**](VehicleVariantResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **400** | Model does not exist |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerUpdateMake

> VehicleMakeResponseDto vehiclesControllerUpdateMake(id, updateMakeDto)

Update a vehicle make (admin only)

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerUpdateMakeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // string
    id: id_example,
    // UpdateMakeDto
    updateMakeDto: ...,
  } satisfies VehiclesControllerUpdateMakeRequest;

  try {
    const data = await api.vehiclesControllerUpdateMake(body);
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
| **updateMakeDto** | [UpdateMakeDto](UpdateMakeDto.md) |  | |

### Return type

[**VehicleMakeResponseDto**](VehicleMakeResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Make not found |  -  |
| **409** | Make name already exists |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerUpdateModel

> VehicleModelResponseDto vehiclesControllerUpdateModel(id, updateModelDto)

Update a vehicle model (admin only)

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerUpdateModelRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // string
    id: id_example,
    // UpdateModelDto
    updateModelDto: ...,
  } satisfies VehiclesControllerUpdateModelRequest;

  try {
    const data = await api.vehiclesControllerUpdateModel(body);
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
| **updateModelDto** | [UpdateModelDto](UpdateModelDto.md) |  | |

### Return type

[**VehicleModelResponseDto**](VehicleModelResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Model not found |  -  |
| **409** | Model name already exists for this make |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## vehiclesControllerUpdateVariant

> VehicleVariantResponseDto vehiclesControllerUpdateVariant(id, updateVariantDto)

Update a vehicle variant (admin only)

### Example

```ts
import {
  Configuration,
  VehiclesApi,
} from '';
import type { VehiclesControllerUpdateVariantRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new VehiclesApi();

  const body = {
    // string
    id: id_example,
    // UpdateVariantDto
    updateVariantDto: ...,
  } satisfies VehiclesControllerUpdateVariantRequest;

  try {
    const data = await api.vehiclesControllerUpdateVariant(body);
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
| **updateVariantDto** | [UpdateVariantDto](UpdateVariantDto.md) |  | |

### Return type

[**VehicleVariantResponseDto**](VehicleVariantResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Variant not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

