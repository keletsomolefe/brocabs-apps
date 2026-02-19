# BroScholarApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**broScholarControllerCreateApplication**](BroScholarApi.md#broscholarcontrollercreateapplication) | **POST** /bro-scholar/applications | Create a Bro Scholar application |
| [**broScholarControllerGetApplications**](BroScholarApi.md#broscholarcontrollergetapplications) | **GET** /bro-scholar/applications | [ADMIN] Get all Bro Scholar applications |
| [**broScholarControllerGetLatestApplication**](BroScholarApi.md#broscholarcontrollergetlatestapplication) | **GET** /bro-scholar/applications/latest | Get latest Bro Scholar application for current user |
| [**broScholarControllerReviewApplication**](BroScholarApi.md#broscholarcontrollerreviewapplication) | **POST** /bro-scholar/applications/{id}/review | [ADMIN] Review (approve/reject) a Bro Scholar application |



## broScholarControllerCreateApplication

> broScholarControllerCreateApplication(createBroScholarApplicationDto)

Create a Bro Scholar application

### Example

```ts
import {
  Configuration,
  BroScholarApi,
} from '';
import type { BroScholarControllerCreateApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BroScholarApi();

  const body = {
    // CreateBroScholarApplicationDto
    createBroScholarApplicationDto: ...,
  } satisfies BroScholarControllerCreateApplicationRequest;

  try {
    const data = await api.broScholarControllerCreateApplication(body);
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
| **createBroScholarApplicationDto** | [CreateBroScholarApplicationDto](CreateBroScholarApplicationDto.md) |  | |

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
| **201** | Application created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## broScholarControllerGetApplications

> Array&lt;BroScholarApplicationResponseDto&gt; broScholarControllerGetApplications(status)

[ADMIN] Get all Bro Scholar applications

### Example

```ts
import {
  Configuration,
  BroScholarApi,
} from '';
import type { BroScholarControllerGetApplicationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BroScholarApi();

  const body = {
    // 'PENDING' | 'APPROVED' | 'REJECTED' (optional)
    status: status_example,
  } satisfies BroScholarControllerGetApplicationsRequest;

  try {
    const data = await api.broScholarControllerGetApplications(body);
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
| **status** | `PENDING`, `APPROVED`, `REJECTED` |  | [Optional] [Defaults to `undefined`] [Enum: PENDING, APPROVED, REJECTED] |

### Return type

[**Array&lt;BroScholarApplicationResponseDto&gt;**](BroScholarApplicationResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of applications |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## broScholarControllerGetLatestApplication

> BroScholarApplicationResponseDto broScholarControllerGetLatestApplication()

Get latest Bro Scholar application for current user

### Example

```ts
import {
  Configuration,
  BroScholarApi,
} from '';
import type { BroScholarControllerGetLatestApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BroScholarApi();

  try {
    const data = await api.broScholarControllerGetLatestApplication();
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

[**BroScholarApplicationResponseDto**](BroScholarApplicationResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Latest application with signed URLs for files |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## broScholarControllerReviewApplication

> BroScholarApplication broScholarControllerReviewApplication(id, reviewBroScholarApplicationDto)

[ADMIN] Review (approve/reject) a Bro Scholar application

### Example

```ts
import {
  Configuration,
  BroScholarApi,
} from '';
import type { BroScholarControllerReviewApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new BroScholarApi();

  const body = {
    // string
    id: id_example,
    // ReviewBroScholarApplicationDto
    reviewBroScholarApplicationDto: ...,
  } satisfies BroScholarControllerReviewApplicationRequest;

  try {
    const data = await api.broScholarControllerReviewApplication(body);
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
| **reviewBroScholarApplicationDto** | [ReviewBroScholarApplicationDto](ReviewBroScholarApplicationDto.md) |  | |

### Return type

[**BroScholarApplication**](BroScholarApplication.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Application reviewed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

