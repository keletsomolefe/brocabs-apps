# SubscriptionsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**subscriptionControllerApproveRequest**](SubscriptionsApi.md#subscriptioncontrollerapproverequest) | **POST** /subscriptions/admin/approve | [ADMIN] Approve or reject a pending subscription |
| [**subscriptionControllerCancelSubscription**](SubscriptionsApi.md#subscriptioncontrollercancelsubscription) | **POST** /subscriptions/cancel | Cancel subscription |
| [**subscriptionControllerEnableAutoRenew**](SubscriptionsApi.md#subscriptioncontrollerenableautorenew) | **POST** /subscriptions/enable-auto-renew | Enable subscription auto-renewal |
| [**subscriptionControllerGetCurrentSubscription**](SubscriptionsApi.md#subscriptioncontrollergetcurrentsubscription) | **GET** /subscriptions/me | Get current subscription status |
| [**subscriptionControllerGetHistory**](SubscriptionsApi.md#subscriptioncontrollergethistory) | **GET** /subscriptions/history | Get subscription history |
| [**subscriptionControllerGetPlans**](SubscriptionsApi.md#subscriptioncontrollergetplans) | **GET** /subscriptions/plans | Get all active subscription plans |
| [**subscriptionControllerGetSubscription**](SubscriptionsApi.md#subscriptioncontrollergetsubscription) | **GET** /subscriptions/{subscriptionId} | Get subscription details by ID |
| [**subscriptionControllerSubscribe**](SubscriptionsApi.md#subscriptioncontrollersubscribe) | **POST** /subscriptions/subscribe | Subscribe driver to a subscription plan |
| [**subscriptionControllerSubscribeOnboarding**](SubscriptionsApi.md#subscriptioncontrollersubscribeonboarding) | **POST** /subscriptions/onboarding/subscribe | Subscribe driver to a plan during onboarding (no payment) |



## subscriptionControllerApproveRequest

> subscriptionControllerApproveRequest(approveSubscriptionDto)

[ADMIN] Approve or reject a pending subscription

Admin endpoint to approve (and charge) or reject pending subscription requests.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerApproveRequestRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  const body = {
    // ApproveSubscriptionDto
    approveSubscriptionDto: ...,
  } satisfies SubscriptionControllerApproveRequestRequest;

  try {
    const data = await api.subscriptionControllerApproveRequest(body);
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
| **approveSubscriptionDto** | [ApproveSubscriptionDto](ApproveSubscriptionDto.md) |  | |

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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscriptionControllerCancelSubscription

> subscriptionControllerCancelSubscription(subscriptionIdDto)

Cancel subscription

Disables auto-renewal. Does not delete the subscription record.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerCancelSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  const body = {
    // SubscriptionIdDto
    subscriptionIdDto: ...,
  } satisfies SubscriptionControllerCancelSubscriptionRequest;

  try {
    const data = await api.subscriptionControllerCancelSubscription(body);
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
| **subscriptionIdDto** | [SubscriptionIdDto](SubscriptionIdDto.md) |  | |

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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscriptionControllerEnableAutoRenew

> subscriptionControllerEnableAutoRenew(subscriptionIdDto)

Enable subscription auto-renewal

Enables auto-renewal for an active subscription.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerEnableAutoRenewRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  const body = {
    // SubscriptionIdDto
    subscriptionIdDto: ...,
  } satisfies SubscriptionControllerEnableAutoRenewRequest;

  try {
    const data = await api.subscriptionControllerEnableAutoRenew(body);
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
| **subscriptionIdDto** | [SubscriptionIdDto](SubscriptionIdDto.md) |  | |

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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscriptionControllerGetCurrentSubscription

> DriverSubscription subscriptionControllerGetCurrentSubscription()

Get current subscription status

Returns the active or pending subscription for the authenticated driver.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerGetCurrentSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  try {
    const data = await api.subscriptionControllerGetCurrentSubscription();
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

[**DriverSubscription**](DriverSubscription.md)

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


## subscriptionControllerGetHistory

> subscriptionControllerGetHistory()

Get subscription history

Returns all subscriptions (active and inactive) for the authenticated driver.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerGetHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  try {
    const data = await api.subscriptionControllerGetHistory();
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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscriptionControllerGetPlans

> Array&lt;SubscriptionPlan&gt; subscriptionControllerGetPlans()

Get all active subscription plans

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerGetPlansRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  try {
    const data = await api.subscriptionControllerGetPlans();
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

[**Array&lt;SubscriptionPlan&gt;**](SubscriptionPlan.md)

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


## subscriptionControllerGetSubscription

> subscriptionControllerGetSubscription(subscriptionId)

Get subscription details by ID

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerGetSubscriptionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  const body = {
    // string
    subscriptionId: subscriptionId_example,
  } satisfies SubscriptionControllerGetSubscriptionRequest;

  try {
    const data = await api.subscriptionControllerGetSubscription(body);
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
| **subscriptionId** | `string` |  | [Defaults to `undefined`] |

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
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscriptionControllerSubscribe

> subscriptionControllerSubscribe(createSubscriptionDto)

Subscribe driver to a subscription plan

Creates a subscription. If plan requires approval, returns PENDING_APPROVAL. Otherwise, processes payment and activates.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerSubscribeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  const body = {
    // CreateSubscriptionDto
    createSubscriptionDto: ...,
  } satisfies SubscriptionControllerSubscribeRequest;

  try {
    const data = await api.subscriptionControllerSubscribe(body);
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
| **createSubscriptionDto** | [CreateSubscriptionDto](CreateSubscriptionDto.md) |  | |

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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## subscriptionControllerSubscribeOnboarding

> subscriptionControllerSubscribeOnboarding(onboardingSubscriptionDto)

Subscribe driver to a plan during onboarding (no payment)

Creates a PENDING_APPROVAL subscription during driver onboarding. No payment is processed. Admin must approve before subscription becomes active.

### Example

```ts
import {
  Configuration,
  SubscriptionsApi,
} from '';
import type { SubscriptionControllerSubscribeOnboardingRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SubscriptionsApi();

  const body = {
    // OnboardingSubscriptionDto
    onboardingSubscriptionDto: ...,
  } satisfies SubscriptionControllerSubscribeOnboardingRequest;

  try {
    const data = await api.subscriptionControllerSubscribeOnboarding(body);
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
| **onboardingSubscriptionDto** | [OnboardingSubscriptionDto](OnboardingSubscriptionDto.md) |  | |

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
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

