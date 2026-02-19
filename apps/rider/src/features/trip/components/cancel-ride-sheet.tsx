import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { RideActionReasonResponseDto } from "@brocabs/client";
import { Container } from "@brocabs/ui/layout";
import { Medium, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "~/shared/ui/icons";
import { useCancellationReasons } from "../hooks/useCancellationReasons";

interface CancelRideSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal | null>;
  onCancelRide: (payload: { reasonCode: string; otherReasonText?: string }) => void;
  isPending?: boolean;
}

function Checkbox({ isSelected }: { isSelected: boolean }) {
  return (
    <Container
      width={21}
      height={21}
      borderRadius={5}
      borderWidth={isSelected ? 0 : 1.2}
      borderColor={isSelected ? "transparent" : "Neutrals/200"}
      backgroundColor={isSelected ? "Primary/600" : "white"}
      justifyContent="center"
      alignItems="center">
      {isSelected && <Icon name="check" width={12} height={12} color={Colors.white} />}
    </Container>
  );
}

function ReasonOption({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Container
        flexDirection="row"
        alignItems="center"
        gap={10}
        p={15}
        backgroundColor="white"
        borderRadius={10}>
        <Checkbox isSelected={isSelected} />
        <Medium fontSize={14} color="Primary/50">
          {label}
        </Medium>
      </Container>
    </Pressable>
  );
}

export function CancelRideSheet({ bottomSheetRef, onCancelRide, isPending }: CancelRideSheetProps) {
  const { data: reasons } = useCancellationReasons();
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState<RideActionReasonResponseDto | null>(null);
  const [otherReasonText, setOtherReasonText] = useState("");

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    []
  );

  const handleCancel = () => {
    if (selectedReason?.requiresComment) {
      if (otherReasonText.trim()) {
        onCancelRide({
          reasonCode: selectedReason.code,
          otherReasonText: otherReasonText.trim(),
        });
      }
    } else if (selectedReason) {
      onCancelRide({
        reasonCode: selectedReason.code,
      });
    }
  };

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
  };

  const isFormValid =
    (selectedReason?.requiresComment && !!otherReasonText.trim()) ||
    (!selectedReason?.requiresComment && !!selectedReason);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={["85%"]}
      index={0}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleComponent={() => null}
      backgroundStyle={{ backgroundColor: Colors["Bg Color"] }}
      handleIndicatorStyle={{ backgroundColor: Colors["black-200"] }}>
      <BottomSheetScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 20,
        }}>
        <View style={styles.cancelTitleContainer}>
          <SemiBold fontSize={24} color="Primary/50">
            Cancel Ride
          </SemiBold>
        </View>
        <Container gap={5}>
          {reasons?.data.map((reason) => (
            <ReasonOption
              key={reason.id}
              label={reason.label}
              isSelected={selectedReason?.id === reason.id}
              onPress={() => setSelectedReason(reason)}
            />
          ))}

          {selectedReason?.requiresComment && (
            <View style={styles.otherInputContainer}>
              <TextInput
                style={styles.otherInput}
                placeholder="What’s the reason?"
                placeholderTextColor={Colors["Neutrals/400"]}
                multiline
                numberOfLines={3}
                value={otherReasonText}
                onChangeText={setOtherReasonText}
                textAlignVertical="top"
              />
            </View>
          )}
        </Container>
        <Container gap={10} mt={20}>
          <Pressable
            onPress={handleCancel}
            disabled={!isFormValid || isPending}
            style={[
              styles.actionButton,
              {
                backgroundColor: Colors["Secondary/600"],
                opacity: !isFormValid || isPending ? 0.7 : 1,
              },
            ]}>
            <Medium fontSize={20} color="Primary/950">
              Cancel Ride
            </Medium>
          </Pressable>

          <Pressable
            onPress={handleClose}
            style={[styles.actionButton, { backgroundColor: Colors["Primary/600"] }]}>
            <Medium fontSize={20} color="white">
              Go Back
            </Medium>
          </Pressable>
        </Container>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelTitleContainer: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },
  otherInputContainer: {
    backgroundColor: Colors["Neutrals/100"],
    borderRadius: 20,
    padding: 15,
    marginTop: 5,
    height: 130,
  },
  otherInput: {
    flex: 1,
    fontFamily: "BR Hendrix",
    fontSize: 14,
    color: Colors["Primary/50"],
    lineHeight: 24,
  },
});
