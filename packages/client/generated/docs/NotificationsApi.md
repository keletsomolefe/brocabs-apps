# NotificationsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**notificationsControllerDeleteNotification**](NotificationsApi.md#notificationscontrollerdeletenotification) | **DELETE** /notifications/{id} | Delete a notification |
| [**notificationsControllerGetNotifications**](NotificationsApi.md#notificationscontrollergetnotifications) | **GET** /notifications | Get notifications for the current user |
| [**notificationsControllerMarkAllAsRead**](NotificationsApi.md#notificationscontrollermarkallasread) | **PATCH** /notifications/read-all | Mark all notifications as read |
| [**notificationsControllerMarkAsRead**](NotificationsApi.md#notificationscontrollermarkasread) | **PATCH** /notifications/{id}/read | Mark a notification as read |



## notificationsControllerDeleteNotification

> notificationsControllerDeleteNotification(id)

Delete a notification

### Example

```ts
import {
  Configuration,
  NotificationsApi,
} from '';
import type { NotificationsControllerDeleteNotificationRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationsApi();

  const body = {
    // string
    id: id_example,
  } satisfies NotificationsControllerDeleteNotificationRequest;

  try {
    const data = await api.notificationsControllerDeleteNotification(body);
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

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Notification deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## notificationsControllerGetNotifications

> NotificationListResponseDto notificationsControllerGetNotifications(profileType, filter, cursor, limit)

Get notifications for the current user

### Example

```ts
import {
  Configuration,
  NotificationsApi,
} from '';
import type { NotificationsControllerGetNotificationsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationsApi();

  const body = {
    // 'rider' | 'driver' | Profile type to filter notifications
    profileType: profileType_example,
    // 'all' | 'unread' (optional)
    filter: filter_example,
    // string (optional)
    cursor: cursor_example,
    // number (optional)
    limit: 8.14,
  } satisfies NotificationsControllerGetNotificationsRequest;

  try {
    const data = await api.notificationsControllerGetNotifications(body);
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
| **profileType** | `rider`, `driver` | Profile type to filter notifications | [Defaults to `undefined`] [Enum: rider, driver] |
| **filter** | `all`, `unread` |  | [Optional] [Defaults to `undefined`] [Enum: all, unread] |
| **cursor** | `string` |  | [Optional] [Defaults to `undefined`] |
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**NotificationListResponseDto**](NotificationListResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Notifications retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## notificationsControllerMarkAllAsRead

> notificationsControllerMarkAllAsRead(profileType)

Mark all notifications as read

### Example

```ts
import {
  Configuration,
  NotificationsApi,
} from '';
import type { NotificationsControllerMarkAllAsReadRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationsApi();

  const body = {
    // 'rider' | 'driver' | Profile type to mark notifications as read
    profileType: profileType_example,
  } satisfies NotificationsControllerMarkAllAsReadRequest;

  try {
    const data = await api.notificationsControllerMarkAllAsRead(body);
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
| **profileType** | `rider`, `driver` | Profile type to mark notifications as read | [Defaults to `undefined`] [Enum: rider, driver] |

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
| **200** | All notifications marked as read |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## notificationsControllerMarkAsRead

> NotificationResponseDto notificationsControllerMarkAsRead(id)

Mark a notification as read

### Example

```ts
import {
  Configuration,
  NotificationsApi,
} from '';
import type { NotificationsControllerMarkAsReadRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationsApi();

  const body = {
    // string
    id: id_example,
  } satisfies NotificationsControllerMarkAsReadRequest;

  try {
    const data = await api.notificationsControllerMarkAsRead(body);
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

[**NotificationResponseDto**](NotificationResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Notification marked as read |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

