import { Control, Controller, ControllerProps, FieldValues } from "react-hook-form";
import { StyleProp, ViewStyle } from "react-native";

import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { DropdownField, type Option } from "../dropdown";

/**
 * Renders a dropdown field component
 * @param props - dropdown field props
 */
export function FormDropdown<T extends FieldValues>(props: FormDropdownProps<T>) {
  const {
    label,
    placeholder,
    data,
    control,
    name,
    error,
    required,
    rules,
    disabled,
    rightIconColor,
    errorBorderOnly,
    style,
  } = props;

  return (
    <Container gap={8}>
      {label && (
        <Regular color="black-700" fontSize={18}>
          {label} {required && <Regular color="Secondary/600">*</Regular>}
        </Regular>
      )}
      <Controller
        control={control as Control<FieldValues>}
        name={name}
        rules={rules}
        render={({ field }) => (
          <DropdownField
            value={field.value}
            placeholder={placeholder}
            data={data}
            onChange={field.onChange}
            disabled={disabled}
            error={error}
            rightIconColor={rightIconColor}
            style={style}
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
interface FormDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  label?: string;
  placeholder: string;
  rightIconColor?: string;
  data: Option[];
  error?: string;
  required?: boolean;
  rules?: ControllerProps["rules"];
  disabled?: boolean;
  errorBorderOnly?: boolean;
  style?: StyleProp<ViewStyle>;
}
