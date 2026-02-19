import { Button } from "@brocabs/ui/button";
import { Container, Fill } from "@brocabs/ui/layout";
import { Bold, Medium, Regular } from "@brocabs/ui/text";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { CardIllustration } from "~/assets/images/onboarding/card-illustration";

export default function AddCardWelcomeScreen() {
  const router = useRouter();

  const handleAddCard = () => {
    router.push("/(auth)/add-card-method");
  };

  return (
    <Fill backgroundColor="Neutrals/50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Content */}
        <Container flex={1} justifyContent="space-between" px={20} pt={0} pb={20}>
          {/* Centered Content */}
          <Container flex={1} justifyContent="center" alignItems="center">
            <Container gap={30} alignItems="center" width="100%">
              {/* Card Illustration */}
              <Container justifyContent="center" alignItems="center">
                <CardIllustration width={175} height={250} />
              </Container>

              {/* Title and Description */}
              <Container gap={4} alignItems="center" width="100%">
                <Bold fontSize={20} lineHeight={40} color="Primary/50" textAlign="center">
                  Add a Card for Payments
                </Bold>
                <Regular fontSize={18} lineHeight={24} color="Neutrals/400" textAlign="center">
                  Securely link a card to pay and top up instantly. Your information remains secured
                </Regular>
              </Container>

              {/* Add Card Button */}
              <Container width="100%">
                <Button
                  label="Add Card"
                  onPress={handleAddCard}
                  variant="primary"
                  radius="rounded"
                />
              </Container>
            </Container>
          </Container>

          {/* Help Text */}
          <Container alignItems="center">
            <Medium fontSize={12} lineHeight={16} color="Primary/50" textAlign="center">
              <Medium
                fontSize={12}
                lineHeight={16}
                color="Primary/600"
                style={{ textDecorationLine: "underline" }}>
                Need help?
              </Medium>
              {" Contact support from Settings → "}
              <Medium
                fontSize={12}
                lineHeight={16}
                color="Primary/600"
                style={{ textDecorationLine: "underline" }}>
                Help
              </Medium>
            </Medium>
          </Container>
        </Container>
      </ScrollView>
    </Fill>
  );
}
