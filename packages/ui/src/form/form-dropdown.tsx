import { Control, Controller, FieldValues } from "react-hook-form";

import { DropdownField, type Option } from "../dropdown";
import { FormField } from "./form-field";

/** Type definitions */
interface FormDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  label?: string;
  placeholder: string;
  data: Option[];
  required?: boolean;
  rules?: any;
  disabled?: boolean;
  error?: string;
  errorBorderOnly?: boolean;
}

/**
 * Renders a dropdown field component
 * @param props - dropdown field props
 */
export function FormDropdown<T extends FieldValues>(
  props: FormDropdownProps<T>,
) {
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
    errorBorderOnly,
  } = props;

  return (
    <FormField
      label={label}
      required={required}
      error={error}
      errorBorderOnly={errorBorderOnly}
    >
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
          />
        )}
      />
    </FormField>
  );
}
