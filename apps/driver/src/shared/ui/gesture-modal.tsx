import { ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Modal, { ModalProps } from "react-native-modal";

interface GestureModalProps extends Partial<ModalProps> {
  children: ReactNode;
}

/**
 * A wrapper around react-native-modal that includes GestureHandlerRootView.
 * This is required on Android for gesture-based pressables (like PressableScale from pressto)
 * to work inside modals, since modals create a separate native view hierarchy.
 */
export function GestureModal({ children, ...props }: GestureModalProps) {
  return (
    <Modal {...props}>
      <GestureHandlerRootView style={{ flex: 1, justifyContent: "center" }}>
        {children}
      </GestureHandlerRootView>
    </Modal>
  );
}
