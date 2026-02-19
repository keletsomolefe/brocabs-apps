# RegisterApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**registerControllerRegisterDriver**](RegisterApi.md#registercontrollerregisterdriver) | **POST** /auth/register/driver |  |
| [**registerControllerRegisterRider**](RegisterApi.md#registercontrollerregisterrider) | **POST** /auth/register/rider |  |



## registerControllerRegisterDriver

> RegisterDriverResponseDto registerControllerRegisterDriver(registerDriverDto)



### Example

```ts
import {
  Configuration,
  RegisterApi,
} from '';
import type { RegisterControllerRegisterDriverRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RegisterApi();

  const body = {
    // RegisterDriverDto
    registerDriverDto: ...,
  } satisfies RegisterControllerRegisterDriverRequest;

  try {
    const data = await api.registerControllerRegisterDriver(body);
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
| **registerDriverDto** | [RegisterDriverDto](RegisterDriverDto.md) |  | |

### Return type

[**RegisterDriverResponseDto**](RegisterDriverResponseDto.md)

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


## registerControllerRegisterRider

> RegisterRiderResponseDto registerControllerRegisterRider(registerRiderDto)



### Example

```ts
import {
  Configuration,
  RegisterApi,
} from '';
import type { RegisterControllerRegisterRiderRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new RegisterApi();

  const body = {
    // RegisterRiderDto
    registerRiderDto: ...,
  } satisfies RegisterControllerRegisterRiderRequest;

  try {
    const data = await api.registerControllerRegisterRider(body);
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
| **registerRiderDto** | [RegisterRiderDto](RegisterRiderDto.md) |  | |

### Return type

[**RegisterRiderResponseDto**](RegisterRiderResponseDto.md)

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

