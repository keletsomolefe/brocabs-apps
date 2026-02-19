import React, { type PropsWithChildren } from "react";

interface VisibleProps {
  /**
   * Condition to evaluate. If truthy will return the component
   */
  if: unknown | undefined;
}

/**
 * Render a component if the `if` prop evaluates to true, ensures we render `null` in cases where
 * the result is undefined to prevent crashing on native
 * @param props - Visible props
 */
export function Visible(props: PropsWithChildren<VisibleProps>) {
  const { if: cond, children } = props;

  if (!cond) {
    return null;
  }

  return <>{children}</>;
}
