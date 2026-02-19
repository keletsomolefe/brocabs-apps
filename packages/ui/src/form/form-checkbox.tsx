import ExpoCheckbox from "expo-checkbox";
import { ComponentProps } from "react";
import {
  Control,
  Controller,
  ControllerProps,
  FieldValues,
} from "react-hook-form";

import { Regular } from "../text";
import { Colors } from "../theme/colors";

import { PressableScale } from "../layout";
import { FormField } from "./form-field";

/**
 * Renders a checkbox form field with the label displayed on the right side.
 * @param props - form checkbox props
 */
export function FormCheckbox<T extends FieldValues>(props: Props<T>) {
  const { label, required, control, name, rules, error, ...checkboxProps } =
    props;
  const { color: checkboxColor, ...restCheckboxProps } = checkboxProps;

  return (
    <FormField error={error}>
      <Controller
        control={control as Control<FieldValues>}
        name={name}
        rules={rules}
        render={({ field: { value, onChange } }) => {
          const isChecked = Boolean(value);

          return (
            <PressableScale
              onPress={() => {
                onChange(!isChecked);
              }}
              flexDirection="row"
              alignItems="center"
              gap={6}
              hitSlop={8}
            >
              <ExpoCheckbox
                value={isChecked}
                onValueChange={onChange}
                style={{ borderRadius: 5 }}
                color={
                  checkboxColor ??
                  (isChecked ? Colors["Primary/400"] : Colors["Neutrals/400"])
                }
                {...restCheckboxProps}
              />
              {label && (
                <Regular color="Primary/50" fontSize={14}>
                  {label}
                </Regular>
              )}
            </PressableScale>
          );
        }}
      />
    </FormField>
  );
}

/** Type definitions */
interface Props<T extends FieldValues>
  extends Omit<ComponentProps<typeof ExpoCheckbox>, "value" | "onValueChange"> {
  label?: string;
  required?: boolean;
  name: string;
  rules?: ControllerProps["rules"];
  control?: Control<T>;
  error?: string;
}
