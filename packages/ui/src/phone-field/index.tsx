import { Feather, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { forwardRef, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  InteractionManager,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";
import Animated from "react-native-reanimated";

import { PressableScale } from "pressto";
import { Icon, IconName } from "../icons/icon";
import { Container, Fill, Pressable, Row } from "../layout";
import { Backdrop } from "../sheet/backdrop";
import { Medium, SemiBold } from "../text";
import { Input } from "../textfield/styles";
import { Colors } from "../theme/colors";
import { FontFamily } from "../theme/fonts";
import { useShadow } from "../utils/shadow";
import { COUNTRY_CODES } from "./country-codes";
import { CountryItem } from "./types";

/**
 * Get country flag emoji from dial code
 */
const getFlagFromDialCode = (dialCode: string): string => {
  const country = COUNTRY_CODES.find((c) => c.dial_code === dialCode);
  return country?.flag || "🌍";
};

const AnimatedRow = Animated.createAnimatedComponent(Row);

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const MODAL_CONTENT_HEIGHT = SCREEN_HEIGHT * 0.9;

export const PhoneField = forwardRef<TextInput, Props>((props, ref) => {
  const {
    onBlur,
    onFocus,
    error,
    onCountryCodeChange,
    countryCode,
    value,
    rightIcon,
    showCountryCodeInSelection = true,
    editable = true,
    autoFocus,
    ...rest
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const isValid = !error && value && String(value).length > 0;
  let borderColor = error
    ? Colors["Secondary/600"]
    : isValid
    ? Colors["Success/300"]
    : Colors["Input Color"];
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const onSearch = (text: string) => setSearchQuery(text);

  const filteredCountries = useMemo(() => {
    return COUNTRY_CODES.filter((country) =>
      country.name.en.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleOnFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleOnBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleOnPress = (dialCode: string) => {
    Keyboard.dismiss();

    onCountryCodeChange(dialCode);

    InteractionManager.runAfterInteractions(() => {
      bottomSheetModalRef.current?.close();
    });
  };

  const renderItem = ({ item }: { item: CountryItem }) => {
    return (
      <Pressable onPress={() => handleOnPress(item.dial_code)}>
        <Row flex={1} backgroundColor="white">
          <AnimatedRow
            gap={10}
            flex={1}
            alignItems="center"
            px={3}
            py={2}
            borderRadius={10}
            mt={1}
          >
            <Text style={{ fontSize: 30 }}>{item.flag}</Text>
            <Medium color="black">({item.dial_code})</Medium>
            <Medium color="black" flex={1} fontSize={16}>
              {item.name.en}
            </Medium>
          </AnimatedRow>
          <Container width={40} justifyContent="center" alignItems="center">
            <Feather
              name="chevron-right"
              size={20}
              color={Colors["black-400"]}
            />
          </Container>
        </Row>
      </Pressable>
    );
  };

  const onCloseCountryPicker = () => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.close();
  };

  const onOpenCountryPicker = () => {
    if (!editable) return;
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  };

  if (isFocused && !error && !isValid) {
    borderColor = Colors["Primary/500"];
  }

  return (
    <>
      <Row gap={10} alignItems="center">
        <PressableScale onPress={onOpenCountryPicker} hitSlop={50}>
          <Row
            backgroundColor="Input Color"
            borderRadius={15}
            px={15}
            height={50}
            alignItems="center"
            borderWidth={2}
            gap={5}
            borderColor={Colors["white-100"]}
          >
            <Text style={{ fontSize: 24 }}>
              {getFlagFromDialCode(countryCode)}
            </Text>
            {showCountryCodeInSelection && (
              <SemiBold color="black" fontSize={16}>
                {countryCode}
              </SemiBold>
            )}
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color={Colors.black}
            />
          </Row>
        </PressableScale>
        <Row
          flex={1}
          borderRadius={15}
          backgroundColor="Input Color"
          px={2}
          height={50}
          borderColor={borderColor}
          borderWidth={1}
          alignItems="center"
        >
          <Input
            ref={ref}
            keyboardType="phone-pad"
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            clearButtonMode="while-editing"
            value={value}
            autoFocus={autoFocus}
            editable={editable}
            {...rest}
          />
          {rightIcon && (
            <Container mr={10}>
              <Icon
                name={rightIcon}
                width={24}
                height={24}
                color={Colors["Primary/400"]}
              />
            </Container>
          )}
        </Row>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          enableDynamicSizing={true}
          handleIndicatorStyle={{ backgroundColor: Colors["black-300"] }}
          backdropComponent={Backdrop}
          handleStyle={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          enablePanDownToClose
          onDismiss={() => setSearchQuery("")}
        >
          <BottomSheetView style={{ height: MODAL_CONTENT_HEIGHT }}>
            <Fill backgroundColor="Bg Color">
              <Container
                px={16}
                py={1}
                backgroundColor="white"
                borderBottomWidth={1}
                borderBottomColor={Colors["Input Color"]}
              >
                <Row height={64} alignItems="center" gap={10}>
                  <Fill>
                    <SearchInput
                      onChangeText={onSearch}
                      autoFocus
                      value={searchQuery}
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
                    onPress={onCloseCountryPicker}
                  >
                    <MaterialIcons
                      name="close"
                      size={18}
                      color={Colors.white}
                    />
                  </Pressable>
                </Row>
              </Container>
              <FlashList<CountryItem>
                data={filteredCountries}
                renderItem={renderItem}
                keyExtractor={(item) => item.code}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 100, gap: 1 }}
              />
            </Fill>
          </BottomSheetView>
        </BottomSheetModal>
      </Row>
    </>
  );
});

PhoneField.displayName = "PhoneField";

function SearchInput(props: TextInputProps) {
  const shadow = useShadow(1, "penumbra");

  return (
    <Row
      px={3}
      height={50}
      backgroundColor="Input Color"
      br={30}
      alignItems="center"
      gap={10}
      style={shadow}
    >
      <Feather name="search" size={20} color={Colors["Neutrals/400"]} />
      <TextInput
        {...props}
        style={stylesheet.input}
        placeholder="Search countries"
        placeholderTextColor={Colors["Neutrals/400"]}
        clearButtonMode="while-editing"
      />
    </Row>
  );
}

interface Props extends TextInputProps {
  error?: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  rightIcon?: IconName;
  showCountryCodeInSelection?: boolean;
}

const stylesheet = StyleSheet.create({
  input: {
    fontSize: 17,
    fontFamily: FontFamily.Regular,
    lineHeight: 22,
    letterSpacing: -0.4,
    color: Colors.black,
    flex: 1,
  },
});
