# NotificationSettingsApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**notificationSettingsControllerGetSettings**](NotificationSettingsApi.md#notificationsettingscontrollergetsettings) | **GET** /notification-settings | Get notification settings for the current user |
| [**notificationSettingsControllerUpdateSettings**](NotificationSettingsApi.md#notificationsettingscontrollerupdatesettings) | **PUT** /notification-settings | Update notification settings for the current user |



## notificationSettingsControllerGetSettings

> NotificationSettingsResponseDto notificationSettingsControllerGetSettings()

Get notification settings for the current user

### Example

```ts
import {
  Configuration,
  NotificationSettingsApi,
} from '';
import type { NotificationSettingsControllerGetSettingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationSettingsApi();

  try {
    const data = await api.notificationSettingsControllerGetSettings();
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

[**NotificationSettingsResponseDto**](NotificationSettingsResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Notification settings retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## notificationSettingsControllerUpdateSettings

> NotificationSettingsResponseDto notificationSettingsControllerUpdateSettings(updateNotificationSettingsDto)

Update notification settings for the current user

### Example

```ts
import {
  Configuration,
  NotificationSettingsApi,
} from '';
import type { NotificationSettingsControllerUpdateSettingsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new NotificationSettingsApi();

  const body = {
    // UpdateNotificationSettingsDto
    updateNotificationSettingsDto: ...,
  } satisfies NotificationSettingsControllerUpdateSettingsRequest;

  try {
    const data = await api.notificationSettingsControllerUpdateSettings(body);
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
| **updateNotificationSettingsDto** | [UpdateNotificationSettingsDto](UpdateNotificationSettingsDto.md) |  | |

### Return type

[**NotificationSettingsResponseDto**](NotificationSettingsResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Notification settings updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

