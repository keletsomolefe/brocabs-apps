import { ButtonProps } from "@brocabs/ui/button";
import { FormField } from "@brocabs/ui/form/form-field";
import { FileType } from "~/constants";
import { IDPicker } from "../ID-picker";

/**
 * Renders an ID picker form field component
 * @param props - ID picker form field props
 */
export function FormIDPicker(props: Props) {
  const {
    label,
    error,
    required,
    disabled,
    onChange,
    value,
    errorBorderOnly,
    uploadButtonProps,
    description,
    buttonLabel,
  } = props;

  return (
    <FormField required={required} error={error} errorBorderOnly={errorBorderOnly}>
      <IDPicker
        disabled={disabled}
        value={value}
        onChange={onChange}
        error={error}
        label={label}
        description={description}
        buttonLabel={buttonLabel}
        uploadButtonProps={uploadButtonProps}
      />
    </FormField>
  );
}

/** Type definitions */
interface Props {
  required?: boolean;
  label?: string;
  error?: string;
  disabled?: boolean;
  value: FileType | null;
  onChange: (value: FileType | null) => void;
  errorBorderOnly?: boolean;
  uploadButtonProps?: Partial<ButtonProps>;
  description?: string;
  buttonLabel?: string;
}
