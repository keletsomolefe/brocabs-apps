# ChatApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**chatControllerGetChat**](ChatApi.md#chatcontrollergetchat) | **GET** /rides/{id}/chat | Get chat details for a ride |
| [**chatControllerGetMessage**](ChatApi.md#chatcontrollergetmessage) | **GET** /rides/{id}/chat/messages/{messageId} | Get a single chat message |
| [**chatControllerSendMessage**](ChatApi.md#chatcontrollersendmessage) | **POST** /rides/{id}/chat | Send a chat message for a ride |



## chatControllerGetChat

> ChatResponseDto chatControllerGetChat(id, before, since, order, limit)

Get chat details for a ride

### Example

```ts
import {
  Configuration,
  ChatApi,
} from '';
import type { ChatControllerGetChatRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ChatApi();

  const body = {
    // string
    id: id_example,
    // Date (optional)
    before: 2013-10-20T19:20:30+01:00,
    // Date (optional)
    since: 2013-10-20T19:20:30+01:00,
    // 'ASC' | 'DESC' (optional)
    order: order_example,
    // number (optional)
    limit: 8.14,
  } satisfies ChatControllerGetChatRequest;

  try {
    const data = await api.chatControllerGetChat(body);
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
| **before** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **since** | `Date` |  | [Optional] [Defaults to `undefined`] |
| **order** | `ASC`, `DESC` |  | [Optional] [Defaults to `undefined`] [Enum: ASC, DESC] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**ChatResponseDto**](ChatResponseDto.md)

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


## chatControllerGetMessage

> MessageResponseDto chatControllerGetMessage(id, messageId)

Get a single chat message

### Example

```ts
import {
  Configuration,
  ChatApi,
} from '';
import type { ChatControllerGetMessageRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ChatApi();

  const body = {
    // string
    id: id_example,
    // string
    messageId: messageId_example,
  } satisfies ChatControllerGetMessageRequest;

  try {
    const data = await api.chatControllerGetMessage(body);
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
| **messageId** | `string` |  | [Defaults to `undefined`] |

### Return type

[**MessageResponseDto**](MessageResponseDto.md)

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


## chatControllerSendMessage

> MessageResponseDto chatControllerSendMessage(id, createMessageDto)

Send a chat message for a ride

### Example

```ts
import {
  Configuration,
  ChatApi,
} from '';
import type { ChatControllerSendMessageRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ChatApi();

  const body = {
    // string
    id: id_example,
    // CreateMessageDto
    createMessageDto: ...,
  } satisfies ChatControllerSendMessageRequest;

  try {
    const data = await api.chatControllerSendMessage(body);
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
| **createMessageDto** | [CreateMessageDto](CreateMessageDto.md) |  | |

### Return type

[**MessageResponseDto**](MessageResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

