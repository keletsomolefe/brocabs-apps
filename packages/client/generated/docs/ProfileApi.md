# ProfileApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**profileControllerGetProfile**](ProfileApi.md#profilecontrollergetprofile) | **GET** /auth/profile |  |



## profileControllerGetProfile

> object profileControllerGetProfile()



### Example

```ts
import {
  Configuration,
  ProfileApi,
} from '';
import type { ProfileControllerGetProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new ProfileApi();

  try {
    const data = await api.profileControllerGetProfile();
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

**object**

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

