import { MaterialIcons } from "@expo/vector-icons";
import { forwardRef, useState } from "react";
import { TextInput, TextInputProps } from "react-native";

import { Icon, IconName } from "../icons/icon";
import { Pressable, Row } from "../layout";
import { Colors } from "../theme/colors";
import { Input } from "./styles";

export const TextField = forwardRef<TextInput, Props>(({ ...props }, ref) => {
  const { secureTextEntry, onBlur, onFocus, error, icon, rightIcon, ...rest } =
    props;
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

  return (
    <Row
      borderRadius={10}
      backgroundColor="Input Color"
      px={2}
      height={50}
      borderWidth={1}
      borderColor={borderColor}
      alignItems="center"
      gap={10}
    >
      {icon && (
        <Icon
          name={icon}
          width={24}
          height={24}
          color={Colors["Primary/400"]}
        />
      )}
      <Input
        {...rest}
        ref={ref}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        secureTextEntry={isSecureTextEntry}
        placeholderTextColor={Colors["Neutrals/400"]}
      />
      {rightIcon && !secureTextEntry && (
        <Icon
          name={rightIcon}
          width={24}
          height={24}
          color={Colors["Primary/400"]}
        />
      )}
      {secureTextEntry && (
        <Pressable
          onPress={() => setIsSecureTextEntry(!isSecureTextEntry)}
          justifyContent="center"
          alignItems="center"
        >
          {isSecureTextEntry ? (
            <MaterialIcons
              name="visibility-off"
              color={Colors["Primary/400"]}
              size={20}
            />
          ) : (
            <MaterialIcons
              name="visibility"
              color={Colors["Primary/400"]}
              size={20}
            />
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
}
