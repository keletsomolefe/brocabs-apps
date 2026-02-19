# FilesApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**fileControllerGetUploadUrl**](FilesApi.md#filecontrollergetuploadurl) | **GET** /files/upload/{fileName} | Generate pre-signed upload URL |



## fileControllerGetUploadUrl

> UploadUrlResponseDto fileControllerGetUploadUrl(fileName, fileType)

Generate pre-signed upload URL

Generates a pre-signed PUT URL for uploading files to object storage based on the requested file type.

### Example

```ts
import {
  Configuration,
  FilesApi,
} from '';
import type { FileControllerGetUploadUrlRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FilesApi();

  const body = {
    // string | Original file name including extension.
    fileName: fileName_example,
    // 'AVATAR' | 'NATIONAL_ID' | 'DRIVER_LICENSE' | 'VEHICLE_REGISTRATION' | 'VEHICLE_INSURANCE' | 'SELFIE_WITH_ID' | 'STUDENT_FACE_IMAGE' | 'STUDENT_CARD' | 'SELFIE_WITH_STUDENT_CARD' | 'VEHICLE_EXTERIOR' | 'VEHICLE_INTERIOR' | Specifies the type of file being uploaded.
    fileType: fileType_example,
  } satisfies FileControllerGetUploadUrlRequest;

  try {
    const data = await api.fileControllerGetUploadUrl(body);
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
| **fileName** | `string` | Original file name including extension. | [Defaults to `undefined`] |
| **fileType** | `AVATAR`, `NATIONAL_ID`, `DRIVER_LICENSE`, `VEHICLE_REGISTRATION`, `VEHICLE_INSURANCE`, `SELFIE_WITH_ID`, `STUDENT_FACE_IMAGE`, `STUDENT_CARD`, `SELFIE_WITH_STUDENT_CARD`, `VEHICLE_EXTERIOR`, `VEHICLE_INTERIOR` | Specifies the type of file being uploaded. | [Defaults to `undefined`] [Enum: AVATAR, NATIONAL_ID, DRIVER_LICENSE, VEHICLE_REGISTRATION, VEHICLE_INSURANCE, SELFIE_WITH_ID, STUDENT_FACE_IMAGE, STUDENT_CARD, SELFIE_WITH_STUDENT_CARD, VEHICLE_EXTERIOR, VEHICLE_INTERIOR] |

### Return type

[**UploadUrlResponseDto**](UploadUrlResponseDto.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successfully generated upload instructions. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

