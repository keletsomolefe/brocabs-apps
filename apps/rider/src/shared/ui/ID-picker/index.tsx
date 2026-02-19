import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "@react-native-documents/picker";
import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button, ButtonProps } from "@brocabs/ui/button";
import { Container, Fill, Image, Row } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Regular } from "@brocabs/ui/text";
import { Visible } from "@brocabs/ui/visible";
import { FileType } from "~/constants";
import { useTranslation } from "~/i18n/LocaleContext";
import { launchCameraSafely, waitForCameraTransition } from "~/shared/lib/camera-permissions";

interface IDPickerProps {
  onChange: (file: FileType | null) => void;
  value: FileType | null;
  disabled?: boolean;
  error?: string;
  label?: string;
  description?: string;
  buttonLabel?: string;
  uploadButtonProps?: Partial<ButtonProps>;
}

export function IDPicker({
  onChange,
  value,
  disabled,
  error,
  label,
  description,
  buttonLabel,
  uploadButtonProps,
}: IDPickerProps) {
  const { t } = useTranslation();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const displayLabel = label ?? t("common.nationalID");
  const displayDescription = description ?? t("common.uploadDesc");
  const displayButtonLabel = buttonLabel ?? t("common.upload");

  const onChooseDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: ["image/jpeg", "image/png", "application/pdf"],
      });
      if (result && result.length > 0) {
        const asset = result[0];
        const fileName = asset.name ?? asset.uri.split("/").pop() ?? "";
        onChange?.({ filePath: result[0].uri, fileName });
      }
    } catch {
      // User cancelled the picker
    }
    bottomSheetModalRef.current?.close();
  };

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
    {
      label: t("common.uploadFromFile"),
      onPress: onChooseDocument,
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
      />
    );
  };

  return (
    <>
      <Container
        py={24}
        borderRadius={20}
        borderWidth={1}
        borderColor={error ? Colors["Secondary/600"] : "black-200"}
        backgroundColor={value?.filePath ? "white" : "transparent"}
        borderStyle={value?.filePath ? "solid" : "dashed"}
        alignItems="center"
        px={16}>
        <Row alignItems="center" gap={10}>
          <Visible if={value?.filePath}>
            <Image source={value?.filePath} width={67} height={42} borderRadius={4} />
          </Visible>
          <Fill gap={10}>
            <Regular fontSize={16} color="Neutrals/400">
              {displayLabel}
            </Regular>
            <Visible if={!value?.filePath}>
              <Regular fontSize={14} color="black-600">
                {displayDescription}
              </Regular>
            </Visible>
          </Fill>
          <Row alignItems="center" gap={8}>
            {!value?.filePath && (
              <Button
                label={displayButtonLabel}
                variant="primary"
                radius="pill"
                size="sm"
                disabled={disabled}
                onPress={() => bottomSheetModalRef.current?.present()}
                {...uploadButtonProps}
              />
            )}
            <Visible if={value?.filePath}>
              <Button
                label={t("common.remove")}
                variant="outline"
                radius="pill"
                size="sm"
                disabled={disabled}
                onPress={() => onChange?.(null)}
                {...uploadButtonProps}
                backgroundColor="white"
                borderColor={Colors["Primary/400"]}
              />
            </Visible>
          </Row>
        </Row>
      </Container>
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
