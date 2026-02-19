import { FieldValues } from "react-hook-form";

import { IDPicker } from "../id-picker";
import { FileType } from "../types";
import { FormField } from "./form-field";

/** Type definitions */
interface Props<T extends FieldValues> {
  required?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  value: FileType | null;
  onChange: (value: FileType | null) => void;
  errorBorderOnly?: boolean;
}

/**
 * Renders an ID picker form field component
 * @param props - ID picker form field props
 */
export function FormIDPicker<T extends FieldValues>(props: Props<T>) {
  const { label, error, required, disabled, onChange, value, errorBorderOnly } =
    props;

  return (
    <FormField
      required={required}
      error={error}
      errorBorderOnly={errorBorderOnly}
    >
      <IDPicker
        disabled={disabled}
        value={value}
        onChange={onChange}
        error={error}
        label={label}
      />
    </FormField>
  );
}
