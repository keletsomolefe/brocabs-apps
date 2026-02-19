# ProfilesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**driverProfileControllerGetDriverProfile**](ProfilesApi.md#driverprofilecontrollergetdriverprofile) | **GET** /driver/profile | Get driver profile |
| [**driverProfileControllerUpdateAdminFeeAction**](ProfilesApi.md#driverprofilecontrollerupdateadminfeeaction) | **POST** /driver/admin-fee | Pay or skip admin fee |
| [**driverProfileControllerUpdateBankDetails**](ProfilesApi.md#driverprofilecontrollerupdatebankdetails) | **POST** /driver/bank-details | Update bank details |
| [**driverProfileControllerUpdateServiceAreas**](ProfilesApi.md#driverprofilecontrollerupdateserviceareas) | **POST** /driver/service-areas | Update service areas |
| [**driverProfileControllerUpdateVehicle**](ProfilesApi.md#driverprofilecontrollerupdatevehicle) | **PUT** /driver/vehicle | Update driver vehicle |
| [**driverProfileControllerUploadDocument**](ProfilesApi.md#driverprofilecontrolleruploaddocument) | **POST** /driver/documents | Upload driver document |
| [**riderProfileControllerGetRiderProfile**](ProfilesApi.md#riderprofilecontrollergetriderprofile) | **GET** /rider/profile | Get rider profile |



## driverProfileControllerGetDriverProfile

> DriverProfileResponseDto driverProfileControllerGetDriverProfile()

Get driver profile

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { DriverProfileControllerGetDriverProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  try {
    const data = await api.driverProfileControllerGetDriverProfile();
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

[**DriverProfileResponseDto**](DriverProfileResponseDto.md)

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


## driverProfileControllerUpdateAdminFeeAction

> driverProfileControllerUpdateAdminFeeAction(adminFeeActionDto)

Pay or skip admin fee

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { DriverProfileControllerUpdateAdminFeeActionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  const body = {
    // AdminFeeActionDto
    adminFeeActionDto: ...,
  } satisfies DriverProfileControllerUpdateAdminFeeActionRequest;

  try {
    const data = await api.driverProfileControllerUpdateAdminFeeAction(body);
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
| **adminFeeActionDto** | [AdminFeeActionDto](AdminFeeActionDto.md) |  | |

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
| **200** | Admin fee action recorded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## driverProfileControllerUpdateBankDetails

> driverProfileControllerUpdateBankDetails(updateBankDetailsDto)

Update bank details

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { DriverProfileControllerUpdateBankDetailsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  const body = {
    // UpdateBankDetailsDto
    updateBankDetailsDto: ...,
  } satisfies DriverProfileControllerUpdateBankDetailsRequest;

  try {
    const data = await api.driverProfileControllerUpdateBankDetails(body);
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
| **updateBankDetailsDto** | [UpdateBankDetailsDto](UpdateBankDetailsDto.md) |  | |

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
| **200** | Bank details updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## driverProfileControllerUpdateServiceAreas

> driverProfileControllerUpdateServiceAreas(updateServiceAreasDto)

Update service areas

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { DriverProfileControllerUpdateServiceAreasRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  const body = {
    // UpdateServiceAreasDto
    updateServiceAreasDto: ...,
  } satisfies DriverProfileControllerUpdateServiceAreasRequest;

  try {
    const data = await api.driverProfileControllerUpdateServiceAreas(body);
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
| **updateServiceAreasDto** | [UpdateServiceAreasDto](UpdateServiceAreasDto.md) |  | |

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
| **200** | Service areas updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## driverProfileControllerUpdateVehicle

> driverProfileControllerUpdateVehicle(updateVehicleDto)

Update driver vehicle

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { DriverProfileControllerUpdateVehicleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  const body = {
    // UpdateVehicleDto
    updateVehicleDto: ...,
  } satisfies DriverProfileControllerUpdateVehicleRequest;

  try {
    const data = await api.driverProfileControllerUpdateVehicle(body);
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
| **updateVehicleDto** | [UpdateVehicleDto](UpdateVehicleDto.md) |  | |

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
| **200** | Vehicle updated |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## driverProfileControllerUploadDocument

> driverProfileControllerUploadDocument(uploadDocumentDto)

Upload driver document

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { DriverProfileControllerUploadDocumentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  const body = {
    // UploadDocumentDto
    uploadDocumentDto: ...,
  } satisfies DriverProfileControllerUploadDocumentRequest;

  try {
    const data = await api.driverProfileControllerUploadDocument(body);
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
| **uploadDocumentDto** | [UploadDocumentDto](UploadDocumentDto.md) |  | |

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
| **201** | Document uploaded |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## riderProfileControllerGetRiderProfile

> RiderProfileResponseDto riderProfileControllerGetRiderProfile()

Get rider profile

### Example

```ts
import {
  Configuration,
  ProfilesApi,
} from '';
import type { RiderProfileControllerGetRiderProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfilesApi();

  try {
    const data = await api.riderProfileControllerGetRiderProfile();
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

[**RiderProfileResponseDto**](RiderProfileResponseDto.md)

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

