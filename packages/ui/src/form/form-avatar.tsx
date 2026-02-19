import { Control, ControllerProps, FieldValues } from "react-hook-form";

import { AvatarPicker } from "../avatar-picker";
import { FileType } from "../types";
import { FormField } from "./form-field";

/** Type definitions */
interface Props<T extends FieldValues> {
  required?: boolean;
  label?: string;
  rules?: ControllerProps["rules"];
  control?: Control<T>;
  error?: string;
  disabled?: boolean;
  value: FileType | null;
  onChange: (value: FileType | null) => void;
}

/**
 * Renders an avatar form field component with image picker
 * @param props - avatar form field props
 */
export function FormAvatar<T extends FieldValues>(props: Props<T>) {
  const { label, error, required, disabled, value, onChange } = props;

  return (
    <FormField label={label} required={required} error={error} alignItems="center">
      <AvatarPicker disabled={disabled} value={value} onChange={onChange} />
    </FormField>
  );
}
