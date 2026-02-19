import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import type { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import React from "react";

/**
 * Renders the backdrop component
 *
 * @param props - Backdrop props
 */
export function Backdrop(props: BottomSheetDefaultBackdropProps) {
  return <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />;
}
