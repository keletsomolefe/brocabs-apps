# WalletApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**walletControllerAddFunds**](WalletApi.md#walletcontrolleraddfunds) | **POST** /wallet/add-funds | Add funds to wallet (Generate Payment Link) |
| [**walletControllerGetBalance**](WalletApi.md#walletcontrollergetbalance) | **GET** /wallet/balance | Get wallet balance for current profile |
| [**walletControllerGetBankAccount**](WalletApi.md#walletcontrollergetbankaccount) | **GET** /wallet/bank-account | Get bank account details for current profile |
| [**walletControllerGetTransactionHistory**](WalletApi.md#walletcontrollergettransactionhistory) | **GET** /wallet/transactions | Get wallet transaction history for current profile |
| [**walletControllerRechargeWallet**](WalletApi.md#walletcontrollerrechargewallet) | **POST** /wallet/recharge | Recharge wallet |
| [**walletControllerUpdateBankDetails**](WalletApi.md#walletcontrollerupdatebankdetails) | **POST** /wallet/bank-details | Update driver bank details |
| [**walletControllerVerifyCheckoutTransaction**](WalletApi.md#walletcontrollerverifycheckouttransaction) | **POST** /wallet/checkout/{transactionId}/verify | Verify and complete checkout transaction |



## walletControllerAddFunds

> TokenDepositResponseDto walletControllerAddFunds(addFundsDto)

Add funds to wallet (Generate Payment Link)

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerAddFundsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  const body = {
    // AddFundsDto
    addFundsDto: ...,
  } satisfies WalletControllerAddFundsRequest;

  try {
    const data = await api.walletControllerAddFunds(body);
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
| **addFundsDto** | [AddFundsDto](AddFundsDto.md) |  | |

### Return type

[**TokenDepositResponseDto**](TokenDepositResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Funds added successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## walletControllerGetBalance

> WalletBalanceDto walletControllerGetBalance()

Get wallet balance for current profile

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerGetBalanceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  try {
    const data = await api.walletControllerGetBalance();
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

[**WalletBalanceDto**](WalletBalanceDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Wallet balance retrieved |  -  |
| **400** | Profile not found |  -  |
| **404** | Wallet not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## walletControllerGetBankAccount

> BankDetailsDto walletControllerGetBankAccount()

Get bank account details for current profile

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerGetBankAccountRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  try {
    const data = await api.walletControllerGetBankAccount();
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

[**BankDetailsDto**](BankDetailsDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Bank account details retrieved |  -  |
| **404** | Bank account not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## walletControllerGetTransactionHistory

> PaymentListResponseDto walletControllerGetTransactionHistory(limit, offset)

Get wallet transaction history for current profile

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerGetTransactionHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  const body = {
    // number (optional)
    limit: 8.14,
    // number (optional)
    offset: 8.14,
  } satisfies WalletControllerGetTransactionHistoryRequest;

  try {
    const data = await api.walletControllerGetTransactionHistory(body);
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
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |
| **offset** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**PaymentListResponseDto**](PaymentListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Transaction history retrieved |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## walletControllerRechargeWallet

> object walletControllerRechargeWallet(rechargeWalletDto)

Recharge wallet

Recharge wallet using a saved card or by generating a checkout URL.

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerRechargeWalletRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  const body = {
    // RechargeWalletDto
    rechargeWalletDto: ...,
  } satisfies WalletControllerRechargeWalletRequest;

  try {
    const data = await api.walletControllerRechargeWallet(body);
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
| **rechargeWalletDto** | [RechargeWalletDto](RechargeWalletDto.md) |  | |

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Wallet recharged or checkout URL generated |  -  |
| **400** | Invalid request or card not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## walletControllerUpdateBankDetails

> walletControllerUpdateBankDetails(updateBankDetailsDto)

Update driver bank details

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerUpdateBankDetailsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  const body = {
    // UpdateBankDetailsDto
    updateBankDetailsDto: ...,
  } satisfies WalletControllerUpdateBankDetailsRequest;

  try {
    const data = await api.walletControllerUpdateBankDetails(body);
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
| **200** | Bank details updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## walletControllerVerifyCheckoutTransaction

> PaymentResponseDto walletControllerVerifyCheckoutTransaction(transactionId)

Verify and complete checkout transaction

Checks TradeSafe transaction status and completes wallet recharge if payment was successful

### Example

```ts
import {
  Configuration,
  WalletApi,
} from '';
import type { WalletControllerVerifyCheckoutTransactionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new WalletApi();

  const body = {
    // string
    transactionId: transactionId_example,
  } satisfies WalletControllerVerifyCheckoutTransactionRequest;

  try {
    const data = await api.walletControllerVerifyCheckoutTransaction(body);
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
| **transactionId** | `string` |  | [Defaults to `undefined`] |

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
| **200** | Transaction verified and completed |  -  |
| **400** | Transaction not found or already completed |  -  |
| **404** | Transaction not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

