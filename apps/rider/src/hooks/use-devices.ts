import { PingDeviceDto, RefreshDeviceTokenDto, RegisterDeviceDto } from "@brocabs/client";
import { useMutation } from "@tanstack/react-query";
import { devicesApi } from "~/api";

export function useDevicePing() {
  return useMutation({
    mutationFn: async (data: PingDeviceDto) => {
      return await devicesApi.devicesControllerPing({
        pingDeviceDto: data,
      });
    },
  });
}

export function useDeviceRefreshToken() {
  return useMutation({
    mutationFn: async (data: RefreshDeviceTokenDto) => {
      return await devicesApi.devicesControllerRefreshToken({
        refreshDeviceTokenDto: data,
      });
    },
  });
}

export function useDeviceRegister() {
  return useMutation({
    mutationFn: async (data: RegisterDeviceDto) => {
      return await devicesApi.devicesControllerRegisterDevice({
        registerDeviceDto: data,
      });
    },
  });
}
