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
  TextInputProps,
} from "react-native";
import Animated from "react-native-reanimated";
import { useInstitutions } from "~/hooks/use-institutions";
import { useTranslation } from "~/i18n/LocaleContext";
import { type Option } from "~/shared/ui/dropdown";
import { Icon, IconName } from "~/shared/ui/icons";

const AnimatedRow = Animated.createAnimatedComponent(Row);
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_CONTENT_HEIGHT = SCREEN_HEIGHT * 0.9;

function SearchInput({ value, onChangeText, ...props }: TextInputProps) {
  const { t } = useTranslation();
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
        placeholder={t("common.searchInstitutions")}
        placeholderTextColor={Colors["Neutrals/400"]}
        clearButtonMode="while-editing"
      />
    </Row>
  );
}

interface InstituteSelectorProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  icon?: IconName;
}

export function InstituteSelector({
  value,
  placeholder = "Select Institute",
  onChange,
  error,
  disabled,
  icon,
}: InstituteSelectorProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSelecting, setIsSelecting] = useState(false);

  // Create scrollable component for FlashList
  const BottomSheetScrollable = useBottomSheetScrollableCreator();

  // Debounce the search query for API calls
  const setSearchDebounced = useMemo(
    () => debounce((text: string) => setDebouncedSearchQuery(text), 600),
    []
  );

  // Only pass debounced search query to hook if it's not empty, otherwise fetch all
  const { data: institutions, isLoading } = useInstitutions({
    q: debouncedSearchQuery.trim() || undefined,
    limit: 100, // Show all institutions
  });

  const options: Option[] = useMemo(() => {
    if (!institutions) return [];
    return institutions.map((inst) => ({
      label: inst.name,
      value: inst.id,
    }));
  }, [institutions]);

  const selectedInstitute = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value));
  }, [value, options]);

  const handleOnPress = (instituteValue: string | number) => {
    if (isSelecting) return;
    setIsSelecting(true);
    Keyboard.dismiss();
    const valueToSet = String(instituteValue);
    onChange(valueToSet);
    // Clear search and close after a short delay
    setTimeout(() => {
      setSearchQuery("");
      setIsSelecting(false);
      bottomSheetModalRef.current?.close();
    }, 150);
  };

  const onCloseInstitutePicker = () => {
    Keyboard.dismiss();
    // Reset search when closing
    setSearchQuery("");
    bottomSheetModalRef.current?.close();
  };

  const onOpenInstitutePicker = () => {
    if (disabled) return;
    Keyboard.dismiss();
    setIsSelecting(false);
    // Always reset search to show all items when opening
    setSearchQuery("");
    setDebouncedSearchQuery("");
    bottomSheetModalRef.current?.present();
  };

  const borderColor = error ? Colors["Secondary/600"] : Colors["Input Color"];
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: Option }) => {
    return (
      <RNPressable
        onPress={() => handleOnPress(item.value)}
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
      <Pressable onPress={onOpenInstitutePicker} disabled={disabled}>
        <Container style={[styles.instituteSelector, { borderColor }]}>
          {icon && (
            <Container
              style={styles.iconContainer}
              width={40}
              height={40}
              borderRadius={999}
              justifyContent="center"
              alignItems="center">
              <Icon name={icon} size={20} color={Colors.white} />
            </Container>
          )}
          <Regular
            flex={1}
            fontSize={16}
            color={selectedInstitute ? "Primary/400" : "Neutrals/400"}
            numberOfLines={1}>
            {selectedInstitute ? selectedInstitute.label : placeholder}
          </Regular>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors["Neutrals/400"]} />
        </Container>
      </Pressable>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={[MODAL_CONTENT_HEIGHT]}
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
                      // Update immediately for responsive input
                      setSearchQuery(text);
                      // Debounce for API call
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
                  onPress={onCloseInstitutePicker}>
                  <MaterialIcons name="close" size={18} color={Colors.white} />
                </Pressable>
              </Row>
            </Container>
            {isLoading ? (
              <Container height={SCREEN_HEIGHT * 0.8} pt={5} alignItems="center">
                <ActivityIndicator size="small" color={Colors["Primary/600"]} />
              </Container>
            ) : (
              <FlashList<Option>
                data={options}
                renderItem={renderItem}
                keyExtractor={(item: Option) => String(item.value)}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="none"
                contentContainerStyle={{ paddingBottom: 100, gap: 1, height: MODAL_CONTENT_HEIGHT }}
                renderScrollComponent={BottomSheetScrollable}
                ListEmptyComponent={
                  debouncedSearchQuery.trim() ? (
                    <Container height={MODAL_CONTENT_HEIGHT} pt={20} alignItems="center">
                      <Regular fontSize={16} color="Neutrals/400">
                        {t("broScholar.noResultsFor", { query: searchQuery })}
                      </Regular>
                    </Container>
                  ) : null
                }
              />
            )}
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
  instituteSelector: {
    borderRadius: 20,
    backgroundColor: Colors["Input Color"],
    paddingHorizontal: 6,
    height: 56,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  iconContainer: {
    backgroundColor: Colors["Primary/400"],
  },
  modalContent: {
    height: MODAL_CONTENT_HEIGHT,
  },
});
