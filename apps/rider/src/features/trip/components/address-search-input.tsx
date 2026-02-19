import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { X } from "lucide-react-native";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";

import { Container, Fill, Pressable, Row } from "@brocabs/ui/layout";
import { Input } from "@brocabs/ui/textfield/styles";
import { Icon, IconName } from "~/shared/ui/icons";
import { useTranslation } from "~/i18n/LocaleContext";

export const AddressSearchInput = forwardRef<TextInput, AddressSearchInputProps>((props, ref) => {
  const { t } = useTranslation();
  const {
    icon,
    placeholder,
    value,
    label,
    onChange,
    onClear,
    onFocus,
    isActive: isActiveProp,
    onMapPress,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => inputRef.current as TextInput);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    props.onBlur?.();
  };

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const isActive = isActiveProp || isFocused;
  const showMapButton = (isActiveProp || isFocused) && onMapPress;
  const showClearButton = value.length > 0;
  const showActions = showMapButton || showClearButton;

  return (
    <Pressable
      flexDirection="row"
      backgroundColor="Bg Color"
      borderWidth={1}
      borderColor={isActive ? Colors["Primary/600"] : Colors["Input Color"]}
      borderRadius={30}
      height={60}
      alignItems="center"
      gap={10}
      onPress={handlePress}
      style={{ padding: 10 }}>
      <Container
        width={40}
        height={40}
        backgroundColor={isActive ? "Primary/600" : "Neutrals/100"}
        borderRadius={20}
        justifyContent="center"
        alignItems="center">
        <Icon
          name={icon}
          width={20}
          height={20}
          color={isActive ? Colors.white : Colors["Neutrals/400"]}
        />
      </Container>
      <Fill gap={2} justifyContent="center">
        <Regular color="Neutrals/500" fontSize={10} lineHeight={16}>
          {label}
        </Regular>
        <Input
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors["Neutrals/500"]}
          style={{
            fontSize: 14,
            lineHeight: 16,
            color: Colors.black,
            padding: 0,
          }}
        />
      </Fill>
      {showActions && (
        <Row alignItems="center" gap={10}>
          {showClearButton && (
            <Pressable
              width={20}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
              onPress={(e) => {
                e.stopPropagation();
                onClear();
              }}>
              <X color={Colors["Neutrals/500"]} size={20} />
            </Pressable>
          )}
          {showMapButton && (
            <Pressable
              style={styles.mapButton}
              onPress={(e) => {
                e.stopPropagation();
                onMapPress && onMapPress();
              }}>
              <Regular style={styles.mapButtonText}>{t("common.map")}</Regular>
            </Pressable>
          )}
        </Row>
      )}
    </Pressable>
  );
});

AddressSearchInput.displayName = "AddressSearchInput";

const styles = StyleSheet.create({
  mapButton: {
    backgroundColor: Colors["Primary/600"],
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 40,
  },
  mapButtonText: {
    color: Colors.white,
  },
});

interface AddressSearchInputProps {
  icon: IconName;
  label: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isActive?: boolean;
  onMapPress?: () => void;
}
