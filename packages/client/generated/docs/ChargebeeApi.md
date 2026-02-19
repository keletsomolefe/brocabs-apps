# ChargebeeApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**chargebeeControllerCreateCheckout**](ChargebeeApi.md#chargebeecontrollercreatecheckout) | **POST** /chargebee/checkout |  |
| [**chargebeeControllerHandleWebhooks**](ChargebeeApi.md#chargebeecontrollerhandlewebhooks) | **POST** /chargebee/webhooks |  |



## chargebeeControllerCreateCheckout

> ChargebeeCheckoutResponseDto chargebeeControllerCreateCheckout(createCheckoutDto)



### Example

```ts
import {
  Configuration,
  ChargebeeApi,
} from '';
import type { ChargebeeControllerCreateCheckoutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ChargebeeApi();

  const body = {
    // CreateCheckoutDto
    createCheckoutDto: ...,
  } satisfies ChargebeeControllerCreateCheckoutRequest;

  try {
    const data = await api.chargebeeControllerCreateCheckout(body);
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
| **createCheckoutDto** | [CreateCheckoutDto](CreateCheckoutDto.md) |  | |

### Return type

[**ChargebeeCheckoutResponseDto**](ChargebeeCheckoutResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **0** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## chargebeeControllerHandleWebhooks

> chargebeeControllerHandleWebhooks()



### Example

```ts
import {
  Configuration,
  ChargebeeApi,
} from '';
import type { ChargebeeControllerHandleWebhooksRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ChargebeeApi();

  try {
    const data = await api.chargebeeControllerHandleWebhooks();
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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

