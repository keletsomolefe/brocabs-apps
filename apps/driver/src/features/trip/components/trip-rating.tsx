import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Platform, TextInput } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { Button } from "@brocabs/ui/button";
import { Container, Fill, PressableScale, Row } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { FontFamily } from "@brocabs/ui/theme/fonts";
import { useLocale } from "~/i18n/LocaleContext";
import { GestureModal } from "~/shared/ui/gesture-modal";
import { Icon } from "~/shared/ui/icons";

export const TripRating = forwardRef<TripRatingRef, TripRatingProps>((props, ref) => {
  const { t } = useLocale();
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const { onCancel, onSubmit, visible, isLoading } = props;
  const [review, setReview] = useState<string>("");

  // Sync internal visibility with prop when provided
  useEffect(() => {
    if (visible !== undefined) {
      setIsVisible(visible);
    }
  }, [visible]);

  useImperativeHandle(ref, () => ({
    show: () => {
      setIsVisible(true);
    },
    hide: () => {
      setIsVisible(false);
    },
  }));

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    onSubmit(rating, review);
    // Reset state after submit
    setRating(0);
    setReview("");
  };

  const handleCancel = () => {
    onCancel();
    // Reset state after cancel
    setRating(0);
    setReview("");
  };

  return (
    <GestureModal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={400}
      animationOutTiming={1}
      hideModalContentWhileAnimating
      backdropTransitionOutTiming={0}
      hasBackdrop>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "android" ? 40 : 0}
        style={{ flex: 1, justifyContent: "center" }}>
        <Container backgroundColor="white" py={4} px={3} borderRadius={30} gap={20}>
          <Container
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            width={84}
            height={84}
            borderRadius={42}
            backgroundColor="Primary/600">
            <Icon name="star" width={50} height={50} color={Colors["Warning/400"]} />
          </Container>
          <Container gap={10}>
            <Bold center color="Primary/50" fontSize={20}>
              {t("trip.howWasRider")}
            </Bold>
            <Regular center color="Primary/50" fontSize={14}>
              {t("trip.helpBroCab")}
            </Regular>
          </Container>
          <Row gap={15} justifyContent="center" alignItems="center">
            {[1, 2, 3, 4, 5].map((value) => (
              <RatingItem
                key={value}
                value={value}
                isSelected={value <= (hoveredRating || rating)}
                onPress={() => handleRatingPress(value)}
                onPressIn={() => setHoveredRating(value)}
                onPressOut={() => setHoveredRating(0)}
              />
            ))}
          </Row>
          <Container backgroundColor="Bg Color" height={140} borderRadius={15} p={3}>
            <TextInput
              placeholder={t("common.giveFeedback")}
              placeholderTextColor={Colors["Neutrals/400"]}
              style={{
                flex: 1,
                fontSize: 15,
                fontFamily: FontFamily.Regular,
                textAlignVertical: "top",
              }}
              multiline={true}
              value={review}
              onChangeText={setReview}
            />
          </Container>
          <Row alignItems="center" gap={5}>
            <Fill>
              <Button
                label={t("trip.remindMeLater")}
                variant="light"
                onPress={handleCancel}
                size="md"
                radius="rounded"
                textWeight="regular"
                px={12}
              />
            </Fill>
            <Fill>
              <Button
                label={t("common.submit")}
                variant="primary"
                onPress={handleSubmit}
                size="md"
                radius="rounded"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </Fill>
          </Row>
        </Container>
      </KeyboardAvoidingView>
    </GestureModal>
  );
});

TripRating.displayName = "TripRating";

export interface TripRatingRef {
  show: () => void;
  hide: () => void;
}

export interface TripRatingProps {
  /** Optional controlled visibility - when provided, syncs with internal state */
  visible?: boolean;
  onCancel: () => void;
  onSubmit: (rating: number, review: string) => void;
  /** Loading state for the submit button */
  isLoading?: boolean;
}

interface RatingItemProps {
  value: number;
  isSelected: boolean;
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

function RatingItem({ value, isSelected, onPress, onPressIn, onPressOut }: RatingItemProps) {
  return (
    <PressableScale onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Icon
        name="star"
        width={40}
        height={40}
        color={isSelected ? Colors["Warning/400"] : Colors["Neutrals/300"]}
      />
    </PressableScale>
  );
}
