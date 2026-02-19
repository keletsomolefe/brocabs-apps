import { Regular } from "@brocabs/ui/text";
import { MaterialIcons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { Container, Pressable, Row } from "@brocabs/ui/layout";
import { Input } from "@brocabs/ui/textfield/styles";
import { Colors } from "@brocabs/ui/theme/colors";
import { Icon, IconName } from "../icons";

export const TextField = forwardRef<TextInput, Props>(({ ...props }, ref) => {
  const {
    secureTextEntry,
    onBlur,
    onFocus,
    error,
    icon,
    rightIcon,
    iconColor,
    iconBackgroundColor,
    label,
    ...rest
  } = props;
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  let borderColor = error ? Colors["Secondary/600"] : Colors["Input Color"];

  const handleOnFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleOnBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  if (isFocused && !error) {
    borderColor = Colors["Primary/400"];
  }

  const renderLeftIcon = () => {
    if (!icon) return null;
    const color = iconColor ? Colors[iconColor] : Colors["Primary/400"];

    if (iconBackgroundColor) {
      return (
        <Container
          style={{ backgroundColor: Colors[iconBackgroundColor] }}
          width={40}
          height={40}
          borderRadius={20}
          justifyContent="center"
          alignItems="center">
          <Icon name={icon} width={20} height={20} color={color} />
        </Container>
      );
    }
    return <Icon name={icon} width={24} height={24} color={color} />;
  };

  return (
    <Row
      style={[
        styles.container,
        {
          borderColor,
          paddingHorizontal: iconBackgroundColor ? 6 : 12,
        },
      ]}>
      {renderLeftIcon()}
      {label ? (
        <Container flex={1} justifyContent="center" gap={0}>
          <Regular fontSize={10} color="Neutrals/500">
            {label}
          </Regular>
          <Input
            {...rest}
            ref={ref}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            secureTextEntry={isSecureTextEntry}
            style={{ height: 20, padding: 0, maxHeight: 25 }}
          />
        </Container>
      ) : (
        <Input
          {...rest}
          ref={ref}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          secureTextEntry={isSecureTextEntry}
        />
      )}
      {rightIcon && !secureTextEntry && (
        <Icon name={rightIcon} width={20} height={20} color={Colors["Primary/400"]} />
      )}
      {secureTextEntry && (
        <Pressable
          onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
          justifyContent="center"
          alignItems="center">
          {isSecureTextEntry ? (
            <MaterialIcons name="visibility-off" color={Colors["Primary/400"]} size={20} />
          ) : (
            <MaterialIcons name="visibility" color={Colors["Primary/400"]} size={20} />
          )}
        </Pressable>
      )}
    </Row>
  );
});

TextField.displayName = "TextField";

interface Props extends TextInputProps {
  error?: string;
  icon?: IconName;
  rightIcon?: IconName;
  iconColor?: keyof typeof Colors;
  iconBackgroundColor?: keyof typeof Colors;
  label?: string;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: Colors["Input Color"],
    height: 56,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
});
