# SupportApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**supportControllerCreateTicket**](SupportApi.md#supportcontrollercreateticket) | **POST** /support | Create a support ticket via Zoho Desk |



## supportControllerCreateTicket

> SupportTicketResponseDto supportControllerCreateTicket(createSupportTicketDto)

Create a support ticket via Zoho Desk

### Example

```ts
import {
  Configuration,
  SupportApi,
} from '';
import type { SupportControllerCreateTicketRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new SupportApi();

  const body = {
    // CreateSupportTicketDto
    createSupportTicketDto: ...,
  } satisfies SupportControllerCreateTicketRequest;

  try {
    const data = await api.supportControllerCreateTicket(body);
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
| **createSupportTicketDto** | [CreateSupportTicketDto](CreateSupportTicketDto.md) |  | |

### Return type

[**SupportTicketResponseDto**](SupportTicketResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Support ticket successfully created. |  -  |
| **400** | Validation error in request body. |  -  |
| **401** | User is not authenticated. |  -  |
| **500** | Zoho Desk API failure. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

