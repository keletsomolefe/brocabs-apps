import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { SheetSelectTrigger } from "./sheet-select-trigger";

interface FormSheetSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: { label: string; value: string }[];
  label?: string;
  placeholder: string;
  onPress: () => void;
  required?: boolean;
}

export function FormSheetSelect<T extends FieldValues>({
  control,
  name,
  ...props
}: FormSheetSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value }, fieldState: { error } }) => (
        <SheetSelectTrigger {...props} value={value} error={error?.message} />
      )}
    />
  );
}
