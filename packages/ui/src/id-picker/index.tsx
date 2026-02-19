import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "@react-native-documents/picker";
import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "../button";
import { Container, Fill, Image, Row } from "../layout";
import { Backdrop } from "../sheet/backdrop";
import { Regular } from "../text";
import { Colors } from "../theme/colors";
import { FileType } from "../types";
import { Visible } from "../visible";

interface IDPickerProps {
  onChange: (file: FileType | null) => void;
  value: FileType | null;
  disabled?: boolean;
  error?: string;
  label?: string;
}

export function IDPicker({
  onChange,
  value,
  disabled,
  error,
  label = "National ID",
}: IDPickerProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

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
    let result = await ImagePicker.launchCameraAsync({
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

  const actions = [
    {
      label: "Take a photo",
      onPress: openCamera,
    },
    {
      label: "Choose from library",
      onPress: openLibrary,
    },
    {
      label: "Upload from file",
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
        px={16}
      >
        <Row alignItems="center" gap={10}>
          <Visible if={value?.filePath}>
            <Image
              source={value?.filePath}
              width={67}
              height={42}
              borderRadius={4}
            />
          </Visible>
          <Fill>
            <Regular fontSize={18} color="black">
              {label}
            </Regular>
            <Visible if={!value?.filePath}>
              <Regular fontSize={14} color="black-600">
                PNG, JPG or PDF up to 5MB
              </Regular>
            </Visible>
          </Fill>
          <Row alignItems="center" gap={8}>
            {!value?.filePath && (
              <Button
                label="Upload"
                variant="primary"
                radius="pill"
                size="sm"
                disabled={disabled}
                onPress={() => bottomSheetModalRef.current?.present()}
              />
            )}
            <Visible if={value?.filePath}>
              <Button
                label="Remove"
                variant="outline"
                radius="pill"
                size="sm"
                disabled={disabled}
                onPress={() => onChange?.(null)}
              />
            </Visible>
          </Row>
        </Row>
      </Container>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enablePanDownToClose
        enableDynamicSizing
        backgroundComponent={({
          animatedIndex,
          animatedPosition,
          ...props
        }) => (
          <Container
            backgroundColor="white"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            {...props}
          />
        )}
        handleIndicatorStyle={{ backgroundColor: Colors["black-200"] }}
        backdropComponent={Backdrop}
      >
        <BottomSheetView>
          <Container
            backgroundColor="white"
            pb={insets.bottom}
            pt={20}
            px={32}
            gap={20}
          >
            <Container gap={15}>
              {actions.map((action, index) => renderAction({ item: action }))}
            </Container>
            <Button
              onPress={() => bottomSheetModalRef.current?.close()}
              label="Cancel"
              variant="primary"
              radius="pill"
            />
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
