import { Medium } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useCallback, useMemo, useState } from "react";
import { LayoutAnimation, Platform, TouchableOpacity, UIManager } from "react-native";

import { Card, Column, Container, Fill, Row, ScrollView } from "@brocabs/ui/layout";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { RichText } from "~/shared/ui/rich-text";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface FaqItemProps {
  question: string;
  answer: string;
  expanded: boolean;
  onToggle: () => void;
}

const FaqItem = ({ question, answer, expanded, onToggle }: FaqItemProps) => {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
      <Card backgroundColor="white" borderRadius={20} px={22} py={20}>
        <Row alignItems="center" gap={12}>
          <Fill>
            <Medium fontSize={14} lineHeight={16} color="Primary/50">
              {question}
            </Medium>
          </Fill>
          <Container
            style={{
              transform: [{ rotate: expanded ? "270deg" : "90deg" }],
            }}>
            <Icon name="next-ltr" width={17} height={17} color={Colors["Primary/50"]} />
          </Container>
        </Row>
        {expanded && (
          <Column mt={12}>
            <RichText color="Neutrals/400">{answer}</RichText>
          </Column>
        )}
      </Card>
    </TouchableOpacity>
  );
};

export default function FaqsScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { t } = useLocale();

  const faqs = useMemo(
    () => [
      {
        id: "what-is-brocabs",
        title: t("faqItems.whatIsBrocabs.title"),
        body: t("faqItems.whatIsBrocabs.body"),
      },
      {
        id: "how-it-works",
        title: t("faqItems.howItWorks.title"),
        body: t("faqItems.howItWorks.body"),
      },
      {
        id: "vehicle-info",
        title: t("faqItems.vehicleInfo.title"),
        body: t("faqItems.vehicleInfo.body"),
      },
      {
        id: "earnings",
        title: t("faqItems.earnings.title"),
        body: t("faqItems.earnings.body"),
      },
      {
        id: "support",
        title: t("faqItems.support.title"),
        body: t("faqItems.support.body"),
      },
    ],
    [t]
  );

  const handleToggle = useCallback((index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((current) => (current === index ? null : index));
  }, []);

  return (
    <Fill backgroundColor="Bg Color">
      <Container px={20} flex={1}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}>
          <Column gap={14}>
            {faqs.map((item, index) => (
              <FaqItem
                key={item.id}
                question={item.title}
                answer={item.body}
                expanded={expandedIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </Column>
        </ScrollView>
      </Container>
    </Fill>
  );
}
