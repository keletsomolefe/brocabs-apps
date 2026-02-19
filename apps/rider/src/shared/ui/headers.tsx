import { Container, Row } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { router, useSegments } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { BroScholarText } from "./bro-scholar-text";

interface BaseHeaderProps {
  title?: string | React.ReactNode;
  onBack?: () => void;
  connectionBannerVisible?: boolean;
}

export function BaseHeader({ title, onBack, connectionBannerVisible }: BaseHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <Container pt={connectionBannerVisible ? 0 : insets.top} backgroundColor="Bg Color">
      <Row alignItems="center" gap={14} px={20} height={48}>
        <TouchableOpacity onPress={onBack || (() => router.back())}>
          <Icon name="arrow-back" width={22} height={18} color={Colors["Primary/50"]} />
        </TouchableOpacity>
        {typeof title === "string" ? (
          <Regular fontSize={18} color="Primary/50">
            {title}
          </Regular>
        ) : (
          title
        )}
      </Row>
    </Container>
  );
}

export function BroScholarHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];

  let title: string | React.ReactNode = "";
  if (lastSegment === "bro-scholar") {
    title = <BroScholarText fontSize={18} lineHeight={24} width={85} />;
  } else if (lastSegment === "create-application") {
    title = t("common.uploadDocuments");
  }

  return <BaseHeader title={title} />;
}

export function FavoriteAddressesHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];

  const title = lastSegment === "add" ? t("common.addNewAddress") : t("common.favoriteAddresses");

  return <BaseHeader title={title} />;
}

export function SOSContactsHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];

  const title =
    lastSegment === "[id]"
      ? t("common.editEmergencyContact")
      : lastSegment === "add"
        ? t("common.addEmergencyContact")
        : t("common.sosContacts");

  return <BaseHeader title={title} />;
}

export function RideHistoryHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];
  const title = lastSegment === "[id]" ? t("common.rideDetails") : t("common.myRidesHistory");
  return <BaseHeader title={title} />;
}

export function ProfileSettingsHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];

  const MAP: Record<string, string> = {
    "payment-methods": "common.paymentMethods",
    "edit-profile": "common.editProfile",
    "notification-settings": "common.notificationSettings",
    support: "common.helpSupport",
    "account-security": "common.accountSecurity",
    "change-password": "common.changePassword",
    faqs: "common.faq",
    "contact-support": "common.contactSupport",
    "privacy-policies": "common.privacyPolicies",
    "update-email": "common.changeEmail",
    "update-phone-number": "common.changeMobileNumber",
    wallet: "common.wallet",
  };

  const title = MAP[lastSegment] ? t(MAP[lastSegment] as any) : t("common.profileSettings");
  return <BaseHeader title={title} />;
}

export function WalletHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];

  const title =
    lastSegment === "recharge"
      ? t("common.rechargeWallet")
      : lastSegment === "my-cards"
        ? t("common.myCards")
        : t("common.wallet");

  return <BaseHeader title={title} />;
}

export function NotificationsHeaderLeft() {
  const { t } = useTranslation();
  return <BaseHeader title={t("common.notifications")} />;
}

export function ComplaintsHeaderLeft() {
  const { t } = useTranslation();
  const segments = useSegments();
  const lastSegment = segments[segments.length - 1];

  const title =
    lastSegment === "[id]"
      ? t("common.complaintDetail")
      : lastSegment === "add-complain"
        ? t("common.addComplain")
        : t("common.myComplaints");

  return <BaseHeader title={title} />;
}
