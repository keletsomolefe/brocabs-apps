import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Colors } from "@brocabs/ui/theme/colors";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.9;

const SUCCESS_PATTERNS = [
  "/payment/success",
  "/payment-success",
  "/checkout/success",
  "/callback/success",
  "?status=success",
  "?result=success",
  "?payment=success",
  "/thank-you",
  "/thankyou",
  "/confirmation",
];

const CANCEL_PATTERNS = [
  "/payment/cancel",
  "/payment-cancel",
  "/payment/failed",
  "/payment-failed",
  "/checkout/cancel",
  "/checkout/failed",
  "/callback/cancel",
  "/callback/failed",
  "?status=cancel",
  "?status=failed",
  "?result=cancel",
  "?result=failed",
  "?payment=cancelled",
  "?payment=failed",
];

const matchesPattern = (urlString: string, patterns: string[]) => {
  const lowerUrl = urlString.toLowerCase();
  return patterns.some((pattern) => lowerUrl.includes(pattern.toLowerCase()));
};

interface AddCardModalProps {
  url?: string | null;
  isLoading?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export interface AddCardModalRef {
  open: () => void;
  close: () => void;
}

export const AddCardModal = forwardRef<AddCardModalRef, AddCardModalProps>((props, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();
  const [hasCompleted, setHasCompleted] = useState(false);

  const handleSuccess = () => {
    if (hasCompleted) return;
    setHasCompleted(true);
    props.onSuccess?.();
  };

  const handleCancel = () => {
    if (hasCompleted) return;
    setHasCompleted(true);
    props.onClose?.();
  };

  useImperativeHandle(ref, () => ({
    open: () => {
      setHasCompleted(false);
      bottomSheetModalRef.current?.present();
    },
    close: () => bottomSheetModalRef.current?.close(),
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enablePanDownToClose
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      snapPoints={[MODAL_HEIGHT]}
      backgroundComponent={({ animatedIndex, animatedPosition, ...bgProps }) => (
        <Container
          backgroundColor="white"
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          {...bgProps}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: Colors["Neutrals/200"] }}
      backdropComponent={Backdrop}
      onDismiss={props.onClose}>
      <BottomSheetView style={{ flex: 1 }}>
        <Container
          backgroundColor="white"
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          height={MODAL_HEIGHT}
          overflow="hidden"
          style={{ paddingBottom: bottom }}>
          {props.isLoading ? (
            <Container flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" color={Colors["Primary/600"]} />
            </Container>
          ) : props.url ? (
            <WebView
              source={{ uri: props.url }}
              style={{ flex: 1 }}
              startInLoadingState
              scalesPageToFit={false}
              setBuiltInZoomControls={false}
              setDisplayZoomControls={false}
              bouncesZoom={false}
              originWhitelist={["*"]}
              onShouldStartLoadWithRequest={(request) => {
                const { url } = request;
                if (matchesPattern(url, SUCCESS_PATTERNS)) {
                  handleSuccess();
                  return false;
                }
                if (matchesPattern(url, CANCEL_PATTERNS)) {
                  handleCancel();
                  return false;
                }
                return true;
              }}
              onNavigationStateChange={(navState) => {
                if (!navState.loading) {
                  const { url } = navState;
                  if (matchesPattern(url, SUCCESS_PATTERNS)) {
                    handleSuccess();
                  } else if (matchesPattern(url, CANCEL_PATTERNS)) {
                    handleCancel();
                  }
                }
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                // iOS ATS can block redirects with code -1022
                const errorUrl = (nativeEvent as { url?: string }).url || "";
                if (matchesPattern(errorUrl, SUCCESS_PATTERNS)) {
                  handleSuccess();
                  return;
                }
                if (matchesPattern(errorUrl, CANCEL_PATTERNS)) {
                  handleCancel();
                  return;
                }
                console.error("WebView error:", nativeEvent);
              }}
              renderLoading={() => (
                <Container
                  position="absolute"
                  top={0}
                  bottom={0}
                  left={0}
                  right={0}
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor="white">
                  <ActivityIndicator size="large" color={Colors["Primary/600"]} />
                </Container>
              )}
            />
          ) : null}
        </Container>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddCardModal.displayName = "AddCardModal";
