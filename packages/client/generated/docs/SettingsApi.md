# SettingsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**settingsControllerFindAll**](SettingsApi.md#settingscontrollerfindall) | **GET** /settings |  |
| [**settingsControllerFindOne**](SettingsApi.md#settingscontrollerfindone) | **GET** /settings/{key} |  |
| [**settingsControllerGetBankingConfig**](SettingsApi.md#settingscontrollergetbankingconfig) | **GET** /settings/banking-config | Get banking configuration options |
| [**settingsControllerGetVehicleConfig**](SettingsApi.md#settingscontrollergetvehicleconfig) | **GET** /settings/vehicle-config | Get vehicle configuration options |
| [**settingsControllerUpdate**](SettingsApi.md#settingscontrollerupdate) | **PATCH** /settings/{key} |  |



## settingsControllerFindAll

> Array&lt;Setting&gt; settingsControllerFindAll()



### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { SettingsControllerFindAllRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  try {
    const data = await api.settingsControllerFindAll();
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

[**Array&lt;Setting&gt;**](Setting.md)

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


## settingsControllerFindOne

> Setting settingsControllerFindOne(key)



### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { SettingsControllerFindOneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  const body = {
    // string
    key: key_example,
  } satisfies SettingsControllerFindOneRequest;

  try {
    const data = await api.settingsControllerFindOne(body);
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
| **key** | `string` |  | [Defaults to `undefined`] |

### Return type

[**Setting**](Setting.md)

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


## settingsControllerGetBankingConfig

> BankingConfigResponseDto settingsControllerGetBankingConfig()

Get banking configuration options

Returns available account types and bank names for driver onboarding

### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { SettingsControllerGetBankingConfigRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  try {
    const data = await api.settingsControllerGetBankingConfig();
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

[**BankingConfigResponseDto**](BankingConfigResponseDto.md)

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


## settingsControllerGetVehicleConfig

> VehicleConfigResponseDto settingsControllerGetVehicleConfig()

Get vehicle configuration options

Returns available vehicle makes, models, and colors for driver onboarding

### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { SettingsControllerGetVehicleConfigRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  try {
    const data = await api.settingsControllerGetVehicleConfig();
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

[**VehicleConfigResponseDto**](VehicleConfigResponseDto.md)

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


## settingsControllerUpdate

> Setting settingsControllerUpdate(key, updateSettingDto)



### Example

```ts
import {
  Configuration,
  SettingsApi,
} from '';
import type { SettingsControllerUpdateRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SettingsApi();

  const body = {
    // string
    key: key_example,
    // UpdateSettingDto
    updateSettingDto: ...,
  } satisfies SettingsControllerUpdateRequest;

  try {
    const data = await api.settingsControllerUpdate(body);
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
| **key** | `string` |  | [Defaults to `undefined`] |
| **updateSettingDto** | [UpdateSettingDto](UpdateSettingDto.md) |  | |

### Return type

[**Setting**](Setting.md)

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

