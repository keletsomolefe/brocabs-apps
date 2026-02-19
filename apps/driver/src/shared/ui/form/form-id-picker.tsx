import { FieldValues } from "react-hook-form";

import { FormField } from "@brocabs/ui/form/form-field";
import { FileType } from "~/constants";
import { IDPicker } from "../ID-picker";

/**
 * Renders an ID picker form field component
 * @param props - ID picker form field props
 */
export function FormIDPicker<T extends FieldValues>(props: Props<T>) {
  const {
    label,
    error,
    required,
    disabled,
    onChange,
    value,
    errorBorderOnly,
    hasDatePicker,
    date,
    onDateChange,
  } = props;

  return (
    <FormField required={required} error={error} errorBorderOnly={errorBorderOnly}>
      <IDPicker
        disabled={disabled}
        value={value}
        onChange={onChange}
        error={error}
        label={label}
        hasDatePicker={hasDatePicker}
        date={date}
        onDateChange={onDateChange}
      />
    </FormField>
  );
}

/** Type definitions */
interface Props<T extends FieldValues> {
  required?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  value: FileType | null;
  onChange: (value: FileType | null) => void;
  errorBorderOnly?: boolean;
  hasDatePicker?: boolean;
  date?: Date | null;
  onDateChange?: (date: Date) => void;
}
