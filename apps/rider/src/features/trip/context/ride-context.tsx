import { zodResolver } from "@hookform/resolvers/zod";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { reverseGeocode } from "~/services/map";

import { PaymentMethodResponseDtoCodeEnum } from "@brocabs/client";
import { LocationData } from "@brocabs/ui/stores/location-store";
import { useActiveRide } from "../hooks/use-ride";
import { LocationPoint, useLocationStore } from "../stores/locationStore";

export { type LocationPoint };

const LocationPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});

export const RideFormDataSchema = z
  .object({
    pickup: LocationPointSchema.optional(),
    destination: LocationPointSchema.optional(),
    rideType: z.number().optional(),
    paymentMethod: z.enum(PaymentMethodResponseDtoCodeEnum),
  })
  .refine((data) => !!data.pickup, {
    message: "Pickup location is required",
    path: ["pickup"],
  })
  .refine((data) => !!data.destination, {
    message: "Destination is required",
    path: ["destination"],
  })
  .refine((data) => data.rideType !== undefined, {
    message: "Ride type is required",
    path: ["rideType"],
  });

export type RideFormData = z.infer<typeof RideFormDataSchema>;

interface RideContextType {
  form: UseFormReturn<RideFormData>;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export function RideProvider({ children }: { children: React.ReactNode }) {
  const form = useForm<RideFormData>({
    resolver: zodResolver(RideFormDataSchema),
    mode: "onChange",
    defaultValues: {
      paymentMethod: PaymentMethodResponseDtoCodeEnum.Wallet,
      pickup: undefined,
      destination: undefined,
      rideType: undefined,
    },
  });
  const initialLocationSet = useRef(false);
  const { refetch } = useActiveRide();

  useEffect(() => {
    const fetchAddress = async (location: LocationData | null) => {
      try {
        const { data: activeRide } = await refetch();

        if (location && !form.getValues("pickup") && !initialLocationSet.current && !activeRide) {
          initialLocationSet.current = true;
          try {
            const address = await reverseGeocode(location.latitude, location.longitude);
            form.setValue(
              "pickup",
              {
                latitude: location.latitude,
                longitude: location.longitude,
                address,
              },
              { shouldValidate: true }
            );
          } catch (error) {
            console.error("Failed to fetch address", error);
            form.setValue(
              "pickup",
              {
                latitude: location.latitude,
                longitude: location.longitude,
                address: "Current Location",
              },
              { shouldValidate: true }
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch active ride or address", error);
      }
    };
    const subscription = useLocationStore.subscribe((state, prevState) => {
      const location = state.location;
      if (location && location !== prevState.location) {
        fetchAddress(location).catch(console.error);
        subscription();
      }
    });

    return subscription;
  }, [form, refetch]);

  return <RideContext.Provider value={{ form }}>{children}</RideContext.Provider>;
}

export function useRideForm() {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error("useRide must be used within a RideProvider");
  }
  return context;
}
