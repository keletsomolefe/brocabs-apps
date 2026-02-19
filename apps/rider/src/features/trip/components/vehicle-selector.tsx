import {
  RideQuotePriceResponseDto,
  RideQuoteResponseDto,
  RideTypeResponseDtoCodeEnum,
} from "@brocabs/client";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWatch } from "react-hook-form";
import { ListRenderItemInfo, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

import { Container, Image, TouchableOpacity } from "@brocabs/ui/layout";
import { AssetFiles } from "@brocabs/ui/theme/assets";
import { useRideForm } from "~/features/trip/context/ride-context";
import { Icon } from "~/shared/ui/icons";

export const RideIcons: Record<RideTypeResponseDtoCodeEnum, number> = {
  [RideTypeResponseDtoCodeEnum.LittleBro]: AssetFiles.images["car-medium-white"],
  [RideTypeResponseDtoCodeEnum.BigBroPlus]: AssetFiles.images["car-big-bro-plus-white"],
  [RideTypeResponseDtoCodeEnum.SuperBro]: AssetFiles.images["car-super-bro-white"],
  [RideTypeResponseDtoCodeEnum.BigBro]: AssetFiles.images["car-big-bro-white"],
  [RideTypeResponseDtoCodeEnum.BroScholar]: AssetFiles.images["car-big-bro-scholar-white"],
  [RideTypeResponseDtoCodeEnum.BroFam]: AssetFiles.images["car-bro-fam-white"],
};

interface VehicleSelectorProps {
  loading?: boolean;
  quote?: RideQuoteResponseDto | undefined;
}

export function VehicleSelector(props: VehicleSelectorProps) {
  const { loading, quote } = props;
  const { form } = useRideForm();

  const prices = useMemo(() => quote?.prices || [], [quote]);
  const selectedRideId = useWatch({ control: form.control, name: "rideType" });
  const flatListRef = useRef<FlatList<RideQuotePriceResponseDto>>(null);

  useEffect(() => {
    if (prices.length > 0 && (!selectedRideId || selectedRideId === -1)) {
      form.setValue("rideType", prices[0].rideTypeId, { shouldValidate: true });
      form.trigger();
    }
  }, [prices, selectedRideId, form]);

  const currentIndex = useMemo(() => {
    return prices.findIndex((vehicle) => vehicle.rideTypeId === selectedRideId);
  }, [prices, selectedRideId]);

  useEffect(() => {
    if (currentIndex >= 0 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [currentIndex]);

  const handleSelectVehicle = useCallback(
    (vehicleId: number) => {
      form.setValue("rideType", vehicleId, { shouldValidate: true });
    },
    [form]
  );

  if (loading) {
    return <VehicleSelectorSkeleton />;
  }

  if (!quote) {
    return null;
  }

  const renderItem = ({ item }: ListRenderItemInfo<RideQuotePriceResponseDto>) => {
    return (
      <VehicleSelectorItem
        vehicle={item}
        isSelected={selectedRideId === item.rideTypeId}
        onSelect={() => handleSelectVehicle(item.rideTypeId)}
      />
    );
  };

  return (
    <Container backgroundColor="white" borderRadius={20} pt={15} pb={3} gap={10}>
      <Container px={15}>
        <SemiBold color="black" fontSize={14}>
          Select Vehicle
        </SemiBold>
      </Container>

      <FlatList
        ref={flatListRef}
        data={prices}
        extraData={selectedRideId}
        renderItem={renderItem}
        horizontal
        keyExtractor={(item) => item.rideTypeId.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10, paddingRight: 10 }}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewPosition: 0.5,
            });
          });
        }}
      />
    </Container>
  );
}

function VehicleSelectorItem({ vehicle, isSelected, onSelect }: VehicleSelectorItemProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onSelect}>
      <Container
        style={[
          styles.itemContainer,
          {
            borderColor: isSelected ? Colors["Primary/600"] : "transparent",
          },
        ]}>
        <Container style={styles.priceContainer}>
          <Regular color="white" fontSize={12} lineHeight={16} center>
            R{Math.round(vehicle.estimatedPrice)}
          </Regular>
        </Container>
        <Image
          source={RideIcons[vehicle.rideTypeCode as RideTypeResponseDtoCodeEnum]}
          width={75}
          height={56}
          contentFit="contain"
          style={{ alignSelf: "center" }}
        />
        <Medium color="black" fontSize={12} lineHeight={16} numberOfLines={1} adjustsFontSizeToFit>
          {vehicle.rideTypeName}
        </Medium>
        <Container style={styles.timeContainer}>
          <Regular color="white" fontSize={10} lineHeight={14}>
            8 Min
          </Regular>
        </Container>
      </Container>
    </TouchableOpacity>
  );
}

interface VehicleSelectorItemProps {
  vehicle: RideQuotePriceResponseDto;
  isSelected: boolean;
  onSelect: () => void;
}

export function VehicleSelectorSkeleton() {
  return (
    <Container px={15} backgroundColor="white" borderRadius={20} pt={15} pb={3} gap={10}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={100} height={14} borderRadius={4} />
      </SkeletonPlaceholder>

      <FlatList
        data={[1, 2, 3, 4]}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        keyExtractor={(item) => item.toString()}
        renderItem={() => (
          <Container style={styles.skeletonItemContainer}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={76} height={26} borderRadius={20} />
            </SkeletonPlaceholder>
            <Container alignSelf="center">
              <Icon name="car-skeleton" width={75} height={56} color="#E1E9EE" />
            </Container>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={60} height={16} borderRadius={4} />
              <SkeletonPlaceholder.Item width={50} height={20} borderRadius={20} marginTop={5} />
            </SkeletonPlaceholder>
          </Container>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: 96,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
    alignItems: "flex-start",
  },
  priceContainer: {
    backgroundColor: Colors["Secondary/600"],
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    alignItems: "center",
  },
  timeContainer: {
    backgroundColor: Colors["Primary/600"],
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  skeletonItemContainer: {
    width: 96,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    alignItems: "flex-start",
  },
});
