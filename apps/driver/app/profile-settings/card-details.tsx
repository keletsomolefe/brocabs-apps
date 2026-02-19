import { Button } from "@brocabs/ui/button";
import { Column, Container, Fill, Row, ScrollView, TouchableOpacity } from "@brocabs/ui/layout";
import { Medium, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { z } from "zod";
import { Icon } from "~/shared/ui/icons";

const schema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  expiryMonth: z.string().regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
  expiryYear: z.string().regex(/^\d{2}$/, "Invalid year"),
  cvv: z.string().min(3, "CVV must be at least 3 digits").max(4, "CVV must be at most 4 digits"),
  cardHolder: z.string().min(1, "Card holder name is required"),
});

type FormFields = z.infer<typeof schema>;

export default function CardDetailsScreen() {
  const [saveCard, setSaveCard] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const expiryMonthRef = useRef<TextInput>(null);
  const expiryYearRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<FormFields, any, FormFields>,
    mode: "onChange",
    defaultValues: {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      cardHolder: "",
    },
  });

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
  };

  const handleExpiryMonthChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/\D/g, "");
    // Limit to 2 digits
    const limited = cleaned.substring(0, 2);
    setExpiryMonth(limited);

    // Auto-advance to year when 2 digits are entered
    if (limited.length === 2) {
      expiryYearRef.current?.focus();
    }
  };

  const handleExpiryYearChange = (text: string) => {
    // Only allow digits
    const cleaned = text.replace(/\D/g, "");
    // Limit to 2 digits
    const limited = cleaned.substring(0, 2);
    setExpiryYear(limited);

    // Auto-advance to CVV when 2 digits are entered
    if (limited.length === 2) {
      cvvRef.current?.focus();
    }
  };

  const getCardBrand = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "VISA";
    if (cleaned.startsWith("5")) return "MASTERCARD";
    return "VISA";
  };

  const maskedCardNumber = cardNumber.replace(/\d(?=\d{4})/g, "*");

  const onSubmit = (data: FormFields) => {
    // TODO: Implement card linking logic
    console.log("Link card", { ...data, saveCard });
    router.back();
  };

  return (
    <Fill backgroundColor="Bg Color">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Container px={20} pt={24} gap={24}>
            {/* Form Fields */}
            <Column gap={16}>
              {/* Card Number */}
              <Container gap={8}>
                <Medium fontSize={16} color="Primary/50">
                  Card number
                </Medium>
                <Row
                  borderRadius={20}
                  backgroundColor="white"
                  px={20}
                  height={56}
                  borderWidth={1}
                  borderColor="Input Color"
                  alignItems="center"
                  justifyContent="space-between">
                  <TextInput
                    placeholder="**** **** **** ****"
                    placeholderTextColor={Colors["Neutrals/400"]}
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    keyboardType="numeric"
                    maxLength={19}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontFamily: "BRHendrix-Regular",
                      color: Colors["Primary/50"],
                    }}
                  />
                </Row>
              </Container>

              {/* Expiry and CVV */}
              <Row gap={12}>
                <Container flex={1} gap={8}>
                  <Medium fontSize={16} color="Primary/50">
                    Expiry (MM/YY)
                  </Medium>
                  <Row
                    borderRadius={20}
                    backgroundColor="white"
                    px={20}
                    height={56}
                    borderWidth={1}
                    borderColor="Input Color"
                    alignItems="center"
                    gap={8}>
                    <TextInput
                      ref={expiryMonthRef}
                      placeholder="MM"
                      placeholderTextColor={Colors["Neutrals/400"]}
                      value={expiryMonth}
                      onChangeText={handleExpiryMonthChange}
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="next"
                      onSubmitEditing={() => expiryYearRef.current?.focus()}
                      style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: "BRHendrix-Regular",
                        color: Colors["Primary/50"],
                        textAlign: "center",
                      }}
                    />
                    <Regular fontSize={16} color="Neutrals/400">
                      /
                    </Regular>
                    <TextInput
                      ref={expiryYearRef}
                      placeholder="YY"
                      placeholderTextColor={Colors["Neutrals/400"]}
                      value={expiryYear}
                      onChangeText={handleExpiryYearChange}
                      keyboardType="numeric"
                      maxLength={2}
                      returnKeyType="next"
                      onSubmitEditing={() => cvvRef.current?.focus()}
                      style={{
                        flex: 1,
                        fontSize: 16,
                        fontFamily: "BRHendrix-Regular",
                        color: Colors["Primary/50"],
                        textAlign: "center",
                      }}
                    />
                  </Row>
                </Container>

                <Container flex={1} gap={8}>
                  <Medium fontSize={16} color="Primary/50">
                    CVV
                  </Medium>
                  <TextInput
                    ref={cvvRef}
                    placeholder="***"
                    placeholderTextColor={Colors["Neutrals/400"]}
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    returnKeyType="next"
                    style={{
                      borderRadius: 20,
                      backgroundColor: Colors.white,
                      paddingHorizontal: 20,
                      height: 56,
                      borderWidth: 1,
                      borderColor: Colors["Input Color"],
                      fontSize: 16,
                      fontFamily: "BRHendrix-Regular",
                      color: Colors["Primary/50"],
                    }}
                  />
                </Container>
              </Row>

              {/* Card Holder */}
              <Container gap={8}>
                <Medium fontSize={16} color="Primary/50">
                  Card Holder
                </Medium>
                <TextInput
                  placeholder="John Doe"
                  placeholderTextColor={Colors["Neutrals/400"]}
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  style={{
                    borderRadius: 20,
                    backgroundColor: Colors.white,
                    paddingHorizontal: 20,
                    height: 56,
                    borderWidth: 1,
                    borderColor: Colors["Input Color"],
                    fontSize: 16,
                    fontFamily: "BRHendrix-Regular",
                    color: Colors["Primary/50"],
                    textTransform: "uppercase",
                  }}
                />
              </Container>

              {/* Save Card Checkbox */}
              <TouchableOpacity
                onPress={() => setSaveCard(!saveCard)}
                activeOpacity={0.7}
                flexDirection="row"
                alignItems="center"
                gap={12}>
                <Container
                  width={24}
                  height={24}
                  borderRadius={6}
                  borderWidth={saveCard ? 0 : 2}
                  borderColor={saveCard ? "transparent" : "Neutrals/300"}
                  backgroundColor={saveCard ? "Primary/600" : "transparent"}
                  justifyContent="center"
                  alignItems="center">
                  {saveCard && <Icon name="check" width={16} height={16} color={Colors.white} />}
                </Container>
                <Regular fontSize={14} color="Primary/50">
                  Save this card for faster payments.
                </Regular>
              </TouchableOpacity>

              {/* Link Card Button */}
              <Button
                label="Link Card"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                radius="rounded"
                size="lg"
              />
            </Column>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Fill>
  );
}
