import { useEffect, useRef } from "react";
import { Control, Controller, ControllerProps, FieldValues } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

import { FormField } from "@brocabs/ui/form/form-field";
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
    iconColor,
    iconBackgroundColor,
    innerLabel,
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
    <FormField label={label} required={required} error={error} errorBorderOnly={errorBorderOnly}>
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
            placeholderTextColor={Colors["black-400"]}
            error={error}
            iconColor={iconColor}
            label={innerLabel}
            iconBackgroundColor={iconBackgroundColor}
          />
        )}
      />
    </FormField>
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
  iconColor?: keyof typeof Colors;
  iconBackgroundColor?: keyof typeof Colors;
  innerLabel?: string;
}
