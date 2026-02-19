import { Medium } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useCallback, useMemo, useState } from "react";
import { LayoutAnimation, Platform, TouchableOpacity, UIManager } from "react-native";

import { Column, Container, Fill, Row, ScrollView } from "@brocabs/ui/layout";
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
      <Container backgroundColor="white" borderRadius={20} px={22} py={20}>
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
            <Icon name="next-ltr" width={17} height={17} color={Colors["Primary/600"]} />
          </Container>
        </Row>
        {expanded && (
          <Column mt={12}>
            <RichText color="Neutrals/400">{answer}</RichText>
          </Column>
        )}
      </Container>
    </TouchableOpacity>
  );
};

export default function FaqsScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs = useMemo(
    () => [
      {
        id: "what-is-brocabs",
        title: "What is this app?",
        body: "BroCabs is a ride-hailing platform that connects you with vetted drivers. Book rides, track your trips, manage payments, and access support all in one convenient app.",
      },
      {
        id: "how-it-works",
        title: "How does it work?",
        body: "Simply enter your pickup and destination locations, select your preferred ride type, and confirm your booking. A nearby driver will accept your request and pick you up. You can track your ride in real-time and pay seamlessly through the app.",
      },
      {
        id: "ride-types",
        title: "What ride types are available?",
        body: "We offer various ride options including Little Bro, Big Bro, Big Bro Plus, Super Bro, Bro Scholar (for students), and Bro Fam (for families). Each option has different vehicle sizes and pricing to suit your needs.",
      },
      {
        id: "payment",
        title: "How do I pay for rides?",
        body: "You can pay using your wallet balance, saved cards, or cash (where available). Add funds to your wallet or link a payment method in the Wallet section. All transactions are secure and encrypted.",
      },
      {
        id: "support",
        title: "How can I get help?",
        body: "Use the Contact Support option in profile settings to reach our team. You can also check the Help Center for troubleshooting tips, submit complaints, or view your ride history for trip details.",
      },
      {
        id: "bro-scholar",
        title: "What is Bro Scholar?",
        body: "Bro Scholar is our student discount program. Verified students can enjoy special discounted rates on rides. Apply through the Bro Scholar section with your student ID and institution details.",
      },
      {
        id: "cancellation",
        title: "Can I cancel a ride?",
        body: "Yes, you can cancel a ride before the driver arrives. Cancellation fees may apply depending on timing. Check the cancellation policy in the app for details.",
      },
      {
        id: "safety",
        title: "How does BroCabs ensure rider safety?",
        body: "All drivers undergo background checks and vehicle inspections. You can share your ride details with emergency contacts, use the SOS feature, and rate your driver after each trip. We continuously monitor and improve safety measures.",
      },
    ],
    []
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
