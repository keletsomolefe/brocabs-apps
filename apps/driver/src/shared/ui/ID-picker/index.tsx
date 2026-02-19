import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "@react-native-documents/picker";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Column, Container, Fill, Image, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { FileType } from "~/constants";
import { launchCameraSafely, waitForCameraTransition } from "~/shared/lib/camera-permissions";
import { Icon } from "~/shared/ui/icons";

interface IDPickerProps {
  onChange: (file: FileType | null) => void;
  value: FileType | null;
  disabled?: boolean;
  error?: string;
  label?: string;
  hasDatePicker?: boolean;
  date?: Date | null;
  onDateChange?: (date: Date) => void;
}

export function IDPicker({
  onChange,
  value,
  disabled,
  error,
  label = "National ID",
  hasDatePicker = false,
  date,
  onDateChange,
}: IDPickerProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    onDateChange?.(selectedDate);
    hideDatePicker();
  };

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

  // Format date helper (simplified)
  const formatDate = (d?: Date | null) => {
    if (!d) return "DD/MM/YYYY";
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY format
  };

  const hasFile = !!value?.filePath;

  return (
    <>
      <Container
        p={16}
        borderRadius={20}
        gap={16}
        style={[
          styles.container,
          hasFile ? styles.containerFile : styles.containerEmpty,
          !!error && styles.containerError,
        ]}>
        <TouchableOpacity
          onPress={() => bottomSheetModalRef.current?.present()}
          activeOpacity={0.8}>
          <Row gap={12} alignItems="center">
            <Container
              width={56}
              height={56}
              borderRadius={hasFile ? 4 : 10}
              style={[
                styles.iconContainer,
                hasFile ? styles.iconContainerFile : styles.iconContainerEmpty,
              ]}
              alignItems="center"
              justifyContent="center">
              {value?.filePath ? (
                <Image source={value.filePath} style={{ width: 56, height: 56 }} />
              ) : (
                <Icon name="upload" size={24} color="white" />
              )}
            </Container>

            <Fill>
              <Column>
                <SemiBold fontSize={18} color="Primary/50" numberOfLines={1}>
                  {label}
                </SemiBold>
                <Regular fontSize={14} color="black-600">
                  {value?.fileName ? `File: ${value.fileName}` : "PNG, JPG or PDF up to 5MB"}
                </Regular>
              </Column>
            </Fill>
          </Row>
        </TouchableOpacity>

        {hasDatePicker && (
          <TouchableOpacity onPress={showDatePicker} activeOpacity={0.8}>
            <Container
              height={48}
              borderRadius={20}
              px={20}
              style={[
                styles.datePickerContainer,
                hasFile ? styles.datePickerContainerFile : styles.datePickerContainerEmpty,
              ]}
              justifyContent="center">
              <Row alignItems="center" gap={12}>
                <Icon name="calendar" size={24} color={Colors["Neutrals/600"]} />
                <Fill>
                  <Regular
                    fontSize={14}
                    color={hasFile ? "Primary/600" : date ? "Primary/50" : "Neutrals/600"}>
                    {formatDate(date)}
                  </Regular>
                </Fill>
                <Icon name="drop-down" size={24} color={Colors["Neutrals/600"]} />
              </Row>
            </Container>
          </TouchableOpacity>
        )}

        {hasFile && (
          <TouchableOpacity
            onPress={() => bottomSheetModalRef.current?.present()}
            activeOpacity={0.8}>
            <Container
              height={45}
              borderRadius={20}
              style={styles.replaceButton}
              alignItems="center"
              justifyContent="center">
              <SemiBold fontSize={16} color="Primary/600">
                Replace
              </SemiBold>
            </Container>
          </TouchableOpacity>
        )}
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
              label="Cancel"
              variant="primary"
              radius="pill"
            />
          </Container>
        </BottomSheetView>
      </BottomSheetModal>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={date || new Date()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  containerFile: {
    backgroundColor: Colors.white,
    borderColor: Colors["Primary/400"],
    borderStyle: "solid",
  },
  containerEmpty: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: Colors["Primary/300"],
    borderStyle: "dashed",
  },
  containerError: {
    borderColor: Colors["Secondary/600"],
  },
  iconContainer: {
    overflow: "hidden",
  },
  iconContainerFile: {
    backgroundColor: "transparent",
    borderColor: "#E5E5E5",
    borderWidth: 0.5,
  },
  iconContainerEmpty: {
    backgroundColor: Colors["Primary/400"],
    borderColor: "transparent",
    borderWidth: 0,
  },
  datePickerContainer: {},
  datePickerContainerFile: {
    backgroundColor: Colors["Primary/950"],
  },
  datePickerContainerEmpty: {
    backgroundColor: Colors["Input Color"],
  },
  replaceButton: {
    borderWidth: 1,
    borderColor: Colors["Primary/600"],
  },
});
