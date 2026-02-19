import * as ImagePicker from "expo-image-picker";
import { Alert, InteractionManager, Linking } from "react-native";

const CAMERA_PERMISSION_TITLE = "Camera access required";
const CAMERA_PERMISSION_MESSAGE = "Enable camera access to take profile photos.";
const CAMERA_UNAVAILABLE_TITLE = "Unable to open camera";
const CAMERA_UNAVAILABLE_MESSAGE =
  "The camera is unavailable on this device right now. Please try again or choose an image from your library.";

const openAppSettings = async () => {
  try {
    await Linking.openSettings();
  } catch {
    Alert.alert("Open Settings", "Please open Settings and enable camera access for Bro.");
  }
};

const showCameraPermissionAlert = () => {
  Alert.alert(CAMERA_PERMISSION_TITLE, CAMERA_PERMISSION_MESSAGE, [
    { text: "Not now", style: "cancel" },
    { text: "Open Settings", onPress: () => void openAppSettings() },
  ]);
};

export async function ensureCameraPermission(): Promise<boolean> {
  try {
    const currentPermission = await ImagePicker.getCameraPermissionsAsync();

    if (currentPermission.granted) {
      return true;
    }

    if (currentPermission.status === "undetermined") {
      const requestedPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (requestedPermission.granted) {
        return true;
      }
    }

    showCameraPermissionAlert();
    return false;
  } catch (error) {
    console.warn("Failed to check camera permission", error);
    Alert.alert(CAMERA_UNAVAILABLE_TITLE, CAMERA_UNAVAILABLE_MESSAGE);
    return false;
  }
}

export async function waitForCameraTransition(): Promise<void> {
  await new Promise<void>((resolve) => {
    InteractionManager.runAfterInteractions(() => {
      // Allow the picker sheet close animation to finish before opening the camera UI.
      setTimeout(resolve, 180);
    });
  });
}

export async function launchCameraSafely(
  options: ImagePicker.ImagePickerOptions
): Promise<ImagePicker.ImagePickerResult | null> {
  const hasPermission = await ensureCameraPermission();
  if (!hasPermission) {
    return null;
  }

  try {
    return await ImagePicker.launchCameraAsync(options);
  } catch (error) {
    console.warn("Failed to launch camera", error);
    Alert.alert(CAMERA_UNAVAILABLE_TITLE, CAMERA_UNAVAILABLE_MESSAGE);
    return null;
  }
}
