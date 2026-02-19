# PaymentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**paymentControllerCompleteCashTransaction**](PaymentsApi.md#paymentcontrollercompletecashtransaction) | **POST** /payments/transactions/{id}/complete | Complete a pending cash transaction |
| [**paymentControllerGetTransaction**](PaymentsApi.md#paymentcontrollergettransaction) | **GET** /payments/transactions/{id} | Get transaction details by ID |
| [**paymentControllerGetTransactionByReference**](PaymentsApi.md#paymentcontrollergettransactionbyreference) | **GET** /payments/transactions/reference/{reference} | Get transaction details by reference |
| [**paymentControllerProcessPayment**](PaymentsApi.md#paymentcontrollerprocesspayment) | **POST** /payments/process | Process a payment transaction |
| [**paymentControllerRefundTransaction**](PaymentsApi.md#paymentcontrollerrefundtransaction) | **POST** /payments/transactions/{id}/refund | Refund a completed transaction |
| [**tradeSafeControllerGetBankAccountTypes**](PaymentsApi.md#tradesafecontrollergetbankaccounttypes) | **GET** /payments/tradesafe/bank-account-types | Get TradeSafe bank account types |
| [**tradeSafeControllerGetUniversalBranchCodes**](PaymentsApi.md#tradesafecontrollergetuniversalbranchcodes) | **GET** /payments/tradesafe/universal-branch-codes | Get TradeSafe universal branch codes |
| [**tradeSafeControllerWithdraw**](PaymentsApi.md#tradesafecontrollerwithdraw) | **POST** /payments/tradesafe/withdraw | Withdraw funds from token account |



## paymentControllerCompleteCashTransaction

> PaymentResponseDto paymentControllerCompleteCashTransaction(id)

Complete a pending cash transaction

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentControllerCompleteCashTransactionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // string
    id: id_example,
  } satisfies PaymentControllerCompleteCashTransactionRequest;

  try {
    const data = await api.paymentControllerCompleteCashTransaction(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PaymentResponseDto**](PaymentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transaction completed |  -  |
| **400** | Transaction cannot be completed |  -  |
| **404** | Transaction not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## paymentControllerGetTransaction

> PaymentResponseDto paymentControllerGetTransaction(id)

Get transaction details by ID

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentControllerGetTransactionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // string
    id: id_example,
  } satisfies PaymentControllerGetTransactionRequest;

  try {
    const data = await api.paymentControllerGetTransaction(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PaymentResponseDto**](PaymentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transaction found |  -  |
| **404** | Transaction not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## paymentControllerGetTransactionByReference

> PaymentResponseDto paymentControllerGetTransactionByReference(reference)

Get transaction details by reference

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentControllerGetTransactionByReferenceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // string
    reference: reference_example,
  } satisfies PaymentControllerGetTransactionByReferenceRequest;

  try {
    const data = await api.paymentControllerGetTransactionByReference(body);
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
| **reference** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PaymentResponseDto**](PaymentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transaction found |  -  |
| **404** | Transaction not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## paymentControllerProcessPayment

> PaymentResponseDto paymentControllerProcessPayment(processPaymentDto)

Process a payment transaction

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentControllerProcessPaymentRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // ProcessPaymentDto
    processPaymentDto: ...,
  } satisfies PaymentControllerProcessPaymentRequest;

  try {
    const data = await api.paymentControllerProcessPayment(body);
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
| **processPaymentDto** | [ProcessPaymentDto](ProcessPaymentDto.md) |  | |

### Return type

[**PaymentResponseDto**](PaymentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Payment processed successfully |  -  |
| **400** | Bad request / Insufficient funds |  -  |
| **402** | Payment failed |  -  |
| **404** | Card not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## paymentControllerRefundTransaction

> PaymentResponseDto paymentControllerRefundTransaction(id)

Refund a completed transaction

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { PaymentControllerRefundTransactionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // string
    id: id_example,
  } satisfies PaymentControllerRefundTransactionRequest;

  try {
    const data = await api.paymentControllerRefundTransaction(body);
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
| **id** | `string` |  | [Defaults to `undefined`] |

### Return type

[**PaymentResponseDto**](PaymentResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transaction refunded |  -  |
| **400** | Transaction cannot be refunded |  -  |
| **404** | Transaction not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## tradeSafeControllerGetBankAccountTypes

> Array&lt;object&gt; tradeSafeControllerGetBankAccountTypes()

Get TradeSafe bank account types

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { TradeSafeControllerGetBankAccountTypesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  try {
    const data = await api.tradeSafeControllerGetBankAccountTypes();
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

**Array<object>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of bank account types |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## tradeSafeControllerGetUniversalBranchCodes

> Array&lt;object&gt; tradeSafeControllerGetUniversalBranchCodes()

Get TradeSafe universal branch codes

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { TradeSafeControllerGetUniversalBranchCodesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  try {
    const data = await api.tradeSafeControllerGetUniversalBranchCodes();
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

**Array<object>**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of universal branch codes |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## tradeSafeControllerWithdraw

> tradeSafeControllerWithdraw(withdrawRequestDto)

Withdraw funds from token account

### Example

```ts
import {
  Configuration,
  PaymentsApi,
} from '';
import type { TradeSafeControllerWithdrawRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PaymentsApi();

  const body = {
    // WithdrawRequestDto
    withdrawRequestDto: ...,
  } satisfies TradeSafeControllerWithdrawRequest;

  try {
    const data = await api.tradeSafeControllerWithdraw(body);
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
| **withdrawRequestDto** | [WithdrawRequestDto](WithdrawRequestDto.md) |  | |

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
| **200** | Withdrawal successful |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

