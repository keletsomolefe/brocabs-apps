# AdminApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminControllerApproveDriverApplication**](AdminApi.md#admincontrollerapprovedriverapplication) | **POST** /admin/driver-applications/{id}/approve | Approve driver application |
| [**adminControllerGetDriverApplication**](AdminApi.md#admincontrollergetdriverapplication) | **GET** /admin/driver-applications/{id} | Get driver application by ID |
| [**adminControllerGetDriverById**](AdminApi.md#admincontrollergetdriverbyid) | **GET** /admin/drivers/{id} | Get driver by ID |
| [**adminControllerGetPaymentById**](AdminApi.md#admincontrollergetpaymentbyid) | **GET** /admin/payments/{id} | Get payment by ID |
| [**adminControllerGetRideById**](AdminApi.md#admincontrollergetridebyid) | **GET** /admin/rides/{id} | Get ride by ID |
| [**adminControllerGetStats**](AdminApi.md#admincontrollergetstats) | **GET** /admin/stats | Get dashboard statistics |
| [**adminControllerGetUserById**](AdminApi.md#admincontrollergetuserbyid) | **GET** /admin/users/{id} | Get user by ID |
| [**adminControllerListDriverApplications**](AdminApi.md#admincontrollerlistdriverapplications) | **GET** /admin/driver-applications | List driver applications |
| [**adminControllerListDrivers**](AdminApi.md#admincontrollerlistdrivers) | **GET** /admin/drivers | List all drivers |
| [**adminControllerListPayments**](AdminApi.md#admincontrollerlistpayments) | **GET** /admin/payments | List all payments |
| [**adminControllerListRides**](AdminApi.md#admincontrollerlistrides) | **GET** /admin/rides | List all rides |
| [**adminControllerListUsers**](AdminApi.md#admincontrollerlistusers) | **GET** /admin/users | List all users |
| [**adminControllerRejectDriverApplication**](AdminApi.md#admincontrollerrejectdriverapplication) | **POST** /admin/driver-applications/{id}/reject | Reject driver application |
| [**adminControllerUpdateUserStatus**](AdminApi.md#admincontrollerupdateuserstatus) | **PATCH** /admin/users/{id}/status | Update user status |



## adminControllerApproveDriverApplication

> AdminControllerApproveDriverApplication200Response adminControllerApproveDriverApplication(id, approveDriverApplicationDto)

Approve driver application

Approves a pending driver application, setting the driver status to ACTIVE and allowing them to start accepting rides.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerApproveDriverApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | Driver profile ID or user ID (UUID)
    id: id_example,
    // ApproveDriverApplicationDto
    approveDriverApplicationDto: ...,
  } satisfies AdminControllerApproveDriverApplicationRequest;

  try {
    const data = await api.adminControllerApproveDriverApplication(body);
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
| **id** | `string` | Driver profile ID or user ID (UUID) | [Defaults to `undefined`] |
| **approveDriverApplicationDto** | [ApproveDriverApplicationDto](ApproveDriverApplicationDto.md) |  | |

### Return type

[**AdminControllerApproveDriverApplication200Response**](AdminControllerApproveDriverApplication200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Application approved successfully |  -  |
| **400** | Bad Request - Application already approved or missing required data |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Application not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetDriverApplication

> DriverApplicationDto adminControllerGetDriverApplication(id)

Get driver application by ID

Returns detailed information about a specific driver application including all documents, vehicle details, and bank information.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetDriverApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | Driver profile ID or user ID (UUID)
    id: id_example,
  } satisfies AdminControllerGetDriverApplicationRequest;

  try {
    const data = await api.adminControllerGetDriverApplication(body);
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
| **id** | `string` | Driver profile ID or user ID (UUID) | [Defaults to `undefined`] |

### Return type

[**DriverApplicationDto**](DriverApplicationDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Application retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Application not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetDriverById

> AdminDriverResponseDto adminControllerGetDriverById(id)

Get driver by ID

Returns detailed information about a specific driver.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetDriverByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | Driver user ID (UUID)
    id: id_example,
  } satisfies AdminControllerGetDriverByIdRequest;

  try {
    const data = await api.adminControllerGetDriverById(body);
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
| **id** | `string` | Driver user ID (UUID) | [Defaults to `undefined`] |

### Return type

[**AdminDriverResponseDto**](AdminDriverResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Driver retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Driver not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetPaymentById

> AdminPaymentResponseDto adminControllerGetPaymentById(id)

Get payment by ID

Returns detailed information about a specific payment transaction.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetPaymentByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | Payment/Transaction ID (UUID)
    id: id_example,
  } satisfies AdminControllerGetPaymentByIdRequest;

  try {
    const data = await api.adminControllerGetPaymentById(body);
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
| **id** | `string` | Payment/Transaction ID (UUID) | [Defaults to `undefined`] |

### Return type

[**AdminPaymentResponseDto**](AdminPaymentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Payment retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Payment not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetRideById

> AdminRideResponseDto adminControllerGetRideById(id)

Get ride by ID

Returns detailed information about a specific ride.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetRideByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | Ride ID (UUID)
    id: id_example,
  } satisfies AdminControllerGetRideByIdRequest;

  try {
    const data = await api.adminControllerGetRideById(body);
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
| **id** | `string` | Ride ID (UUID) | [Defaults to `undefined`] |

### Return type

[**AdminRideResponseDto**](AdminRideResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Ride retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Ride not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetStats

> AdminStatsResponseDto adminControllerGetStats()

Get dashboard statistics

Returns aggregated statistics for the admin dashboard including user counts, ride statistics, and revenue data.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetStatsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  try {
    const data = await api.adminControllerGetStats();
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

[**AdminStatsResponseDto**](AdminStatsResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Statistics retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerGetUserById

> AdminUserResponseDto adminControllerGetUserById(id)

Get user by ID

Returns detailed information about a specific user.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerGetUserByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | User ID (UUID)
    id: id_example,
  } satisfies AdminControllerGetUserByIdRequest;

  try {
    const data = await api.adminControllerGetUserById(body);
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
| **id** | `string` | User ID (UUID) | [Defaults to `undefined`] |

### Return type

[**AdminUserResponseDto**](AdminUserResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListDriverApplications

> DriverApplicationListResponseDto adminControllerListDriverApplications(page, limit, offset, search, status, sortBy, sortOrder)

List driver applications

Returns a paginated list of driver applications awaiting review with all submitted data including documents, vehicle, and bank details.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListDriverApplicationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    offset: offset_example,
    // string (optional)
    search: search_example,
    // 'PENDING' | 'REVIEW_PENDING' | 'APPROVED' | 'REJECTED' | 'BLOCKED' | 'all' (optional)
    status: status_example,
    // 'submittedAt' | 'fullName' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
  } satisfies AdminControllerListDriverApplicationsRequest;

  try {
    const data = await api.adminControllerListDriverApplications(body);
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
| **page** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `string` |  | [Optional] [Defaults to `undefined`] |
| **offset** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `PENDING`, `REVIEW_PENDING`, `APPROVED`, `REJECTED`, `BLOCKED`, `all` |  | [Optional] [Defaults to `undefined`] [Enum: PENDING, REVIEW_PENDING, APPROVED, REJECTED, BLOCKED, all] |
| **sortBy** | `submittedAt`, `fullName` |  | [Optional] [Defaults to `undefined`] [Enum: submittedAt, fullName] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |

### Return type

[**DriverApplicationListResponseDto**](DriverApplicationListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Applications retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListDrivers

> AdminDriverListResponseDto adminControllerListDrivers(page, limit, offset, search, status, isVerified, isActive, sortBy, sortOrder)

List all drivers

Returns a paginated list of all drivers with optional filtering and sorting.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListDriversRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    offset: offset_example,
    // string (optional)
    search: search_example,
    // 'all' | 'online' | 'offline' | 'busy' (optional)
    status: status_example,
    // string (optional)
    isVerified: isVerified_example,
    // string (optional)
    isActive: isActive_example,
    // 'createdAt' | 'rating' | 'totalRides' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
  } satisfies AdminControllerListDriversRequest;

  try {
    const data = await api.adminControllerListDrivers(body);
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
| **page** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `string` |  | [Optional] [Defaults to `undefined`] |
| **offset** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **status** | `all`, `online`, `offline`, `busy` |  | [Optional] [Defaults to `undefined`] [Enum: all, online, offline, busy] |
| **isVerified** | `string` |  | [Optional] [Defaults to `undefined`] |
| **isActive** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `createdAt`, `rating`, `totalRides` |  | [Optional] [Defaults to `undefined`] [Enum: createdAt, rating, totalRides] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |

### Return type

[**AdminDriverListResponseDto**](AdminDriverListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Drivers retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListPayments

> AdminPaymentListResponseDto adminControllerListPayments(page, limit, offset, search, type, status, sortBy, sortOrder, startDate, endDate)

List all payments

Returns a paginated list of all payment transactions with optional filtering and sorting.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListPaymentsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    offset: offset_example,
    // string (optional)
    search: search_example,
    // 'all' | 'DEPOSIT' | 'PAYMENT' | 'WITHDRAWAL' | 'REFUND' | 'APPLICATION_FEE' (optional)
    type: type_example,
    // 'all' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' (optional)
    status: status_example,
    // 'createdAt' | 'amount' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
    // string (optional)
    startDate: startDate_example,
    // string (optional)
    endDate: endDate_example,
  } satisfies AdminControllerListPaymentsRequest;

  try {
    const data = await api.adminControllerListPayments(body);
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
| **page** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `string` |  | [Optional] [Defaults to `undefined`] |
| **offset** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **type** | `all`, `DEPOSIT`, `PAYMENT`, `WITHDRAWAL`, `REFUND`, `APPLICATION_FEE` |  | [Optional] [Defaults to `undefined`] [Enum: all, DEPOSIT, PAYMENT, WITHDRAWAL, REFUND, APPLICATION_FEE] |
| **status** | `all`, `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` |  | [Optional] [Defaults to `undefined`] [Enum: all, PENDING, COMPLETED, FAILED, REFUNDED] |
| **sortBy** | `createdAt`, `amount` |  | [Optional] [Defaults to `undefined`] [Enum: createdAt, amount] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |
| **startDate** | `string` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminPaymentListResponseDto**](AdminPaymentListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Payments retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListRides

> AdminRideListResponseDto adminControllerListRides(page, limit, offset, search, rideStatus, sortBy, sortOrder, startDate, endDate)

List all rides

Returns a paginated list of all rides with optional filtering and sorting.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListRidesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    offset: offset_example,
    // string (optional)
    search: search_example,
    // 'all' | 'searching' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled' | 'driver_not_found' | 'no_show' (optional)
    rideStatus: rideStatus_example,
    // 'createdAt' | 'estimatedPrice' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
    // string (optional)
    startDate: startDate_example,
    // string (optional)
    endDate: endDate_example,
  } satisfies AdminControllerListRidesRequest;

  try {
    const data = await api.adminControllerListRides(body);
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
| **page** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `string` |  | [Optional] [Defaults to `undefined`] |
| **offset** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **rideStatus** | `all`, `searching`, `accepted`, `arrived`, `in_progress`, `completed`, `cancelled`, `driver_not_found`, `no_show` |  | [Optional] [Defaults to `undefined`] [Enum: all, searching, accepted, arrived, in_progress, completed, cancelled, driver_not_found, no_show] |
| **sortBy** | `createdAt`, `estimatedPrice` |  | [Optional] [Defaults to `undefined`] [Enum: createdAt, estimatedPrice] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |
| **startDate** | `string` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminRideListResponseDto**](AdminRideListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Rides retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerListUsers

> AdminUserListResponseDto adminControllerListUsers(page, limit, offset, search, applicationType, isActive, sortBy, sortOrder, isVerified)

List all users

Returns a paginated list of all users with optional filtering and sorting.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerListUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    offset: offset_example,
    // string (optional)
    search: search_example,
    // 'rider' | 'driver' | 'admin' (optional)
    applicationType: applicationType_example,
    // string (optional)
    isActive: isActive_example,
    // 'createdAt' | 'firstName' | 'lastName' | 'email' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
    // string (optional)
    isVerified: isVerified_example,
  } satisfies AdminControllerListUsersRequest;

  try {
    const data = await api.adminControllerListUsers(body);
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
| **page** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `string` |  | [Optional] [Defaults to `undefined`] |
| **offset** | `string` |  | [Optional] [Defaults to `undefined`] |
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **applicationType** | `rider`, `driver`, `admin` |  | [Optional] [Defaults to `undefined`] [Enum: rider, driver, admin] |
| **isActive** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `createdAt`, `firstName`, `lastName`, `email` |  | [Optional] [Defaults to `undefined`] [Enum: createdAt, firstName, lastName, email] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |
| **isVerified** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminUserListResponseDto**](AdminUserListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Users retrieved successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerRejectDriverApplication

> AdminControllerRejectDriverApplication200Response adminControllerRejectDriverApplication(id, rejectDriverApplicationDto)

Reject driver application

Rejects a pending driver application with a reason. The driver will be notified and may need to resubmit documents or information.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerRejectDriverApplicationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | Driver profile ID or user ID (UUID)
    id: id_example,
    // RejectDriverApplicationDto
    rejectDriverApplicationDto: ...,
  } satisfies AdminControllerRejectDriverApplicationRequest;

  try {
    const data = await api.adminControllerRejectDriverApplication(body);
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
| **id** | `string` | Driver profile ID or user ID (UUID) | [Defaults to `undefined`] |
| **rejectDriverApplicationDto** | [RejectDriverApplicationDto](RejectDriverApplicationDto.md) |  | |

### Return type

[**AdminControllerRejectDriverApplication200Response**](AdminControllerRejectDriverApplication200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Application rejected successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | Application not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminControllerUpdateUserStatus

> AdminUserResponseDto adminControllerUpdateUserStatus(id, updateUserStatusDto)

Update user status

Activate or deactivate a user account.

### Example

```ts
import {
  Configuration,
  AdminApi,
} from '';
import type { AdminControllerUpdateUserStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminApi();

  const body = {
    // string | User ID (UUID)
    id: id_example,
    // UpdateUserStatusDto
    updateUserStatusDto: ...,
  } satisfies AdminControllerUpdateUserStatusRequest;

  try {
    const data = await api.adminControllerUpdateUserStatus(body);
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
| **id** | `string` | User ID (UUID) | [Defaults to `undefined`] |
| **updateUserStatusDto** | [UpdateUserStatusDto](UpdateUserStatusDto.md) |  | |

### Return type

[**AdminUserResponseDto**](AdminUserResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User status updated successfully |  -  |
| **401** | Unauthorized - Authentication required |  -  |
| **403** | Forbidden - Admin access required |  -  |
| **404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

