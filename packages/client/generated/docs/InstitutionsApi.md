# InstitutionsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**institutionsControllerFindAll**](InstitutionsApi.md#institutionscontrollerfindall) | **GET** /institutions | Get all institutions (optional type filter) |
| [**institutionsControllerFindOne**](InstitutionsApi.md#institutionscontrollerfindone) | **GET** /institutions/{id} | Get institution by ID |
| [**institutionsControllerSearch**](InstitutionsApi.md#institutionscontrollersearch) | **GET** /institutions/search | Search institutions |



## institutionsControllerFindAll

> Array&lt;Institution&gt; institutionsControllerFindAll(q, limit, type)

Get all institutions (optional type filter)

### Example

```ts
import {
  Configuration,
  InstitutionsApi,
} from '';
import type { InstitutionsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InstitutionsApi();

  const body = {
    // string (optional)
    q: q_example,
    // number (optional)
    limit: 8.14,
    // 'traditional' | 'technology' | 'tvet' | 'private' | 'other' (optional)
    type: type_example,
  } satisfies InstitutionsControllerFindAllRequest;

  try {
    const data = await api.institutionsControllerFindAll(body);
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
| **q** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `10`] |
| **type** | `traditional`, `technology`, `tvet`, `private`, `other` |  | [Optional] [Defaults to `undefined`] [Enum: traditional, technology, tvet, private, other] |

### Return type

[**Array&lt;Institution&gt;**](Institution.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## institutionsControllerFindOne

> Institution institutionsControllerFindOne(id)

Get institution by ID

### Example

```ts
import {
  Configuration,
  InstitutionsApi,
} from '';
import type { InstitutionsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InstitutionsApi();

  const body = {
    // string
    id: id_example,
  } satisfies InstitutionsControllerFindOneRequest;

  try {
    const data = await api.institutionsControllerFindOne(body);
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

[**Institution**](Institution.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## institutionsControllerSearch

> Array&lt;Institution&gt; institutionsControllerSearch(q, limit, type)

Search institutions

### Example

```ts
import {
  Configuration,
  InstitutionsApi,
} from '';
import type { InstitutionsControllerSearchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new InstitutionsApi();

  const body = {
    // string (optional)
    q: q_example,
    // number (optional)
    limit: 8.14,
    // 'traditional' | 'technology' | 'tvet' | 'private' | 'other' (optional)
    type: type_example,
  } satisfies InstitutionsControllerSearchRequest;

  try {
    const data = await api.institutionsControllerSearch(body);
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
| **q** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `10`] |
| **type** | `traditional`, `technology`, `tvet`, `private`, `other` |  | [Optional] [Defaults to `undefined`] [Enum: traditional, technology, tvet, private, other] |

### Return type

[**Array&lt;Institution&gt;**](Institution.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

