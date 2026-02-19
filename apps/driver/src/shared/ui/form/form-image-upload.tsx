import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "@react-native-documents/picker";
import * as ImagePicker from "expo-image-picker";
import { useRef } from "react";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@brocabs/ui/button";
import { Container, Image, Row } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular } from "@brocabs/ui/text";
import { FileType } from "~/constants";
import { launchCameraSafely, waitForCameraTransition } from "~/shared/lib/camera-permissions";
import { Icon } from "~/shared/ui/icons";

interface ImageUploadProps {
  label: string;
  highlightText?: string;
  instructions: string;
  value: FileType[] | null;
  onChange: (files: FileType[] | null) => void;
  disabled?: boolean;
  error?: string;
  errorBorderOnly?: boolean;
  allowMultiple?: boolean;
}

export function FormImageUpload({
  label,
  highlightText,
  instructions,
  value,
  onChange,
  disabled,
  error,
  errorBorderOnly,
  allowMultiple = true,
}: ImageUploadProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const onChooseDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: ["image/jpeg", "image/png", "application/pdf"],
        allowMultiSelection: allowMultiple,
      });
      if (result && result.length > 0) {
        const newFiles = result.map((asset) => ({
          fileName: asset.name ?? asset.uri.split("/").pop() ?? "",
          filePath: asset.uri,
        }));
        if (allowMultiple && value && value.length > 0) {
          onChange([...value, ...newFiles]);
        } else {
          onChange(newFiles);
        }
      }
    } catch {
      // User cancelled the picker
    }
    bottomSheetModalRef.current?.close();
  };

  const openLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      allowsMultipleSelection: allowMultiple,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const newFiles = result.assets.map((asset) => ({
        fileName: asset.fileName ?? asset.uri.split("/").pop() ?? "",
        filePath: asset.uri,
      }));
      if (allowMultiple && value && value.length > 0) {
        onChange([...value, ...newFiles]);
      } else {
        onChange(newFiles);
      }
    }
    bottomSheetModalRef.current?.close();
  };

  const openCamera = async () => {
    bottomSheetModalRef.current?.close();
    await waitForCameraTransition();

    const result = await launchCameraSafely({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });

    if (result && !result.canceled && result.assets.length > 0) {
      const newFile = {
        fileName: result.assets[0].fileName ?? result.assets[0].uri.split("/").pop() ?? "",
        filePath: result.assets[0].uri,
      };
      const existingFiles = value || [];
      onChange([...existingFiles, newFile]);
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

  const hasFiles = value && value.length > 0;

  return (
    <>
      <Container gap={8}>
        <Pressable
          disabled={disabled}
          onPress={() => bottomSheetModalRef.current?.present()}
          style={{ opacity: disabled ? 0.5 : 1 }}>
          <Container
            py={32}
            px={20}
            borderRadius={20}
            borderWidth={1}
            borderColor={
              error && !errorBorderOnly ? Colors["Secondary/600"] : Colors["Primary/400"]
            }
            backgroundColor={hasFiles ? "white" : "transparent"}
            borderStyle="dashed"
            alignItems="center"
            gap={16}>
            <Icon
              name="upload"
              width={35}
              height={35}
              color={hasFiles ? Colors["Primary/400"] : Colors["Primary/400"]}
            />
            <Container gap={8} alignItems="center">
              <Regular fontSize={16} color="Primary/50" center>
                Upload your car&apos;s{" "}
                {highlightText ? (
                  <>
                    <Bold fontSize={16} color="Primary/400">
                      {highlightText}
                    </Bold>{" "}
                    images
                  </>
                ) : (
                  label
                )}
              </Regular>
              <Regular fontSize={12} color="Neutrals/600" center>
                {instructions}
              </Regular>
              <Regular fontSize={12} color="Neutrals/600" center>
                PNG, JPG or PDF up to 100MB
              </Regular>
            </Container>
            {hasFiles && (
              <Row gap={8} flexWrap="wrap" justifyContent="center">
                {value.map((file, index) => (
                  <Container key={index} position="relative">
                    <Image
                      source={{ uri: file.filePath }}
                      width={60}
                      height={60}
                      borderRadius={8}
                      style={{ opacity: file.status === "uploading" ? 0.7 : 1 }}
                    />
                    {file.status === "uploading" && (
                      <Container
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        alignItems="center"
                        justifyContent="center"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <Bold color="white" fontSize={12}>
                          {Math.round(file.progress || 0)}%
                        </Bold>
                      </Container>
                    )}
                    {file.status === "error" && (
                      <Container
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        borderRadius={8}
                        alignItems="center"
                        justifyContent="center"
                        style={{ backgroundColor: "rgba(255, 0, 0, 0.3)" }}>
                        <Bold color="white" fontSize={20}>
                          !
                        </Bold>
                      </Container>
                    )}
                    <Pressable
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: Colors["Secondary/600"],
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        const newFiles = value.filter((_, i) => i !== index);
                        onChange(newFiles.length > 0 ? newFiles : null);
                      }}>
                      <Icon name="cross" width={12} height={12} color="white" />
                    </Pressable>
                  </Container>
                ))}
              </Row>
            )}
          </Container>
        </Pressable>
        {error && !errorBorderOnly && (
          <Regular color="Secondary/600" fontSize={16}>
            {error}
          </Regular>
        )}
      </Container>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enablePanDownToClose
        enableDismissOnClose
        enableDynamicSizing
        backdropComponent={Backdrop}>
        <BottomSheetView style={{ paddingBottom: insets.bottom + 15 }}>
          <Container px={20} pt={20} gap={16}>
            {actions.map((action) => (
              <Button
                key={action.label}
                onPress={action.onPress}
                label={action.label}
                variant="outline"
                textWeight="normal"
                radius="rounded"
                disabled={disabled}
              />
            ))}
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}
