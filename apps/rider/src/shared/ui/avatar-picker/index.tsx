import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { PressableScale } from "pressto";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Container, Image } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Visible } from "@brocabs/ui/visible";
import { FileType } from "~/constants";
import { useTranslation } from "~/i18n/LocaleContext";
import { launchCameraSafely, waitForCameraTransition } from "~/shared/lib/camera-permissions";
import { Icon } from "~/shared/ui/icons";

interface AvatarPickerProps {
  value: FileType | null;
  onChange: (file: FileType) => void;
  disabled?: boolean;
}

export function AvatarPicker({ value, onChange, disabled }: AvatarPickerProps) {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const openLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileName = asset.fileName ?? asset.uri.split("/").pop() ?? "";
      onChange?.({ fileName, filePath: result.assets[0].uri });
    }
    bottomSheetModalRef.current?.close();
  };

  const openCamera = async () => {
    bottomSheetModalRef.current?.close();
    await waitForCameraTransition();

    const result = await launchCameraSafely({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result && !result.canceled) {
      const asset = result.assets[0];
      const fileName = asset.fileName ?? asset.uri.split("/").pop() ?? "";
      onChange?.({ fileName, filePath: result.assets[0].uri });
    }
  };

  const actions = [
    {
      label: t("common.takePhoto"),
      onPress: openCamera,
    },
    {
      label: t("common.chooseFromLibrary"),
      onPress: openLibrary,
    },
  ];

  const renderAction = ({ item }: { item: (typeof actions)[number] }) => {
    return (
      <Button
        key={item.label}
        onPress={item.onPress}
        label={item.label}
        variant="outline"
        textWeight="normal"
        radius="rounded"
        disabled={disabled}
      />
    );
  };

  return (
    <>
      <PressableScale enabled={!disabled} onPress={() => bottomSheetModalRef.current?.present()}>
        <Container
          width={120}
          height={120}
          borderRadius={60}
          backgroundColor={value?.filePath ? undefined : "Primary/950"}
          alignItems="center"
          justifyContent="center">
          <Visible if={!value?.filePath}>
            <Icon name="profile-fill" width={72} height={72} color={Colors["Primary/400"]} />
          </Visible>
          <Visible if={value?.filePath}>
            <Image source={value?.filePath} width={120} height={120} borderRadius={60} />
          </Visible>
          <EditButton />
        </Container>
      </PressableScale>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enablePanDownToClose
        enableDynamicSizing
        backgroundComponent={({ animatedIndex, animatedPosition, ...props }) => (
          <Container
            backgroundColor="white"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            {...props}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: Colors["black-200"] }}
        backdropComponent={Backdrop}>
        <BottomSheetView>
          <Container backgroundColor="white" pb={insets.bottom} pt={20} px={32} gap={20}>
            <Container gap={15}>
              {actions.map((action, index) => renderAction({ item: action }))}
            </Container>
            <Button
              onPress={() => bottomSheetModalRef.current?.close()}
              label={t("common.cancel")}
              variant="primary"
              radius="pill"
            />
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const EditButton = () => (
  <Container
    position="absolute"
    bottom={1}
    right={1}
    width={24}
    height={24}
    backgroundColor="Primary/400"
    borderRadius={6}
    alignItems="center"
    justifyContent="center">
    <Icon name="edit-fill" width={14} height={14} color={Colors.white} />
  </Container>
);
