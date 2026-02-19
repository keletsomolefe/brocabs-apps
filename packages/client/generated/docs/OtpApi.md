# OtpApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**otpControllerStartOtp**](OtpApi.md#otpcontrollerstartotp) | **POST** /auth/otp/start |  |
| [**otpControllerVerifyOtp**](OtpApi.md#otpcontrollerverifyotp) | **POST** /auth/otp/verify |  |



## otpControllerStartOtp

> StartOtpResponseDto otpControllerStartOtp(startOtpDto)



### Example

```ts
import {
  Configuration,
  OtpApi,
} from '';
import type { OtpControllerStartOtpRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtpApi();

  const body = {
    // StartOtpDto
    startOtpDto: ...,
  } satisfies OtpControllerStartOtpRequest;

  try {
    const data = await api.otpControllerStartOtp(body);
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
| **startOtpDto** | [StartOtpDto](StartOtpDto.md) |  | |

### Return type

[**StartOtpResponseDto**](StartOtpResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **202** |  |  -  |
| **400** | Validation error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## otpControllerVerifyOtp

> VerifyOtpResponseDto otpControllerVerifyOtp(verifyOtpDto)



### Example

```ts
import {
  Configuration,
  OtpApi,
} from '';
import type { OtpControllerVerifyOtpRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new OtpApi();

  const body = {
    // VerifyOtpDto
    verifyOtpDto: ...,
  } satisfies OtpControllerVerifyOtpRequest;

  try {
    const data = await api.otpControllerVerifyOtp(body);
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
| **verifyOtpDto** | [VerifyOtpDto](VerifyOtpDto.md) |  | |

### Return type

[**VerifyOtpResponseDto**](VerifyOtpResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

