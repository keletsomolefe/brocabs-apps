# AuthApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**authControllerChangePassword**](AuthApi.md#authcontrollerchangepassword) | **POST** /auth/change-password | Change user password |
| [**authControllerCreateAccount**](AuthApi.md#authcontrollercreateaccount) | **POST** /auth/create-account | Create user account |
| [**authControllerCreateDriverProfile**](AuthApi.md#authcontrollercreatedriverprofile) | **POST** /auth/create-driver-profile | Create driver profile |
| [**authControllerCreateRiderProfile**](AuthApi.md#authcontrollercreateriderprofile) | **POST** /auth/create-rider-profile | Create rider profile |
| [**authControllerDeleteAccount**](AuthApi.md#authcontrollerdeleteaccount) | **DELETE** /auth/account | Delete/deactivate user account |
| [**authControllerForgotPassword**](AuthApi.md#authcontrollerforgotpassword) | **POST** /auth/forgot-password | Reset password after OTP verification |
| [**authControllerGetMqttToken**](AuthApi.md#authcontrollergetmqtttoken) | **GET** /auth/mqtt-token | Get MQTT authentication token |
| [**authControllerGetProfile**](AuthApi.md#authcontrollergetprofile) | **GET** /auth/profile | Get user profile |
| [**authControllerGetSession**](AuthApi.md#authcontrollergetsession) | **GET** /auth/session | Get current session state |
| [**authControllerLogout**](AuthApi.md#authcontrollerlogout) | **POST** /auth/logout | Logout user |
| [**authControllerUpdateProfile**](AuthApi.md#authcontrollerupdateprofile) | **PUT** /auth/profile | Update user profile |
| [**loginControllerLogin**](AuthApi.md#logincontrollerlogin) | **POST** /auth/login |  |



## authControllerChangePassword

> authControllerChangePassword(changePasswordDto)

Change user password

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerChangePasswordRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // ChangePasswordDto
    changePasswordDto: ...,
  } satisfies AuthControllerChangePasswordRequest;

  try {
    const data = await api.authControllerChangePassword(body);
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
| **changePasswordDto** | [ChangePasswordDto](ChangePasswordDto.md) |  | |

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
| **200** | Password changed successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerCreateAccount

> authControllerCreateAccount(createAccountDto)

Create user account

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerCreateAccountRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // CreateAccountDto
    createAccountDto: ...,
  } satisfies AuthControllerCreateAccountRequest;

  try {
    const data = await api.authControllerCreateAccount(body);
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
| **createAccountDto** | [CreateAccountDto](CreateAccountDto.md) |  | |

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
| **201** | Account created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerCreateDriverProfile

> authControllerCreateDriverProfile(createProfileDto)

Create driver profile

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerCreateDriverProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // CreateProfileDto
    createProfileDto: ...,
  } satisfies AuthControllerCreateDriverProfileRequest;

  try {
    const data = await api.authControllerCreateDriverProfile(body);
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
| **createProfileDto** | [CreateProfileDto](CreateProfileDto.md) |  | |

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
| **201** | Driver profile created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerCreateRiderProfile

> authControllerCreateRiderProfile(createProfileDto)

Create rider profile

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerCreateRiderProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // CreateProfileDto
    createProfileDto: ...,
  } satisfies AuthControllerCreateRiderProfileRequest;

  try {
    const data = await api.authControllerCreateRiderProfile(body);
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
| **createProfileDto** | [CreateProfileDto](CreateProfileDto.md) |  | |

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
| **201** | Rider profile created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerDeleteAccount

> authControllerDeleteAccount(deleteAccountDto)

Delete/deactivate user account

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerDeleteAccountRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // DeleteAccountDto
    deleteAccountDto: ...,
  } satisfies AuthControllerDeleteAccountRequest;

  try {
    const data = await api.authControllerDeleteAccount(body);
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
| **deleteAccountDto** | [DeleteAccountDto](DeleteAccountDto.md) |  | |

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
| **200** | Account deactivated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerForgotPassword

> authControllerForgotPassword(forgotPasswordDto)

Reset password after OTP verification

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerForgotPasswordRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // ForgotPasswordDto
    forgotPasswordDto: ...,
  } satisfies AuthControllerForgotPasswordRequest;

  try {
    const data = await api.authControllerForgotPassword(body);
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
| **forgotPasswordDto** | [ForgotPasswordDto](ForgotPasswordDto.md) |  | |

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
| **200** | Password reset successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerGetMqttToken

> MqttTokenResponseDto authControllerGetMqttToken()

Get MQTT authentication token

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerGetMqttTokenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  try {
    const data = await api.authControllerGetMqttToken();
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

[**MqttTokenResponseDto**](MqttTokenResponseDto.md)

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


## authControllerGetProfile

> ProfileResponseDto authControllerGetProfile()

Get user profile

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerGetProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  try {
    const data = await api.authControllerGetProfile();
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

[**ProfileResponseDto**](ProfileResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | User profile retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerGetSession

> SessionResponseDto authControllerGetSession()

Get current session state

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerGetSessionRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  try {
    const data = await api.authControllerGetSession();
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

[**SessionResponseDto**](SessionResponseDto.md)

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


## authControllerLogout

> authControllerLogout()

Logout user

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerLogoutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  try {
    const data = await api.authControllerLogout();
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
| **200** | User logged out successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## authControllerUpdateProfile

> UpdateProfileResponseDto authControllerUpdateProfile(updateProfileDto)

Update user profile

### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { AuthControllerUpdateProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // UpdateProfileDto
    updateProfileDto: ...,
  } satisfies AuthControllerUpdateProfileRequest;

  try {
    const data = await api.authControllerUpdateProfile(body);
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
| **updateProfileDto** | [UpdateProfileDto](UpdateProfileDto.md) |  | |

### Return type

[**UpdateProfileResponseDto**](UpdateProfileResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Profile updated successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## loginControllerLogin

> LoginResponseDto loginControllerLogin(loginDto)



### Example

```ts
import {
  Configuration,
  AuthApi,
} from '';
import type { LoginControllerLoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new AuthApi();

  const body = {
    // LoginDto
    loginDto: ...,
  } satisfies LoginControllerLoginRequest;

  try {
    const data = await api.loginControllerLogin(body);
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
| **loginDto** | [LoginDto](LoginDto.md) |  | |

### Return type

[**LoginResponseDto**](LoginResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

