# AdminSubscriptionsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**adminSubscriptionControllerActivatePlan**](AdminSubscriptionsApi.md#adminsubscriptioncontrolleractivateplan) | **POST** /admin/subscriptions/plans/{id}/activate | Activate subscription plan |
| [**adminSubscriptionControllerBulkApproveSubscriptions**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerbulkapprovesubscriptions) | **POST** /admin/subscriptions/bulk-approve | Bulk approve or reject subscriptions |
| [**adminSubscriptionControllerCreatePlan**](AdminSubscriptionsApi.md#adminsubscriptioncontrollercreateplan) | **POST** /admin/subscriptions/plans | Create a new subscription plan |
| [**adminSubscriptionControllerDeactivatePlan**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerdeactivateplan) | **POST** /admin/subscriptions/plans/{id}/deactivate | Deactivate subscription plan |
| [**adminSubscriptionControllerExtendSubscription**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerextendsubscription) | **PATCH** /admin/subscriptions/{id}/extend | Extend subscription duration |
| [**adminSubscriptionControllerGetPendingApprovals**](AdminSubscriptionsApi.md#adminsubscriptioncontrollergetpendingapprovals) | **GET** /admin/subscriptions/pending | Get pending approval subscriptions |
| [**adminSubscriptionControllerGetPlanById**](AdminSubscriptionsApi.md#adminsubscriptioncontrollergetplanbyid) | **GET** /admin/subscriptions/plans/{id} | Get subscription plan by ID |
| [**adminSubscriptionControllerGetStats**](AdminSubscriptionsApi.md#adminsubscriptioncontrollergetstats) | **GET** /admin/subscriptions/stats | Get subscription statistics |
| [**adminSubscriptionControllerGetSubscriptionById**](AdminSubscriptionsApi.md#adminsubscriptioncontrollergetsubscriptionbyid) | **GET** /admin/subscriptions/{id} | Get subscription by ID |
| [**adminSubscriptionControllerListPlans**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerlistplans) | **GET** /admin/subscriptions/plans | List all subscription plans |
| [**adminSubscriptionControllerListSubscriptions**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerlistsubscriptions) | **GET** /admin/subscriptions | List all subscriptions |
| [**adminSubscriptionControllerUpdatePlan**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerupdateplan) | **PATCH** /admin/subscriptions/plans/{id} | Update subscription plan |
| [**adminSubscriptionControllerUpdateSubscriptionStatus**](AdminSubscriptionsApi.md#adminsubscriptioncontrollerupdatesubscriptionstatus) | **PATCH** /admin/subscriptions/{id}/status | Update subscription status |



## adminSubscriptionControllerActivatePlan

> AdminPlanResponseDto adminSubscriptionControllerActivatePlan(id)

Activate subscription plan

Re-activate a previously deactivated plan.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerActivatePlanRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Plan ID
    id: id_example,
  } satisfies AdminSubscriptionControllerActivatePlanRequest;

  try {
    const data = await api.adminSubscriptionControllerActivatePlan(body);
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
| **id** | `string` | Plan ID | [Defaults to `undefined`] |

### Return type

[**AdminPlanResponseDto**](AdminPlanResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plan activated successfully |  -  |
| **404** | Plan not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerBulkApproveSubscriptions

> adminSubscriptionControllerBulkApproveSubscriptions(bulkApproveSubscriptionsDto)

Bulk approve or reject subscriptions

Process multiple subscription approval/rejection requests at once.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerBulkApproveSubscriptionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // BulkApproveSubscriptionsDto
    bulkApproveSubscriptionsDto: ...,
  } satisfies AdminSubscriptionControllerBulkApproveSubscriptionsRequest;

  try {
    const data = await api.adminSubscriptionControllerBulkApproveSubscriptions(body);
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
| **bulkApproveSubscriptionsDto** | [BulkApproveSubscriptionsDto](BulkApproveSubscriptionsDto.md) |  | |

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
| **200** | Bulk operation completed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerCreatePlan

> AdminPlanResponseDto adminSubscriptionControllerCreatePlan(createPlanDto)

Create a new subscription plan

Create a new subscription plan with specified configuration.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerCreatePlanRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // CreatePlanDto
    createPlanDto: ...,
  } satisfies AdminSubscriptionControllerCreatePlanRequest;

  try {
    const data = await api.adminSubscriptionControllerCreatePlan(body);
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
| **createPlanDto** | [CreatePlanDto](CreatePlanDto.md) |  | |

### Return type

[**AdminPlanResponseDto**](AdminPlanResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Plan created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerDeactivatePlan

> AdminPlanResponseDto adminSubscriptionControllerDeactivatePlan(id)

Deactivate subscription plan

Soft-delete a plan by setting it to inactive. Existing subscriptions are not affected.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerDeactivatePlanRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Plan ID
    id: id_example,
  } satisfies AdminSubscriptionControllerDeactivatePlanRequest;

  try {
    const data = await api.adminSubscriptionControllerDeactivatePlan(body);
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
| **id** | `string` | Plan ID | [Defaults to `undefined`] |

### Return type

[**AdminPlanResponseDto**](AdminPlanResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plan deactivated successfully |  -  |
| **404** | Plan not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerExtendSubscription

> AdminSubscriptionResponseDto adminSubscriptionControllerExtendSubscription(id, extendSubscriptionDto)

Extend subscription duration

Extend the subscription end date by additional days.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerExtendSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Subscription ID
    id: id_example,
    // ExtendSubscriptionDto
    extendSubscriptionDto: ...,
  } satisfies AdminSubscriptionControllerExtendSubscriptionRequest;

  try {
    const data = await api.adminSubscriptionControllerExtendSubscription(body);
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
| **id** | `string` | Subscription ID | [Defaults to `undefined`] |
| **extendSubscriptionDto** | [ExtendSubscriptionDto](ExtendSubscriptionDto.md) |  | |

### Return type

[**AdminSubscriptionResponseDto**](AdminSubscriptionResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Subscription extended successfully |  -  |
| **404** | Subscription not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerGetPendingApprovals

> AdminSubscriptionListResponseDto adminSubscriptionControllerGetPendingApprovals()

Get pending approval subscriptions

Returns all subscriptions awaiting admin approval.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerGetPendingApprovalsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  try {
    const data = await api.adminSubscriptionControllerGetPendingApprovals();
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

[**AdminSubscriptionListResponseDto**](AdminSubscriptionListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Pending subscriptions retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerGetPlanById

> AdminPlanResponseDto adminSubscriptionControllerGetPlanById(id)

Get subscription plan by ID

Returns detailed plan information with subscription stats.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerGetPlanByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Plan ID
    id: id_example,
  } satisfies AdminSubscriptionControllerGetPlanByIdRequest;

  try {
    const data = await api.adminSubscriptionControllerGetPlanById(body);
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
| **id** | `string` | Plan ID | [Defaults to `undefined`] |

### Return type

[**AdminPlanResponseDto**](AdminPlanResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plan retrieved successfully |  -  |
| **404** | Plan not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerGetStats

> AdminSubscriptionStatsDto adminSubscriptionControllerGetStats()

Get subscription statistics

Returns aggregated subscription statistics for the admin dashboard.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerGetStatsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  try {
    const data = await api.adminSubscriptionControllerGetStats();
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

[**AdminSubscriptionStatsDto**](AdminSubscriptionStatsDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Statistics retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerGetSubscriptionById

> AdminSubscriptionResponseDto adminSubscriptionControllerGetSubscriptionById(id)

Get subscription by ID

Returns detailed subscription information.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerGetSubscriptionByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Subscription ID
    id: id_example,
  } satisfies AdminSubscriptionControllerGetSubscriptionByIdRequest;

  try {
    const data = await api.adminSubscriptionControllerGetSubscriptionById(body);
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
| **id** | `string` | Subscription ID | [Defaults to `undefined`] |

### Return type

[**AdminSubscriptionResponseDto**](AdminSubscriptionResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Subscription retrieved successfully |  -  |
| **404** | Subscription not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerListPlans

> AdminPlanListResponseDto adminSubscriptionControllerListPlans(page, limit, search, isActive, requiresApproval, sortBy, sortOrder)

List all subscription plans

Returns paginated list of subscription plans with filtering options.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerListPlansRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    search: search_example,
    // string (optional)
    isActive: isActive_example,
    // string (optional)
    requiresApproval: requiresApproval_example,
    // 'createdAt' | 'name' | 'price' | 'durationDays' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
  } satisfies AdminSubscriptionControllerListPlansRequest;

  try {
    const data = await api.adminSubscriptionControllerListPlans(body);
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
| **search** | `string` |  | [Optional] [Defaults to `undefined`] |
| **isActive** | `string` |  | [Optional] [Defaults to `undefined`] |
| **requiresApproval** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `createdAt`, `name`, `price`, `durationDays` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] [Enum: createdAt, name, price, durationDays] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `&#39;DESC&#39;`] [Enum: ASC, DESC] |

### Return type

[**AdminPlanListResponseDto**](AdminPlanListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plans retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerListSubscriptions

> AdminSubscriptionListResponseDto adminSubscriptionControllerListSubscriptions(page, limit, offset, search, status, planId, sortBy, sortOrder, startDate, endDate)

List all subscriptions

Returns paginated list of subscriptions with filtering options.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerListSubscriptionsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string (optional)
    page: page_example,
    // string (optional)
    limit: limit_example,
    // string (optional)
    offset: offset_example,
    // string (optional)
    search: search_example,
    // 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING_APPROVAL' | 'PAYMENT_FAILED' | 'REJECTED' (optional)
    status: status_example,
    // string (optional)
    planId: 38400000-8cf0-11bd-b23e-10b96e4ef00d,
    // 'createdAt' | 'startDate' | 'endDate' | 'status' (optional)
    sortBy: sortBy_example,
    // 'ASC' | 'DESC' (optional)
    sortOrder: sortOrder_example,
    // string (optional)
    startDate: startDate_example,
    // string (optional)
    endDate: endDate_example,
  } satisfies AdminSubscriptionControllerListSubscriptionsRequest;

  try {
    const data = await api.adminSubscriptionControllerListSubscriptions(body);
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
| **status** | `ACTIVE`, `EXPIRED`, `CANCELLED`, `PENDING_APPROVAL`, `PAYMENT_FAILED`, `REJECTED` |  | [Optional] [Defaults to `undefined`] [Enum: ACTIVE, EXPIRED, CANCELLED, PENDING_APPROVAL, PAYMENT_FAILED, REJECTED] |
| **planId** | `string` |  | [Optional] [Defaults to `undefined`] |
| **sortBy** | `createdAt`, `startDate`, `endDate`, `status` |  | [Optional] [Defaults to `&#39;createdAt&#39;`] [Enum: createdAt, startDate, endDate, status] |
| **sortOrder** | `ASC`, `DESC` |  | [Optional] [Defaults to `&#39;DESC&#39;`] [Enum: ASC, DESC] |
| **startDate** | `string` |  | [Optional] [Defaults to `undefined`] |
| **endDate** | `string` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**AdminSubscriptionListResponseDto**](AdminSubscriptionListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Subscriptions retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerUpdatePlan

> AdminPlanResponseDto adminSubscriptionControllerUpdatePlan(id, updatePlanDto)

Update subscription plan

Update plan configuration.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerUpdatePlanRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Plan ID
    id: id_example,
    // UpdatePlanDto
    updatePlanDto: ...,
  } satisfies AdminSubscriptionControllerUpdatePlanRequest;

  try {
    const data = await api.adminSubscriptionControllerUpdatePlan(body);
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
| **id** | `string` | Plan ID | [Defaults to `undefined`] |
| **updatePlanDto** | [UpdatePlanDto](UpdatePlanDto.md) |  | |

### Return type

[**AdminPlanResponseDto**](AdminPlanResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Plan updated successfully |  -  |
| **404** | Plan not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## adminSubscriptionControllerUpdateSubscriptionStatus

> AdminSubscriptionResponseDto adminSubscriptionControllerUpdateSubscriptionStatus(id, updateSubscriptionStatusDto)

Update subscription status

Manually update subscription status.

### Example

```ts
import {
  Configuration,
  AdminSubscriptionsApi,
} from '';
import type { AdminSubscriptionControllerUpdateSubscriptionStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AdminSubscriptionsApi();

  const body = {
    // string | Subscription ID
    id: id_example,
    // UpdateSubscriptionStatusDto
    updateSubscriptionStatusDto: ...,
  } satisfies AdminSubscriptionControllerUpdateSubscriptionStatusRequest;

  try {
    const data = await api.adminSubscriptionControllerUpdateSubscriptionStatus(body);
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
| **id** | `string` | Subscription ID | [Defaults to `undefined`] |
| **updateSubscriptionStatusDto** | [UpdateSubscriptionStatusDto](UpdateSubscriptionStatusDto.md) |  | |

### Return type

[**AdminSubscriptionResponseDto**](AdminSubscriptionResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Subscription status updated |  -  |
| **404** | Subscription not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

