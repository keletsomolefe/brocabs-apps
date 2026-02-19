import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
} from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

import { IconName } from "../icons/icon";
import { PhoneField } from "../phone-field";
import { Colors } from "../theme/colors";
import { FormField } from "./form-field";

/**
 * Renders the phone input component
 * @param props - phone input props
 */
export interface FormPhoneInputHandle {
  focus: () => void;
  blur: () => void;
}

export const FormPhoneInput = forwardRef<FormPhoneInputHandle, Props<any>>(
  (props, ref) => {
    const {
      label,
      control,
      rules,
      name,
      error,
      required,
      countryCode,
      errorBorderOnly,
      onCountryCodeChange,
      rightIcon,
      showCountryCodeInSelection,
      autoFocus,
      ...rest
    } = props;
    const phoneInputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => phoneInputRef.current?.focus(),
      blur: () => phoneInputRef.current?.blur(),
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
          control={control as Control<FieldValues>}
          rules={rules}
          render={({ field: { onChange, onBlur, value } }) => (
            <PhoneField
              {...rest}
              ref={phoneInputRef}
              onChangeText={(text) => {
                onChange(text);
                rest.onChangeText?.(text);
              }}
              onBlur={onBlur}
              value={value}
              error={error}
              autoFocus={autoFocus}
              countryCode={countryCode}
              onCountryCodeChange={onCountryCodeChange}
              rightIcon={rightIcon}
              showCountryCodeInSelection={showCountryCodeInSelection}
              placeholderTextColor={Colors["black-400"]}
            />
          )}
        />
      </FormField>
    );
  },
);

FormPhoneInput.displayName = "FormPhoneInput";

/** Type definitions */
interface Props<T extends FieldValues> extends TextInputProps {
  required?: boolean;
  label?: string;
  placeholder?: string;
  name: string;
  rules?: ControllerProps["rules"];
  control?: Control<T>;
  error?: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  errorBorderOnly?: boolean;
  rightIcon?: IconName;
  showCountryCodeInSelection?: boolean;
}
