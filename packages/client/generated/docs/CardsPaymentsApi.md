# CardsPaymentsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**cardControllerChargeCard**](CardsPaymentsApi.md#cardcontrollerchargecard) | **POST** /cards/charge | Charge a saved card |
| [**cardControllerCreateCheckout**](CardsPaymentsApi.md#cardcontrollercreatecheckout) | **POST** /cards/checkout | Create a checkout session |
| [**cardControllerDeleteCard**](CardsPaymentsApi.md#cardcontrollerdeletecard) | **DELETE** /cards/saved/{cardId} | Delete a saved card |
| [**cardControllerGetAddCardUrl**](CardsPaymentsApi.md#cardcontrollergetaddcardurl) | **GET** /cards/authorize | Get card authorization URL for current user |
| [**cardControllerGetMySavedCards**](CardsPaymentsApi.md#cardcontrollergetmysavedcards) | **GET** /cards/saved | Get saved cards for current user |
| [**cardControllerPayAdminFee**](CardsPaymentsApi.md#cardcontrollerpayadminfee) | **POST** /cards/pay-admin-fee | Pay admin fee with saved card |



## cardControllerChargeCard

> ChargeCardResponseDto cardControllerChargeCard(chargeCardDto)

Charge a saved card

Charges a previously saved card for a transaction. The card must have been successfully used in a previous transaction.

### Example

```ts
import {
  Configuration,
  CardsPaymentsApi,
} from '';
import type { CardControllerChargeCardRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CardsPaymentsApi();

  const body = {
    // ChargeCardDto
    chargeCardDto: ...,
  } satisfies CardControllerChargeCardRequest;

  try {
    const data = await api.cardControllerChargeCard(body);
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
| **chargeCardDto** | [ChargeCardDto](ChargeCardDto.md) |  | |

### Return type

[**ChargeCardResponseDto**](ChargeCardResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Card charged successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## cardControllerCreateCheckout

> CheckoutResponseDto cardControllerCreateCheckout(createCheckoutDto)

Create a checkout session

Creates a TradeSafe transaction and returns a checkout URL for payment

### Example

```ts
import {
  Configuration,
  CardsPaymentsApi,
} from '';
import type { CardControllerCreateCheckoutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CardsPaymentsApi();

  const body = {
    // CreateCheckoutDto
    createCheckoutDto: ...,
  } satisfies CardControllerCreateCheckoutRequest;

  try {
    const data = await api.cardControllerCreateCheckout(body);
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
| **createCheckoutDto** | [CreateCheckoutDto](CreateCheckoutDto.md) |  | |

### Return type

[**CheckoutResponseDto**](CheckoutResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Checkout session created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## cardControllerDeleteCard

> cardControllerDeleteCard(cardId)

Delete a saved card

Deletes a saved TradeSafe card for the authenticated user

### Example

```ts
import {
  Configuration,
  CardsPaymentsApi,
} from '';
import type { CardControllerDeleteCardRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CardsPaymentsApi();

  const body = {
    // string
    cardId: cardId_example,
  } satisfies CardControllerDeleteCardRequest;

  try {
    const data = await api.cardControllerDeleteCard(body);
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
| **cardId** | `string` |  | [Defaults to `undefined`] |

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
| **204** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## cardControllerGetAddCardUrl

> CardControllerGetAddCardUrl200Response cardControllerGetAddCardUrl()

Get card authorization URL for current user

Returns a URL to authorize a new card for the authenticated user

### Example

```ts
import {
  Configuration,
  CardsPaymentsApi,
} from '';
import type { CardControllerGetAddCardUrlRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CardsPaymentsApi();

  try {
    const data = await api.cardControllerGetAddCardUrl();
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

[**CardControllerGetAddCardUrl200Response**](CardControllerGetAddCardUrl200Response.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Authorization URL |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## cardControllerGetMySavedCards

> Array&lt;SavedCardDto&gt; cardControllerGetMySavedCards()

Get saved cards for current user

Retrieves all saved cards associated with the current user

### Example

```ts
import {
  Configuration,
  CardsPaymentsApi,
} from '';
import type { CardControllerGetMySavedCardsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CardsPaymentsApi();

  try {
    const data = await api.cardControllerGetMySavedCards();
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

[**Array&lt;SavedCardDto&gt;**](SavedCardDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | List of saved cards |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## cardControllerPayAdminFee

> ChargeCardResponseDto cardControllerPayAdminFee(payAdminFeeDto)

Pay admin fee with saved card

Charges the admin fee (R300) to a saved card

### Example

```ts
import {
  Configuration,
  CardsPaymentsApi,
} from '';
import type { CardControllerPayAdminFeeRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CardsPaymentsApi();

  const body = {
    // PayAdminFeeDto
    payAdminFeeDto: ...,
  } satisfies CardControllerPayAdminFeeRequest;

  try {
    const data = await api.cardControllerPayAdminFee(body);
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
| **payAdminFeeDto** | [PayAdminFeeDto](PayAdminFeeDto.md) |  | |

### Return type

[**ChargeCardResponseDto**](ChargeCardResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Fee paid successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

