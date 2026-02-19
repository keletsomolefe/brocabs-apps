import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ActivityIndicator, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Colors } from "@brocabs/ui/theme/colors";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = WINDOW_HEIGHT * 0.9;

interface AddCardModalProps {
  url?: string | null;
  isLoading?: boolean;
  onClose?: () => void;
}

export interface AddCardModalRef {
  open: () => void;
  close: () => void;
}

export const AddCardModal = forwardRef<AddCardModalRef, AddCardModalProps>((props, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetModalRef.current?.present(),
    close: () => bottomSheetModalRef.current?.close(),
  }));

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      enablePanDownToClose
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      snapPoints={[MODAL_HEIGHT]}
      backgroundComponent={({ animatedIndex, animatedPosition, ...props }) => (
        <Container
          backgroundColor="white"
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          {...props}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: Colors["black-200"] }}
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
