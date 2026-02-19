import { useEffect, useRef } from "react";
import { Control, Controller, ControllerProps, FieldValues } from "react-hook-form";
import { StyleProp, TextInput, TextInputProps, ViewStyle } from "react-native";

import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { IconName } from "../icons";
import { TextField } from "../textfield";

/**
 * Renders the text field component
 * @param props - text field props
 */
export function FormInput<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    control,
    rules,
    name,
    error,
    required,
    icon,
    rightIcon,
    errorBorderOnly,
    ...rest
  } = props;
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textFieldRef = useRef<TextInput>(null);

  useEffect(() => {
    timeout.current = setTimeout(() => {
      textFieldRef.current?.focus();
    }, 1000);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <Container gap={8}>
      {label && (
        <Regular color="black-700" fontSize={18}>
          {label} {required && <Regular color="Secondary/600">*</Regular>}
        </Regular>
      )}
      <Controller
        name={name}
        control={control as Control<FieldValues>}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            {...rest}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            icon={icon}
            rightIcon={rightIcon}
            placeholderTextColor={rest.placeholderTextColor || Colors["Neutrals/400"]}
            error={error}
          />
        )}
      />
      {error && !errorBorderOnly && (
        <Regular color="Secondary/600" fontSize={16}>
          {error}
        </Regular>
      )}
    </Container>
  );
}
/** Type definitions */
interface Props<T extends FieldValues> extends TextInputProps {
  required?: boolean;
  label?: string;
  placeholder?: string;
  name: string;
  icon?: IconName;
  rightIcon?: IconName;
  rules?: ControllerProps["rules"];
  control?: Control<T>;
  error?: string;
  errorBorderOnly?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}
