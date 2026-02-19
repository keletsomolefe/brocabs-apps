import BackgroundGeolocation, {
  DesiredAccuracy,
  LogLevel,
  type LocationError,
  type Subscription,
  type Location,
} from "react-native-background-geolocation";
import { Platform } from "react-native";

export interface LatLng {
  latitude: number;
  longitude: number;
  mocked: boolean;
}

export interface CurrentLocation {
  location: LatLng;
}

const PERMISSION_STATUS = {
  AUTHORIZED: 3,
  ACCURACY_AUTHORIZED: 0,
} as const;

interface PermissionResult {
  granted: boolean;
  status: number;
  fineLocationEnabled: boolean | null;
  error?: string;
}

class LocationService {
  private static instance: LocationService | null = null;

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Request location permissions with platform-specific handling
   */
  public requestPermissions = async (): Promise<PermissionResult> => {
    try {
      const basePermissionStatus = await this.requestBasePermission();

      if (!basePermissionStatus.granted) {
        return basePermissionStatus;
      }

      const fineLocationResult = await this.handlePlatformSpecificPermissions(
        basePermissionStatus.status
      );

      return {
        granted: fineLocationResult.granted,
        status: basePermissionStatus.status,
        fineLocationEnabled: fineLocationResult.fineLocationEnabled,
        error: undefined,
      };
    } catch (error: unknown) {
      return {
        granted: false,
        status: -1,
        fineLocationEnabled: null,
        error: error instanceof Error ? error.message : "Unknown permission error",
      };
    }
  };

  public getInitialPosition = async (): Promise<{ location: LatLng }> => {
    const location: Location = await BackgroundGeolocation.getCurrentPosition({
      persist: true,
      samples: 1,
      timeout: 30,
      maximumAge: 1000000,
      extras: {
        getCurrentPosition: true,
      },
    });

    return {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        mocked: location.mock || false,
      },
    };
  };

  public startWatching = (
    callback: (location: CurrentLocation) => void,
    errorCallback?: (errorCode: number) => void
  ): Subscription => {
    return BackgroundGeolocation.watchPosition(
      {},
      (location: Location) => {
        const currentLocation: CurrentLocation = {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            mocked: location.mock ?? false,
          },
        };
        callback(currentLocation);
      },
      errorCallback
    );
  };

  public stopWatching = () => {
    BackgroundGeolocation.stopWatchPosition?.();
  };

  public stopGpsTracking = async () => {
    await BackgroundGeolocation.stop();
  };

  public startGpsTracking = async () => {
    const state = await BackgroundGeolocation.getState();
    if (state.enabled === true) {
      await BackgroundGeolocation.stop();
    }

    await BackgroundGeolocation.start();
    await BackgroundGeolocation.changePace(true);
  };

  public onLocationChange = (
    callback: (location: CurrentLocation) => void,
    errorCallback: (error: LocationError) => void
  ): Subscription => {
    return BackgroundGeolocation.onLocation(
      (location: Location) => {
        const currentLocation: CurrentLocation = {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            mocked: location.mock ?? false,
          },
        };
        callback(currentLocation);
      },
      errorCallback
    );
  };

  public sync = async () => {
    await BackgroundGeolocation.sync();
  };

  public initialize = async () => {
    await BackgroundGeolocation.ready({
      reset: true,
      logger: {
        debug: false,
        logLevel: LogLevel.Off,
      },
      geolocation: {
        desiredAccuracy: DesiredAccuracy.Navigation,
        distanceFilter: Platform.OS === "android" ? 0 : 5,
        locationUpdateInterval: 1000,
        fastestLocationUpdateInterval: 10000,
        locationAuthorizationRequest: "Always",
        disableLocationAuthorizationAlert: true,
        disableElasticity: false,
        showsBackgroundLocationIndicator: true,
        stopOnStationary: false,
        pausesLocationUpdatesAutomatically: false,
      },
      activity: {
        disableMotionActivityUpdates: false,
      },
      app: {
        enableHeadless: true,
        preventSuspend: true,
        heartbeatInterval: 60,
        stopOnTerminate: Platform.select({ default: true, android: false }),
        backgroundPermissionRationale: {
          title: "Allow access to this device's location in the background",
          message:
            'In order to track your location while driving, please enable "Allow all the time" location permission',
        },
      },
      persistence: {
        maxDaysToPersist: 14,
      },
    });
  };

  /**
   * Request base location permission
   */
  private requestBasePermission = async (): Promise<PermissionResult> => {
    const status = await BackgroundGeolocation.requestPermission();

    return {
      granted: status === PERMISSION_STATUS.AUTHORIZED,
      status,
      fineLocationEnabled: null,
    };
  };

  /**
   * Handle platform-specific location permission requirements
   */
  private handlePlatformSpecificPermissions = async (
    _status: number
  ): Promise<Pick<PermissionResult, "granted" | "fineLocationEnabled">> => {
    if (Platform.OS === "ios") {
      return this.handleIosPermissions();
    }

    // Default for other platforms (Android permissions handled by the plugin)
    return { granted: true, fineLocationEnabled: true };
  };

  /**
   * Handle iOS-specific location permissions
   */
  private handleIosPermissions = async (): Promise<
    Pick<PermissionResult, "granted" | "fineLocationEnabled">
  > => {
    try {
      const accuracy = await BackgroundGeolocation.requestTemporaryFullAccuracy("Navigation");
      const isAccuracyGranted = accuracy === PERMISSION_STATUS.ACCURACY_AUTHORIZED;

      return {
        granted: isAccuracyGranted,
        fineLocationEnabled: isAccuracyGranted,
      };
    } catch (error: unknown) {
      throw new Error(
        `iOS accuracy permission failed: ${error instanceof Error ? error.message : error}`
      );
    }
  };
}

export const locationService = LocationService.getInstance();
