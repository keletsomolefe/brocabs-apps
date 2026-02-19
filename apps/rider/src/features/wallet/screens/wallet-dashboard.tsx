import { SavedCardDto, WalletBalanceDto } from "@brocabs/client";
import { getShadow } from "@brocabs/ui";
import { Column, Container, Row, ScrollView, TouchableOpacity } from "@brocabs/ui/layout";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import {
  maskCardNumber,
  Transaction,
  TransactionStatus,
  TransactionType,
} from "~/features/wallet/types";
import { useTranslation } from "~/i18n/LocaleContext";

const formatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

const CARD_GRADIENTS = [
  ["#5905ff", "#9d6eff"],
  ["#0a021a", "#2a2a2a"],
  ["#ff5905", "#ff9d6e"],
];

type TransactionTab = "recent" | "payable";

// Mock transactions for Recent Transactions tab
const MOCK_RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: TransactionType.RIDE,
    status: TransactionStatus.COMPLETED,
    amount: 50.0,
    date: new Date("2024-06-04T09:08:00"),
    description: "Cape Town to City Block",
    from: "Cape Town",
    to: "City Block",
  },
  {
    id: "2",
    type: TransactionType.RIDE,
    status: TransactionStatus.COMPLETED,
    amount: 35.0,
    date: new Date("2024-06-04T09:08:00"),
    description: "Cape Town to City Block",
    from: "Cape Town",
    to: "City Block",
  },
  {
    id: "3",
    type: TransactionType.RECHARGE,
    status: TransactionStatus.COMPLETED,
    amount: 200.0,
    date: new Date("2024-06-04T09:08:00"),
    description: "Recharged Wallet",
  },
];

// Mock transactions for Payable tab
const MOCK_PAYABLE_TRANSACTIONS: Transaction[] = [
  {
    id: "4",
    type: TransactionType.RIDE,
    status: TransactionStatus.PENDING,
    amount: 50.0,
    date: new Date("2024-06-04T09:08:00"),
    description: "Cape Town to City Block",
    from: "Cape Town",
    to: "City Block",
  },
];

const shadow = getShadow(1, "penumbra");

export function WalletDashboardScreen({
  mySavedCards,
  transactions,
  walletBalance,
}: {
  mySavedCards?: SavedCardDto[];
  transactions?: Transaction[];
  walletBalance?: WalletBalanceDto;
}) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TransactionTab>("recent");

  const { width } = useWindowDimensions();
  const cardWidth = width;
  const parallaxScrollingOffset = 0.05 * cardWidth + 50;

  // TODO: Fetch these from API
  const walletAmount = walletBalance?.balance || 0;

  const filteredTransactions =
    activeTab === "recent"
      ? transactions && transactions.length > 0
        ? transactions.slice(0, 10)
        : MOCK_RECENT_TRANSACTIONS
      : transactions && transactions.length > 0
        ? transactions.filter((tx) => tx.status === "PENDING")
        : MOCK_PAYABLE_TRANSACTIONS;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      <Column gap={20}>
        {/* Available Balance Card */}
        <Container
          backgroundColor="white"
          style={shadow}
          borderRadius={20}
          p={20}
          mx={20}
          mt={20}
          gap={16}>
          <Column gap={16} alignItems="center" py={2}>
            <Column gap={16}>
              <Medium fontSize={12} color="Neutrals/400" center>
                {t("common.availableBalance")}
              </Medium>
              <Bold fontSize={24} color="Primary/50" center>
                {formatter.format(walletAmount)}
              </Bold>
            </Column>
          </Column>

          <TouchableOpacity
            alignSelf="center"
            backgroundColor="white"
            borderWidth={1}
            borderColor="Primary/600"
            borderRadius={16}
            height={48}
            px={4}
            justifyContent="center"
            alignItems="center"
            onPress={() => router.push("/home/recharge")}>
            <SemiBold fontSize={16} color="Primary/600">
              + {t("common.rechargeWallet")}
            </SemiBold>
          </TouchableOpacity>
        </Container>

        {/* My Cards */}
        <Column gap={10}>
          <Row justifyContent="space-between" alignItems="center" px={20}>
            <Regular fontSize={18} color="Primary/50">
              {t("common.myCards")}
            </Regular>
            <TouchableOpacity onPress={() => router.push("/profile-settings/payment-methods")}>
              <Regular fontSize={14} color="Primary/400">
                {t("wallet.viewAllCards")}
              </Regular>
            </TouchableOpacity>
          </Row>
          {mySavedCards && mySavedCards.length > 0 ? (
            <Carousel
              loop={false}
              width={width}
              height={width * 0.5714}
              autoPlay={false}
              data={mySavedCards}
              scrollAnimationDuration={1000}
              mode="parallax"
              modeConfig={{
                parallaxScrollingScale: 0.86,
                parallaxScrollingOffset,
              }}
              renderItem={({ item, index }) => (
                <Container alignItems="center" justifyContent="center">
                  <LinearGradient
                    colors={
                      (CARD_GRADIENTS[index % CARD_GRADIENTS.length] as [string, string]) || [
                        "#000",
                        "#333",
                      ]
                    }
                    style={{
                      width: cardWidth,
                      height: width * 0.5714,
                      borderRadius: 20,
                      padding: 20,
                      justifyContent: "space-between",
                    }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <Row justifyContent="space-between" alignItems="flex-start">
                      {/* Chip Icon Placeholder */}
                      <Container
                        width={32}
                        height={24}
                        backgroundColor="Neutrals/200"
                        borderRadius={4}
                        opacity={0.5}
                      />
                      {/* Card Type Icon Placeholder */}
                      <Container
                        width={30}
                        height={20}
                        backgroundColor="Neutrals/200"
                        borderRadius={4}
                        opacity={0.5}
                      />
                    </Row>

                    <Column gap={10}>
                      <Medium fontSize={18} color="white" style={{ letterSpacing: 2 }}>
                        {maskCardNumber(item.maskedNumber)}
                      </Medium>
                      <Row justifyContent="space-between">
                        <Column>
                          <Regular fontSize={9} color="white">
                            {t("common.cardHolderName")}
                          </Regular>
                          <Regular fontSize={15} color="white">
                            {item.name}
                          </Regular>
                        </Column>
                        <Column>
                          <Regular fontSize={9} color="white">
                            {t("common.expDate")}
                          </Regular>
                          <Regular fontSize={15} color="white">
                            {item.expiryMonth}/{item.expiryYear}
                          </Regular>
                        </Column>
                      </Row>
                    </Column>
                  </LinearGradient>
                </Container>
              )}
            />
          ) : (
            <Container px={20}>
              <Regular fontSize={14} color="Neutrals/400">
                {t("wallet.noCardsYet")}
              </Regular>
            </Container>
          )}
        </Column>

        {/* Transaction Tabs */}
        <Row gap={12} px={20}>
          <TouchableOpacity
            flex={1}
            onPress={() => setActiveTab("recent")}
            backgroundColor={activeTab === "recent" ? "Primary/600" : "transparent"}
            borderWidth={activeTab === "recent" ? 0 : 1}
            borderColor="Primary/400"
            borderRadius={20}
            height={40}
            justifyContent="center"
            alignItems="center">
            <Regular fontSize={14} color={activeTab === "recent" ? "white" : "Primary/400"}>
              {t("common.recentTransactions")}
            </Regular>
          </TouchableOpacity>
          <TouchableOpacity
            flex={1}
            onPress={() => setActiveTab("payable")}
            backgroundColor={activeTab === "payable" ? "Primary/600" : "transparent"}
            borderWidth={activeTab === "payable" ? 0 : 1}
            borderColor="Primary/400"
            borderRadius={20}
            height={40}
            justifyContent="center"
            alignItems="center">
            <Regular
              fontSize={14}
              color={activeTab === "payable" ? "white" : "Primary/400"}
              numberOfLines={1}>
              {t("common.payable")}
            </Regular>
          </TouchableOpacity>
        </Row>

        {/* Transaction List */}
        <Column gap={12} px={20}>
          {filteredTransactions && filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => {
              const isPending = tx.status === "PENDING";
              const isRecharge = tx.type === "RECHARGE";
              const isRide = tx.type === "RIDE";
              // Alternate between purple and orange for ride transactions
              const circleColor =
                isRide && index % 2 === 0
                  ? Colors["Primary/400"]
                  : isRide
                    ? Colors["Warning/400"]
                    : isRecharge
                      ? Colors["Primary/400"]
                      : Colors["Warning/400"];

              return (
                <Container
                  key={tx.id}
                  backgroundColor="white"
                  borderRadius={20}
                  style={shadow}
                  p={16}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Row gap={12} alignItems="center" flex={1}>
                    <Container
                      width={20}
                      height={20}
                      borderRadius={10}
                      borderWidth={4}
                      borderColor={circleColor}
                      justifyContent="center"
                      alignItems="center"></Container>
                    <Column gap={4} flex={1}>
                      <Regular fontSize={12} color="Neutrals/400">
                        {tx.date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                        {isRide && " - 25km"}
                      </Regular>
                      <Medium fontSize={14} color="Primary/50">
                        {isRecharge
                          ? t("common.rechargedWallet")
                          : tx.description ||
                            `${tx.from || t("common.unknown")} ${t("common.to")} ${tx.to || t("common.unknown")}`}
                      </Medium>
                    </Column>
                  </Row>
                  {activeTab === "recent" ? (
                    <Regular fontSize={14} color={isRecharge ? "Success/400" : "Secondary/500"}>
                      {isRecharge ? "+" : "-"}
                      {formatter.format(tx.amount)}
                    </Regular>
                  ) : (
                    <Container
                      px={10}
                      py={1}
                      borderRadius={12}
                      backgroundColor={isPending ? "Warning/400" : "Success/400"}>
                      <Regular fontSize={12} color="white">
                        {isPending ? t("common.pending") : t("common.completed")}
                      </Regular>
                    </Container>
                  )}
                </Container>
              );
            })
          ) : (
            <Container backgroundColor="white" borderRadius={20} p={20} alignItems="center">
              <Regular fontSize={14} color="Neutrals/400">
                {t("common.noTransactionsFound")}
              </Regular>
            </Container>
          )}
        </Column>
      </Column>
    </ScrollView>
  );
}
