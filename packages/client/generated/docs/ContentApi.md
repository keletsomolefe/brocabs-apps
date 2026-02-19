# ContentApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**contentControllerCreateContent**](ContentApi.md#contentcontrollercreatecontent) | **POST** /content/admin | Create new content (admin) |
| [**contentControllerDeleteContent**](ContentApi.md#contentcontrollerdeletecontent) | **DELETE** /content/admin/{id} | Delete content (admin) |
| [**contentControllerGetContactSupport**](ContentApi.md#contentcontrollergetcontactsupport) | **GET** /content/contact-support | Get Contact Support |
| [**contentControllerGetContentById**](ContentApi.md#contentcontrollergetcontentbyid) | **GET** /content/admin/{id} | Get content by ID (admin) |
| [**contentControllerGetFaqs**](ContentApi.md#contentcontrollergetfaqs) | **GET** /content/faqs | Get all FAQs |
| [**contentControllerGetPrivacyPolicy**](ContentApi.md#contentcontrollergetprivacypolicy) | **GET** /content/privacy-policy | Get Privacy Policy |
| [**contentControllerGetTermsAndConditions**](ContentApi.md#contentcontrollergettermsandconditions) | **GET** /content/terms-and-conditions | Get Terms and Conditions |
| [**contentControllerListContent**](ContentApi.md#contentcontrollerlistcontent) | **GET** /content/admin | List all content (admin) |
| [**contentControllerUpdateContent**](ContentApi.md#contentcontrollerupdatecontent) | **PATCH** /content/admin/{id} | Update content (admin) |



## contentControllerCreateContent

> ContentResponseDto contentControllerCreateContent(createContentDto)

Create new content (admin)

Creates a new content item.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerCreateContentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // CreateContentDto
    createContentDto: ...,
  } satisfies ContentControllerCreateContentRequest;

  try {
    const data = await api.contentControllerCreateContent(body);
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
| **createContentDto** | [CreateContentDto](CreateContentDto.md) |  | |

### Return type

[**ContentResponseDto**](ContentResponseDto.md)

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


## contentControllerDeleteContent

> contentControllerDeleteContent(id)

Delete content (admin)

Deletes a content item.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerDeleteContentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // string | Content ID
    id: id_example,
  } satisfies ContentControllerDeleteContentRequest;

  try {
    const data = await api.contentControllerDeleteContent(body);
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
| **id** | `string` | Content ID | [Defaults to `undefined`] |

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
| **204** | Content deleted |  -  |
| **404** | Content not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## contentControllerGetContactSupport

> ContentListResponseDto contentControllerGetContactSupport(target)

Get Contact Support

Returns all active contact support content items. Filter by target (driver/rider) to get specific support info.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerGetContactSupportRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // 'driver' | 'rider' | 'all' | Filter by target audience (driver, rider, or all) (optional)
    target: target_example,
  } satisfies ContentControllerGetContactSupportRequest;

  try {
    const data = await api.contentControllerGetContactSupport(body);
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
| **target** | `driver`, `rider`, `all` | Filter by target audience (driver, rider, or all) | [Optional] [Defaults to `undefined`] [Enum: driver, rider, all] |

### Return type

[**ContentListResponseDto**](ContentListResponseDto.md)

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


## contentControllerGetContentById

> ContentResponseDto contentControllerGetContentById(id)

Get content by ID (admin)

Returns a single content item by ID.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerGetContentByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // string | Content ID
    id: id_example,
  } satisfies ContentControllerGetContentByIdRequest;

  try {
    const data = await api.contentControllerGetContentById(body);
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
| **id** | `string` | Content ID | [Defaults to `undefined`] |

### Return type

[**ContentResponseDto**](ContentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | Content not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## contentControllerGetFaqs

> ContentListResponseDto contentControllerGetFaqs(target)

Get all FAQs

Returns all active FAQ content items. Filter by target (driver/rider) to get specific FAQs.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerGetFaqsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // 'driver' | 'rider' | 'all' | Filter by target audience (driver, rider, or all) (optional)
    target: target_example,
  } satisfies ContentControllerGetFaqsRequest;

  try {
    const data = await api.contentControllerGetFaqs(body);
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
| **target** | `driver`, `rider`, `all` | Filter by target audience (driver, rider, or all) | [Optional] [Defaults to `undefined`] [Enum: driver, rider, all] |

### Return type

[**ContentListResponseDto**](ContentListResponseDto.md)

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


## contentControllerGetPrivacyPolicy

> ContentListResponseDto contentControllerGetPrivacyPolicy(target)

Get Privacy Policy

Returns all active privacy policy content items. Filter by target (driver/rider) to get specific policies.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerGetPrivacyPolicyRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // 'driver' | 'rider' | 'all' | Filter by target audience (driver, rider, or all) (optional)
    target: target_example,
  } satisfies ContentControllerGetPrivacyPolicyRequest;

  try {
    const data = await api.contentControllerGetPrivacyPolicy(body);
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
| **target** | `driver`, `rider`, `all` | Filter by target audience (driver, rider, or all) | [Optional] [Defaults to `undefined`] [Enum: driver, rider, all] |

### Return type

[**ContentListResponseDto**](ContentListResponseDto.md)

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


## contentControllerGetTermsAndConditions

> ContentListResponseDto contentControllerGetTermsAndConditions(target)

Get Terms and Conditions

Returns all active terms and conditions content items. Filter by target (driver/rider) to get specific terms.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerGetTermsAndConditionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // 'driver' | 'rider' | 'all' | Filter by target audience (driver, rider, or all) (optional)
    target: target_example,
  } satisfies ContentControllerGetTermsAndConditionsRequest;

  try {
    const data = await api.contentControllerGetTermsAndConditions(body);
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
| **target** | `driver`, `rider`, `all` | Filter by target audience (driver, rider, or all) | [Optional] [Defaults to `undefined`] [Enum: driver, rider, all] |

### Return type

[**ContentListResponseDto**](ContentListResponseDto.md)

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


## contentControllerListContent

> ContentListResponseDto contentControllerListContent(type, target)

List all content (admin)

Returns all content items, optionally filtered by type and/or target.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerListContentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // 'privacy_policy' | 'terms_and_conditions' | 'faq' | 'contact_support' | Filter by content type (optional)
    type: type_example,
    // 'driver' | 'rider' | 'all' | Filter by target audience (driver, rider, or all) (optional)
    target: target_example,
  } satisfies ContentControllerListContentRequest;

  try {
    const data = await api.contentControllerListContent(body);
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
| **type** | `privacy_policy`, `terms_and_conditions`, `faq`, `contact_support` | Filter by content type | [Optional] [Defaults to `undefined`] [Enum: privacy_policy, terms_and_conditions, faq, contact_support] |
| **target** | `driver`, `rider`, `all` | Filter by target audience (driver, rider, or all) | [Optional] [Defaults to `undefined`] [Enum: driver, rider, all] |

### Return type

[**ContentListResponseDto**](ContentListResponseDto.md)

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


## contentControllerUpdateContent

> ContentResponseDto contentControllerUpdateContent(id, updateContentDto)

Update content (admin)

Updates an existing content item.

### Example

```ts
import {
  Configuration,
  ContentApi,
} from '';
import type { ContentControllerUpdateContentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ContentApi();

  const body = {
    // string | Content ID
    id: id_example,
    // UpdateContentDto
    updateContentDto: ...,
  } satisfies ContentControllerUpdateContentRequest;

  try {
    const data = await api.contentControllerUpdateContent(body);
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
| **id** | `string` | Content ID | [Defaults to `undefined`] |
| **updateContentDto** | [UpdateContentDto](UpdateContentDto.md) |  | |

### Return type

[**ContentResponseDto**](ContentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |
| **404** | Content not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

