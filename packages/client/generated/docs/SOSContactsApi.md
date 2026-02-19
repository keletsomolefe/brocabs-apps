# SOSContactsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**sosContactsControllerCreate**](SOSContactsApi.md#soscontactscontrollercreate) | **POST** /sos-contacts | Add a new SOS contact |
| [**sosContactsControllerFindAll**](SOSContactsApi.md#soscontactscontrollerfindall) | **GET** /sos-contacts | List profile\&#39;s SOS contacts |
| [**sosContactsControllerRemove**](SOSContactsApi.md#soscontactscontrollerremove) | **DELETE** /sos-contacts/{id} | Remove an SOS contact |



## sosContactsControllerCreate

> SosContactResponseDto sosContactsControllerCreate(createSosContactDto)

Add a new SOS contact

### Example

```ts
import {
  Configuration,
  SOSContactsApi,
} from '';
import type { SosContactsControllerCreateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SOSContactsApi();

  const body = {
    // CreateSosContactDto
    createSosContactDto: ...,
  } satisfies SosContactsControllerCreateRequest;

  try {
    const data = await api.sosContactsControllerCreate(body);
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
| **createSosContactDto** | [CreateSosContactDto](CreateSosContactDto.md) |  | |

### Return type

[**SosContactResponseDto**](SosContactResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | The SOS contact has been successfully created. |  -  |
| **400** | Limit of 5 SOS contacts reached. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sosContactsControllerFindAll

> Array&lt;SosContactResponseDto&gt; sosContactsControllerFindAll()

List profile\&#39;s SOS contacts

### Example

```ts
import {
  Configuration,
  SOSContactsApi,
} from '';
import type { SosContactsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SOSContactsApi();

  try {
    const data = await api.sosContactsControllerFindAll();
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

[**Array&lt;SosContactResponseDto&gt;**](SosContactResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of SOS contacts. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## sosContactsControllerRemove

> sosContactsControllerRemove(id)

Remove an SOS contact

### Example

```ts
import {
  Configuration,
  SOSContactsApi,
} from '';
import type { SosContactsControllerRemoveRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SOSContactsApi();

  const body = {
    // string
    id: id_example,
  } satisfies SosContactsControllerRemoveRequest;

  try {
    const data = await api.sosContactsControllerRemove(body);
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
| **204** | The SOS contact has been successfully removed. |  -  |
| **404** | SOS contact not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

