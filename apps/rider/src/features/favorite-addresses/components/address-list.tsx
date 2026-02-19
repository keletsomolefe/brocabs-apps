import { Button } from "@brocabs/ui/button";
import { Container, Divider, Fill, PressableScale, Row } from "@brocabs/ui/layout";
import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavoriteAddresses, useRemoveFavoriteAddress } from "~/hooks/use-favorite-addresses";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { DeleteAddressSheet } from "./delete-address-sheet";

export interface FavoriteAddress {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export function AddressList() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const deleteAddressSheetRef = useRef<BottomSheetModal>(null);

  const { data: addresses, isLoading } = useFavoriteAddresses();
  const { mutate: removeAddress } = useRemoveFavoriteAddress();

  const [selectedAddress, setSelectedAddress] = useState<{ id: string; label: string } | null>(
    null
  );

  const handleAddAddress = () => {
    router.push("/favorite-addresses/add");
  };

  const handleDeletePress = (e: any, address: FavoriteAddress) => {
    setSelectedAddress({ id: address.id, label: address.label });
    deleteAddressSheetRef.current?.present();
  };

  const handleDelete = () => {
    if (selectedAddress) {
      removeAddress(selectedAddress.id);
      deleteAddressSheetRef.current?.dismiss();
      setSelectedAddress(null);
    }
  };

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} pt={2} pb={Math.max(insets.bottom, 20)} gap={20}>
        {addresses && addresses.length > 0 ? (
          <Container backgroundColor="white" borderRadius={20} px={16} py={2}>
            {addresses.map((address, index) => (
              <Container key={address.id}>
                <Row alignItems="center" justifyContent="space-between" py={12}>
                  <Row alignItems="center" gap={12} flex={1}>
                    <Container
                      width={40}
                      height={40}
                      borderRadius={20}
                      backgroundColor="Primary/950"
                      alignItems="center"
                      justifyContent="center">
                      <MapPin width={20} height={20} color={Colors["Primary/600"]} />
                    </Container>
                    <Container flex={1}>
                      <Medium fontSize={16} color="Primary/50">
                        {address.label}
                      </Medium>
                      <Regular fontSize={12} color="Neutrals/500" numberOfLines={1}>
                        {address.address}
                      </Regular>
                    </Container>
                  </Row>
                  <PressableScale onPress={(e) => handleDeletePress(e, address)}>
                    <Container
                      width={40}
                      height={40}
                      borderRadius={12}
                      backgroundColor="Secondary/100"
                      alignItems="center"
                      justifyContent="center">
                      <Icon name="trash" width={18} height={18} color={Colors["Secondary/600"]} />
                    </Container>
                  </PressableScale>
                </Row>
                {index < addresses.length - 1 && <Divider backgroundColor="Neutrals/100" />}
              </Container>
            ))}
          </Container>
        ) : (
          <Container
            backgroundColor="white"
            borderRadius={20}
            px={20}
            py={40}
            alignItems="center"
            gap={12}>
            <Icon name="map-pin" width={48} height={48} color={Colors["Neutrals/400"]} />
            <Regular fontSize={16} color="Neutrals/500" textAlign="center">
              {t("addresses.noFavoriteAddresses")}
            </Regular>
            <Regular fontSize={14} color="Neutrals/400" textAlign="center">
              {t("common.addFavoriteDesc")}
            </Regular>
          </Container>
        )}

        <Button
          label={t("common.addNewAddress")}
          onPress={handleAddAddress}
          variant="primary"
          radius="rounded"
        />
      </Container>
      <DeleteAddressSheet
        ref={deleteAddressSheetRef}
        onDelete={handleDelete}
        addressLabel={selectedAddress?.label}
      />
    </Fill>
  );
}
