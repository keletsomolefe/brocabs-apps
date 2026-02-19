import { Pressable } from "@brocabs/ui/layout";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CancelTripProps {
  isLoading?: boolean;
  onPress?: () => void;
}

export function CancelTrip({ isLoading, onPress }: CancelTripProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={[styles.cancelButton, { paddingBottom: insets.bottom + 15 }]}>
      {isLoading ? (
        <ActivityIndicator color="#E4211E" />
      ) : (
        <View style={styles.cancelContent}>
          <Text style={styles.cancelText}>{t("trip.cancelRide")}</Text>
          <Icon name="chevron-right" width={12} height={24} color="#E4211E" />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    shadowColor: "#A2A2A2",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.56,
    shadowRadius: 10.9,
    elevation: 5,
  },
  cancelContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    fontSize: 18,
    lineHeight: 24,
    color: "#E4211E",
    fontFamily: "BR Hendrix",
  },
});
