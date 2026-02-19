# DevicesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**devicesControllerPing**](DevicesApi.md#devicescontrollerping) | **POST** /devices/ping | Update device lastSeenAt |
| [**devicesControllerRefreshToken**](DevicesApi.md#devicescontrollerrefreshtoken) | **POST** /devices/refresh-token | Update push token for a device |
| [**devicesControllerRegisterDevice**](DevicesApi.md#devicescontrollerregisterdevice) | **POST** /devices/register | Upsert a device and update lastSeenAt |



## devicesControllerPing

> DeviceResponseDto devicesControllerPing(pingDeviceDto)

Update device lastSeenAt

### Example

```ts
import {
  Configuration,
  DevicesApi,
} from '';
import type { DevicesControllerPingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DevicesApi();

  const body = {
    // PingDeviceDto
    pingDeviceDto: ...,
  } satisfies DevicesControllerPingRequest;

  try {
    const data = await api.devicesControllerPing(body);
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
| **pingDeviceDto** | [PingDeviceDto](PingDeviceDto.md) |  | |

### Return type

[**DeviceResponseDto**](DeviceResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Device lastSeenAt updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## devicesControllerRefreshToken

> DeviceResponseDto devicesControllerRefreshToken(refreshDeviceTokenDto)

Update push token for a device

### Example

```ts
import {
  Configuration,
  DevicesApi,
} from '';
import type { DevicesControllerRefreshTokenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DevicesApi();

  const body = {
    // RefreshDeviceTokenDto
    refreshDeviceTokenDto: ...,
  } satisfies DevicesControllerRefreshTokenRequest;

  try {
    const data = await api.devicesControllerRefreshToken(body);
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
| **refreshDeviceTokenDto** | [RefreshDeviceTokenDto](RefreshDeviceTokenDto.md) |  | |

### Return type

[**DeviceResponseDto**](DeviceResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Device push token refreshed successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## devicesControllerRegisterDevice

> DeviceResponseDto devicesControllerRegisterDevice(registerDeviceDto)

Upsert a device and update lastSeenAt

### Example

```ts
import {
  Configuration,
  DevicesApi,
} from '';
import type { DevicesControllerRegisterDeviceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new DevicesApi();

  const body = {
    // RegisterDeviceDto
    registerDeviceDto: ...,
  } satisfies DevicesControllerRegisterDeviceRequest;

  try {
    const data = await api.devicesControllerRegisterDevice(body);
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
| **registerDeviceDto** | [RegisterDeviceDto](RegisterDeviceDto.md) |  | |

### Return type

[**DeviceResponseDto**](DeviceResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Device registered successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

