import { Container, Fill } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Pressable } from "react-native";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "~/hooks/use-notification-settings";

interface ToggleItemProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const CustomSwitch = ({
  value,
  onValueChange,
  disabled,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) => {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animValue]);

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors["Neutrals/200"], Colors["Primary/600"]],
  });

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  return (
    <Pressable onPress={() => !disabled && onValueChange(!value)} disabled={disabled}>
      <Animated.View
        style={{
          width: 36,
          height: 20,
          borderRadius: 12,
          padding: 2,
          backgroundColor,
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        }}>
        <Animated.View
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: "white",
            transform: [{ translateX }],
            shadowColor: "#101828",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
};

const ToggleItem = ({ label, value, onValueChange, disabled }: ToggleItemProps) => {
  return (
    <Container
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      backgroundColor="white"
      borderRadius={20}
      px={22}
      height={56}>
      <Regular fontSize={14} lineHeight={24} color="Primary/50">
        {label}
      </Regular>
      <CustomSwitch value={value} onValueChange={onValueChange} disabled={disabled} />
    </Container>
  );
};

export default function NotificationSettingsScreen() {
  const { data: settings, isLoading } = useNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const updateSetting = (
    key:
      | "generalUpdates"
      | "safetySecurityAlerts"
      | "rideStatusUpdates"
      | "ratingReviews"
      | "appUpdates",
    value: boolean
  ) => {
    updateMutation.mutate({ [key]: value });
  };

  if (isLoading) {
    return (
      <Fill backgroundColor="Bg Color">
        <Stack.Screen options={{ headerShown: false }} />
        <Container flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="large" color={Colors["Primary/600"]} />
        </Container>
      </Fill>
    );
  }

  return (
    <Fill backgroundColor="Bg Color">
      <Stack.Screen options={{ headerShown: false }} />

      <Container px={20} pt={20} gap={14}>
        <ToggleItem
          label="General Updates"
          value={settings?.generalUpdates ?? true}
          onValueChange={(v) => updateSetting("generalUpdates", v)}
          disabled={updateMutation.isPending}
        />
        <ToggleItem
          label="Safety & Security Alerts"
          value={settings?.safetySecurityAlerts ?? true}
          onValueChange={(v) => updateSetting("safetySecurityAlerts", v)}
          disabled={updateMutation.isPending}
        />
        <ToggleItem
          label="Ride Status Updates"
          value={settings?.rideStatusUpdates ?? true}
          onValueChange={(v) => updateSetting("rideStatusUpdates", v)}
          disabled={updateMutation.isPending}
        />
        <ToggleItem
          label="Rating & Reviews"
          value={settings?.ratingReviews ?? true}
          onValueChange={(v) => updateSetting("ratingReviews", v)}
          disabled={updateMutation.isPending}
        />
        <ToggleItem
          label="App Updates"
          value={settings?.appUpdates ?? true}
          onValueChange={(v) => updateSetting("appUpdates", v)}
          disabled={updateMutation.isPending}
        />
      </Container>
    </Fill>
  );
}
