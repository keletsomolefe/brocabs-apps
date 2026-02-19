import { forwardRef, useImperativeHandle, useRef } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

import { IconName } from "../icons/icon";
import { TextField } from "../textfield";
import { FormField } from "./form-field";

interface Props<T extends FieldValues>
  extends Omit<TextInputProps, "value" | "onChangeText" | "onBlur"> {
  label?: string;
  control: Control<T, any>;
  rules?: any;
  name: Path<T>;
  error?: string;
  required?: boolean;
  icon?: IconName;
  rightIcon?: IconName;
  errorBorderOnly?: boolean;
}

export interface FormInputHandle {
  focus: () => void;
  blur: () => void;
}

const FormInputInner = <T extends FieldValues>(
  props: Props<T>,
  ref: React.ForwardedRef<FormInputHandle>,
) => {
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
    autoFocus,
    ...rest
  } = props;
  const textFieldRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => textFieldRef.current?.focus(),
    blur: () => textFieldRef.current?.blur(),
  }));

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      errorBorderOnly={errorBorderOnly}
    >
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            {...rest}
            ref={textFieldRef}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={error}
            autoFocus={autoFocus}
            icon={icon}
            rightIcon={rightIcon}
          />
        )}
      />
    </FormField>
  );
};

export const FormInput = forwardRef(FormInputInner) as <T extends FieldValues>(
  props: Props<T> & { ref?: React.ForwardedRef<FormInputHandle> },
) => React.ReactElement;
