import { Control, Controller, ControllerProps, FieldValues } from "react-hook-form";

import { FormField } from "@brocabs/ui/form/form-field";
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
    errorBorderOnly,
  } = props;

  return (
    <FormField label={label} required={required} error={error} errorBorderOnly={errorBorderOnly}>
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

/** Type definitions */
interface FormDropdownProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  label?: string;
  placeholder: string;
  data: Option[];
  error?: string;
  required?: boolean;
  rules?: ControllerProps["rules"];
  disabled?: boolean;
  errorBorderOnly?: boolean;
}
