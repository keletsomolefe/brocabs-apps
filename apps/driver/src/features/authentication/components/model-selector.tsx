import { Container, Fill, Pressable, Row } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { FontFamily } from "@brocabs/ui/theme/fonts";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetScrollableCreator,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { debounce } from "lodash";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Pressable as RNPressable,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useVehicleModels } from "~/hooks/use-vehicles";

const AnimatedRow = Animated.createAnimatedComponent(Row);
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_CONTENT_HEIGHT = SCREEN_HEIGHT * 0.9;

interface Option {
  label: string;
  value: string;
}

function SearchInput({ value, onChangeText, ...props }: TextInputProps) {
  return (
    <Row
      px={12}
      height={50}
      backgroundColor="Input Color"
      borderRadius={30}
      alignItems="center"
      gap={10}>
      <Feather name="search" size={20} color={Colors["Neutrals/400"]} />
      <BottomSheetTextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        style={styles.searchInput}
        placeholder="Search models..."
        placeholderTextColor={Colors["Neutrals/400"]}
        clearButtonMode="while-editing"
      />
    </Row>
  );
}

interface ModelSelectorProps {
  value: string;
  makeId?: string;
  placeholder?: string;
  onChange: (value: string, label: string) => void;
  error?: string;
  disabled?: boolean;
}

export function ModelSelector({
  value,
  makeId,
  placeholder = "Model",
  onChange,
  error,
  disabled,
}: ModelSelectorProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);
  const insets = useSafeAreaInsets();

  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  const setSearchDebounced = useMemo(
    () => debounce((text: string) => setDebouncedSearchQuery(text), 600),
    []
  );

  const { data: modelsResponse, isLoading } = useVehicleModels(
    makeId,
    debouncedSearchQuery.trim() || undefined
  );

  const options: Option[] = useMemo(() => {
    if (!modelsResponse?.data) return [];
    return modelsResponse.data.map((model) => ({
      label: model.name,
      value: model.id,
    }));
  }, [modelsResponse]);

  const selectedModel = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [value, options]);

  const [selectedLabel, setSelectedLabel] = useState("");

  const handleOnPress = (item: Option) => {
    if (isSelecting) return;
    setIsSelecting(true);
    Keyboard.dismiss();
    setSelectedLabel(item.label);
    onChange(item.value, item.label);
    setTimeout(() => {
      setSearchQuery("");
      setIsSelecting(false);
      bottomSheetModalRef.current?.close();
    }, 150);
  };

  const onClose = () => {
    Keyboard.dismiss();
    setSearchQuery("");
    bottomSheetModalRef.current?.close();
  };

  const onOpen = () => {
    if (disabled || !makeId) return;
    Keyboard.dismiss();
    setIsSelecting(false);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    bottomSheetModalRef.current?.present();
  };

  const borderColor = error ? Colors["Secondary/600"] : Colors["Input Color"];
  const isDisabled = disabled || !makeId;
  const displayLabel = selectedModel?.label || selectedLabel;

  const renderItem = ({ item }: { item: Option }) => {
    return (
      <RNPressable
        onPress={() => handleOnPress(item)}
        disabled={isSelecting}
        style={({ pressed }) => ({
          opacity: pressed || isSelecting ? 0.7 : 1,
        })}>
        <Row
          flex={1}
          backgroundColor="white"
          borderBottomWidth={1}
          borderBottomColor={Colors["Neutrals/100"]}>
          <AnimatedRow
            gap={10}
            flex={1}
            alignItems="center"
            px={16}
            py={16}
            borderRadius={10}
            mt={1}>
            <Medium color="Primary/50" flex={1} fontSize={16}>
              {item.label}
            </Medium>
          </AnimatedRow>
          <Container width={40} justifyContent="center" alignItems="center">
            <Feather name="chevron-right" size={20} color={Colors["black-400"]} />
          </Container>
        </Row>
      </RNPressable>
    );
  };

  return (
    <>
      <Pressable onPress={onOpen} disabled={isDisabled}>
        <Container style={[styles.selector, { borderColor }, isDisabled && styles.disabled]}>
          <Regular
            flex={1}
            fontSize={16}
            color={displayLabel ? "Primary/400" : "Neutrals/400"}
            numberOfLines={1}>
            {displayLabel || placeholder}
          </Regular>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors["Neutrals/400"]} />
        </Container>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={[MODAL_CONTENT_HEIGHT]}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: Colors.white }}
        backdropComponent={Backdrop}
        enableHandlePanningGesture={false}
        enableContentPanningGesture={false}
        handleStyle={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        enablePanDownToClose
        keyboardBehavior="extend"
        keyboardBlurBehavior="none"
        onDismiss={() => {
          setSearchQuery("");
          setIsSelecting(false);
        }}>
        <BottomSheetView>
          <Fill backgroundColor="white">
            <Container
              px={16}
              pb={16}
              backgroundColor="white"
              borderBottomWidth={1}
              borderBottomColor={Colors["Input Color"]}>
              <Row height={64} alignItems="center" gap={10}>
                <Fill>
                  <SearchInput
                    value={searchQuery}
                    onChangeText={(text) => {
                      setSearchQuery(text);
                      setSearchDebounced(text);
                    }}
                    autoFocus
                  />
                </Fill>
                <Pressable
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  width={30}
                  height={30}
                  backgroundColor="Primary/500"
                  borderRadius={15}
                  alignItems="center"
                  justifyContent="center"
                  onPress={onClose}>
                  <MaterialIcons name="close" size={18} color={Colors.white} />
                </Pressable>
              </Row>
            </Container>
            <Container style={{ height: SCREEN_HEIGHT * 0.8 }}>
              {isLoading ? (
                <Container flex={1} pt={5} alignItems="center">
                  <ActivityIndicator size="small" color={Colors["Primary/600"]} />
                </Container>
              ) : (
                <FlashList<Option>
                  data={options}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.value}
                  keyboardShouldPersistTaps="handled"
                  keyboardDismissMode="none"
                  contentContainerStyle={{
                    paddingBottom: insets.bottom + 20,
                    gap: 1,
                  }}
                  renderScrollComponent={BottomSheetScrollable}
                  ListEmptyComponent={
                    debouncedSearchQuery.trim() ? (
                      <Container flex={1} pt={20} alignItems="center">
                        <Regular fontSize={16} color="Neutrals/400">
                          No models found for &ldquo;{searchQuery}&rdquo;
                        </Regular>
                      </Container>
                    ) : null
                  }
                />
              )}
            </Container>
          </Fill>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
    color: Colors["Primary/50"],
  },
  selector: {
    borderRadius: 10,
    backgroundColor: Colors["Input Color"],
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  disabled: {
    opacity: 0.5,
  },
});
