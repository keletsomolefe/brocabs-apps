import { Colors } from "@brocabs/ui/theme/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "~/shared/ui/icons";
import { Container, Row } from "@brocabs/ui/layout";
import { LocationConfirmSheetContent } from "./location-confirm";

type Props = {
  onConfirm: () => void;
  loading?: boolean;
  onCenterMap?: () => void;
};

export function LocationConfirmSheet({ onConfirm, loading, onCenterMap }: Props) {
  return (
    <BottomSheet
      enablePanDownToClose={false}
      enableDynamicSizing={true}
      snapPoints={[]}
      index={0}
      backgroundComponent={({ animatedIndex, animatedPosition, ...props }) => (
        <Container
          backgroundColor="white"
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          {...props}
        />
      )}
      style={{
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
      handleComponent={() => (
        <View
          style={{
            height: 15,
            justifyContent: "flex-end",
            borderRadius: 15,
            alignItems: "center",
          }}
          pointerEvents="box-none">
          <View
            style={{
              position: "absolute",
              top: -36 - 20,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
            pointerEvents="box-none">
            <Row justifyContent="flex-end" alignItems="center" px={20}>
              {onCenterMap && (
                <TouchableOpacity onPress={onCenterMap}>
                  <Container
                    width={36}
                    height={36}
                    borderRadius={10}
                    backgroundColor="Primary/400"
                    alignItems="center"
                    justifyContent="center">
                    <Icon name="human-hello" width={20} height={20} color={Colors.white} />
                  </Container>
                </TouchableOpacity>
              )}
            </Row>
          </View>
        </View>
      )}>
      <BottomSheetView style={{ flex: 1 }}>
        <LocationConfirmSheetContent onConfirm={onConfirm} loading={loading} />
      </BottomSheetView>
    </BottomSheet>
  );
}
