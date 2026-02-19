import { PropsWithChildren } from "react";

import { Container } from "../layout";
import { Regular } from "../text";

/**
 * Renders a form field component
 * @param props - form field props
 */
export function FormField(props: PropsWithChildren<FormFieldProps>) {
  const { children, label, required, error, errorBorderOnly, alignItems } = props;

  return (
    <Container gap={10} alignItems={alignItems}>
      {label && (
        <Regular color="black-700" fontSize={16}>
          {label} {required && <Regular color="Secondary/600"> *</Regular>}
        </Regular>
      )}
      {children}
      {error && !errorBorderOnly && (
        <Regular color="Secondary/600" fontSize={16}>
          {error}
        </Regular>
      )}
    </Container>
  );
}

/** Type definitions */
interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  errorBorderOnly?: boolean;
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch";
}
