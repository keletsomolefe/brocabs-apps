import { Regular, SemiBold } from "@brocabs/ui/text";
import { useMemo } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Column, Container, Fill, Row } from "@brocabs/ui/layout";
import { useLocale } from "~/i18n/LocaleContext";
import { RichText } from "~/shared/ui/rich-text";

export default function PrivacyPoliciesScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLocale();

  const policies = useMemo(
    () => [
      {
        id: "introduction",
        title: t("privacyPolicy.introduction.title"),
        body: t("privacyPolicy.introduction.body"),
      },
      {
        id: "applicable-law",
        title: t("privacyPolicy.applicableLaw.title"),
        body: t("privacyPolicy.applicableLaw.body"),
      },
      {
        id: "information-collect",
        title: t("privacyPolicy.informationCollect.title"),
        body: t("privacyPolicy.informationCollect.body"),
      },
      {
        id: "information-provide",
        title: t("privacyPolicy.informationProvide.title"),
        body: t("privacyPolicy.informationProvide.body"),
      },
      {
        id: "usage-device-data",
        title: t("privacyPolicy.usageDeviceData.title"),
        body: t("privacyPolicy.usageDeviceData.body"),
      },
      {
        id: "third-party-sources",
        title: t("privacyPolicy.thirdPartySources.title"),
        body: t("privacyPolicy.thirdPartySources.body"),
      },
      {
        id: "how-we-use",
        title: t("privacyPolicy.howWeUse.title"),
        body: t("privacyPolicy.howWeUse.body"),
      },
      {
        id: "legal-basis",
        title: t("privacyPolicy.legalBasis.title"),
        body: t("privacyPolicy.legalBasis.body"),
      },
      {
        id: "sharing-disclosure",
        title: t("privacyPolicy.sharingDisclosure.title"),
        body: t("privacyPolicy.sharingDisclosure.body"),
      },
      {
        id: "data-retention",
        title: t("privacyPolicy.dataRetention.title"),
        body: t("privacyPolicy.dataRetention.body"),
      },
      {
        id: "your-rights",
        title: t("privacyPolicy.yourRights.title"),
        body: t("privacyPolicy.yourRights.body"),
      },
      {
        id: "security",
        title: t("privacyPolicy.security.title"),
        body: t("privacyPolicy.security.body"),
      },
      {
        id: "children",
        title: t("privacyPolicy.children.title"),
        body: t("privacyPolicy.children.body"),
      },
      {
        id: "policy-changes",
        title: t("privacyPolicy.policyChanges.title"),
        body: t("privacyPolicy.policyChanges.body"),
      },
      {
        id: "contact",
        title: t("privacyPolicy.contact.title"),
        body: t("privacyPolicy.contact.body"),
      },
    ],
    [t]
  );

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} flex={1} justifyContent="space-between">
        <Column flex={1}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 20 }}>
            <Column gap={18}>
              <Column gap={10}>
                <SemiBold fontSize={16} color="Primary/50">
                  {t("privacyPolicy.header")}
                </SemiBold>
                <Regular fontSize={14} lineHeight={24} color="Neutrals/600">
                  {t("privacyPolicy.lastUpdated")}
                </Regular>
              </Column>

              {policies.map((policy, index) => (
                <Column key={policy.id} gap={6}>
                  <Row gap={10}>
                    <SemiBold fontSize={18} color="Primary/50">
                      {index + 1}.
                    </SemiBold>
                    <SemiBold fontSize={18} color="Primary/50">
                      {policy.title}
                    </SemiBold>
                  </Row>
                  <Container px={26}>
                    <RichText color="Neutrals/600">{policy.body}</RichText>
                  </Container>
                </Column>
              ))}
            </Column>
          </ScrollView>
        </Column>
      </Container>
    </Fill>
  );
}
