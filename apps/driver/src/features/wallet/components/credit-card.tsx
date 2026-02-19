import { Container, TouchableOpacity } from "@brocabs/ui/layout";
import { Medium, Regular } from "@brocabs/ui/text";
import { Image, ImageBackground } from "react-native";

enum CardType {
  VISA = "visa",
  MASTERCARD = "mastercard",
  AMEX = "amex",
  DISCOVER = "discover",
  DINERS = "diners",
  JCB = "jcb",
  MAESTRO = "maestro",
  UNIONPAY = "unionpay",
  GENERIC = "generic",
  UNKNOWN = "unknown",
}

const CardTypeMap: Record<CardType, number | undefined> = {
  [CardType.VISA]: require("~/assets/images/credit-cards/Visa.png"),
  [CardType.MASTERCARD]: require("~/assets/images/credit-cards/Mastercard.png"),
  [CardType.AMEX]: require("~/assets/images/credit-cards/AMEX.png"),
  [CardType.DISCOVER]: require("~/assets/images/credit-cards/Discover.png"),
  [CardType.DINERS]: require("~/assets/images/credit-cards/DinersClub.png"),
  [CardType.JCB]: require("~/assets/images/credit-cards/JCB.png"),
  [CardType.MAESTRO]: require("~/assets/images/credit-cards/Maestro.png"),
  [CardType.UNIONPAY]: require("~/assets/images/credit-cards/UnionPay.png"),
  [CardType.GENERIC]: require("~/assets/images/credit-cards/Visa.png"), // Fallback to Visa icon
  [CardType.UNKNOWN]: undefined,
};

// Detect card type from card number (first digits)
const detectCardType = (maskedNumber?: string): CardType => {
  if (!maskedNumber) return CardType.GENERIC;

  // Extract only digits from the masked number (remove asterisks, spaces, etc.)
  const digitsOnly = maskedNumber.replace(/\D/g, "");

  if (digitsOnly.length === 0) return CardType.GENERIC;

  const firstDigit = digitsOnly.charAt(0);
  const firstTwo = digitsOnly.substring(0, 2);
  const firstFour = digitsOnly.substring(0, 4);
  const firstSix = digitsOnly.substring(0, 6);

  // Visa: starts with 4
  if (firstDigit === "4") return CardType.VISA;
  // Mastercard: starts with 51-55 or 2221-2720
  if (firstTwo >= "51" && firstTwo <= "55") return CardType.MASTERCARD;
  if (firstFour >= "2221" && firstFour <= "2720") return CardType.MASTERCARD;
  // Amex: starts with 34 or 37
  if (firstTwo === "34" || firstTwo === "37") return CardType.AMEX;
  // Discover: starts with 6011, 622126-622925, 644-649, or 65
  if (firstFour === "6011") return CardType.DISCOVER;
  if (firstTwo === "65") return CardType.DISCOVER;
  if (firstSix >= "622126" && firstSix <= "622925") return CardType.DISCOVER;
  if (firstTwo >= "64" && firstTwo <= "65") return CardType.DISCOVER;
  // Diners: starts with 36, 38, or 300-305
  if (firstTwo === "36" || firstTwo === "38") return CardType.DINERS;
  if (firstFour >= "300" && firstFour <= "305") return CardType.DINERS;
  // JCB: starts with 3528-3589
  if (firstFour >= "3528" && firstFour <= "3589") return CardType.JCB;
  // Maestro: starts with 5018, 5020, 5038, 5893, 6304, 6759, 6761-6763
  if (["5018", "5020", "5038", "5893", "6304", "6759"].includes(firstFour)) return CardType.MAESTRO;
  if (firstFour >= "6761" && firstFour <= "6763") return CardType.MAESTRO;
  // UnionPay: starts with 62
  if (firstTwo === "62") return CardType.UNIONPAY;

  return CardType.GENERIC;
};

// Format card number with spacing (every 4 digits)
// Standard format: **** **** **** 1234 (only last 4 digits visible)
const formatCardNumber = (maskedNumber: string): string => {
  // Extract only digits from the masked number
  const digitsOnly = maskedNumber.replace(/\D/g, "");

  // Get last 4 digits
  const lastFour = digitsOnly.slice(-4);

  // If we don't have at least 4 digits, return as is with spacing
  if (digitsOnly.length < 4) {
    return maskedNumber.replace(/(.{4})/g, "$1 ").trim();
  }

  // Standard 16-digit card format: **** **** **** 1234
  // For cards with last 4 digits, show: **** **** **** XXXX
  return `**** **** **** ${lastFour}`;
};

export interface CreditCardProps {
  maskedNumber: string;
  holderName: string;
  expiry: string;
  onRemove?: () => void;
}

export function CreditCard({ maskedNumber, holderName, expiry, onRemove }: CreditCardProps) {
  const cardType = detectCardType(maskedNumber);
  const cardIconSource = CardTypeMap[cardType];

  return (
    <Container gap={10} width="100%">
      <ImageBackground
        source={require("~/assets/images/credit-card.png")}
        imageStyle={{ borderRadius: 20 }}
        style={{
          borderRadius: 20,
          padding: 20,
          height: 200,
          justifyContent: "space-between",
          overflow: "hidden",
        }}>
        <Container flexDirection="row" justifyContent="space-between" alignItems="flex-start">
          {/* Chip placeholder */}
          <Container
            width={40}
            height={30}
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            borderRadius={4}
          />
          {cardIconSource && (
            <Image source={cardIconSource} style={{ width: 60, height: 40 }} resizeMode="contain" />
          )}
        </Container>

        <Container gap={20}>
          <Medium color="white" fontSize={24} style={{ letterSpacing: 2 }}>
            {formatCardNumber(maskedNumber)}
          </Medium>

          <Container flexDirection="row" justifyContent="space-between">
            <Container>
              <Regular color="white" fontSize={12} style={{ opacity: 0.8 }}>
                Card Holder Name
              </Regular>
              <Regular color="white" fontSize={16}>
                {holderName}
              </Regular>
            </Container>
            <Container>
              <Regular color="white" fontSize={12} style={{ opacity: 0.8 }}>
                Exp. Date
              </Regular>
              <Regular color="white" fontSize={16}>
                {expiry}
              </Regular>
            </Container>
          </Container>
        </Container>
      </ImageBackground>

      {onRemove && (
        <TouchableOpacity onPress={onRemove}>
          <Container
            backgroundColor="Neutrals/100"
            borderRadius={20}
            height={48}
            alignItems="center"
            justifyContent="center">
            <Regular color="Primary/600" fontSize={18}>
              Remove Card
            </Regular>
          </Container>
        </TouchableOpacity>
      )}
    </Container>
  );
}
