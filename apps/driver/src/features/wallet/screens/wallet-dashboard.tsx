import { WalletBalanceDto } from "@brocabs/client";
import { getShadow } from "@brocabs/ui";
import { Column, Container, Fill, Row, ScrollView, TouchableOpacity } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CreditCard } from "~/features/wallet/components";
import { useSavedCards } from "~/features/wallet/hooks";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { Transaction, TransactionStatus, TransactionType } from "../types";

const formatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

type TransactionTab = "recent" | "payable";
type DateFilter = "today" | "thisWeek" | "thisMonth" | "last3Months" | "allTime";

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
    type: TransactionType.RIDE,
    status: TransactionStatus.COMPLETED,
    amount: 200.0,
    date: new Date("2024-06-04T09:08:00"),
    description: "Cape Town to City Block",
    from: "Cape Town",
    to: "City Block",
  },
];

// Mock transactions for Payable tab
const MOCK_PAYABLE_TRANSACTIONS: Transaction[] = [
  {
    id: "4",
    type: TransactionType.WITHDRAWAL,
    status: TransactionStatus.PENDING,
    amount: 50.0,
    date: new Date("2024-06-04T09:08:00"),
    description: "Requested R 50.00 to **** 4343",
  },
  {
    id: "5",
    type: TransactionType.WITHDRAWAL,
    status: TransactionStatus.PENDING,
    amount: 100.0,
    date: new Date("2024-06-03T14:30:00"),
    description: "Requested R 100.00 to **** 4343",
  },
];

const shadow = getShadow(1, "penumbra");

const DATE_FILTERS: DateFilter[] = ["today", "thisWeek", "thisMonth", "last3Months", "allTime"];

export function WalletDashboardScreen({
  transactions,
  walletBalance,
}: {
  transactions?: Transaction[];
  walletBalance?: WalletBalanceDto;
}) {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<TransactionTab>("recent");
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>("today");
  const filterBottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const savedCardsQuery = useSavedCards();

  // TODO: Fetch these from API
  const totalEarnings = walletBalance?.balance || 0;
  const walletAmount = walletBalance?.balance || 0;
  const cashAmount = 0; // TODO: Calculate from transactions
  const totalTrips = 32; // TODO: Fetch from API
  const savedCards = savedCardsQuery.data || [];

  const filteredTransactions =
    activeTab === "recent"
      ? transactions && transactions.length > 0
        ? transactions.slice(0, 10)
        : MOCK_RECENT_TRANSACTIONS
      : transactions && transactions.length > 0
        ? transactions.filter((tx) => tx.status === "PENDING")
        : MOCK_PAYABLE_TRANSACTIONS;

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        <Column gap={20} pt={20}>
          {/* Total Earnings Card */}
          <Container
            backgroundColor="white"
            style={shadow}
            borderRadius={20}
            p={20}
            mx={20}
            gap={10}>
            <Row justifyContent="space-between" alignSelf="flex-end" alignItems="center">
              <TouchableOpacity
                onPress={() => filterBottomSheetRef.current?.present()}
                flexDirection="row"
                alignItems="center"
                gap={6}
                px={12}
                py={1}
                borderRadius={20}
                borderWidth={1}
                borderColor="Primary/400">
                <Regular fontSize={12} color="Primary/50">
                  {t(`wallet.filters.${selectedFilter}`)}
                </Regular>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color={Colors["Primary/50"]}
                />
              </TouchableOpacity>
            </Row>
            <Column gap={16} alignItems="center">
              <Container
                width={40}
                height={40}
                borderRadius={10}
                backgroundColor="Secondary/400"
                justifyContent="center"
                alignItems="center">
                <Icon name="wallet" width={24} height={24} color={Colors.black} />
              </Container>
              <Column gap={8}>
                <Medium fontSize={12} color="Neutrals/400">
                  {t("wallet.totalEarnings")}
                </Medium>
                <Bold fontSize={24} color="Primary/50">
                  {formatter.format(totalEarnings)}
                </Bold>
              </Column>
            </Column>

            <TouchableOpacity
              alignSelf="center"
              backgroundColor="Primary/600"
              borderRadius={16}
              height={48}
              px={4}
              justifyContent="center"
              alignItems="center"
              onPress={() => router.push("/home/withdrawal")}>
              <SemiBold fontSize={16} color="white">
                {t("wallet.withdraw")}
              </SemiBold>
            </TouchableOpacity>
          </Container>

          {/* Summary Cards */}
          <Row gap={12} px={20}>
            {/* Total Trips */}
            <Container
              flex={1}
              backgroundColor="white"
              style={shadow}
              borderRadius={20}
              p={16}
              alignItems="center"
              gap={8}>
              <Container
                width={48}
                height={48}
                borderRadius={12}
                backgroundColor="Primary/900"
                justifyContent="center"
                alignItems="center">
                <Icon name="document2" width={24} height={24} color={Colors.black} />
              </Container>
              <Regular fontSize={12} color="Neutrals/400">
                {t("wallet.totalTrips")}
              </Regular>
              <Bold fontSize={14} color="Primary/50">
                {totalTrips}
              </Bold>
            </Container>

            {/* Wallet */}
            <Container
              flex={1}
              backgroundColor="white"
              borderRadius={20}
              p={16}
              alignItems="center"
              style={shadow}
              gap={8}>
              <Container
                width={48}
                height={48}
                borderRadius={12}
                backgroundColor="Warning/200"
                justifyContent="center"
                alignItems="center">
                <Icon name="wallet2" width={24} height={24} color={Colors.black} />
              </Container>
              <Regular fontSize={12} color="Neutrals/400">
                {t("common.wallet")}
              </Regular>
              <Bold fontSize={14} color="Primary/50">
                {formatter.format(walletAmount)}
              </Bold>
            </Container>

            {/* Cash */}
            <Container
              flex={1}
              backgroundColor="white"
              borderRadius={20}
              style={shadow}
              p={16}
              alignItems="center"
              gap={8}>
              <Container
                width={48}
                height={48}
                borderRadius={12}
                backgroundColor="Success/200"
                justifyContent="center"
                alignItems="center">
                <Icon name="cash-solid" width={24} height={24} color={Colors.black} />
              </Container>
              <Regular fontSize={12} color="Neutrals/400">
                {t("common.cash")}
              </Regular>
              <Bold fontSize={14} color="Primary/50">
                {formatter.format(cashAmount)}
              </Bold>
            </Container>
          </Row>

          {/* My Cards */}
          {savedCards.length > 0 && (
            <Column gap={10} px={20}>
              <Row justifyContent="space-between" alignItems="center">
                <Regular fontSize={18} color="Primary/50">
                  {t("common.myCards")}
                </Regular>
                <TouchableOpacity onPress={() => router.push("/profile-settings/payment-methods")}>
                  <Regular fontSize={14} color="Primary/400">
                    {t("wallet.viewAllCards")}
                  </Regular>
                </TouchableOpacity>
              </Row>
              <Container
                backgroundColor="white"
                borderRadius={20}
                style={shadow}
                p={2}
                alignItems="center">
                <CreditCard
                  maskedNumber={savedCards[0].maskedNumber}
                  holderName={savedCards[0].name}
                  expiry={`${String(savedCards[0].expiryMonth).padStart(2, "0")}/${String(savedCards[0].expiryYear).slice(-2)}`}
                />
              </Container>
            </Column>
          )}

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
                {t("wallet.recentTransactions")}
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
              <Regular fontSize={14} color={activeTab === "payable" ? "white" : "Primary/400"}>
                {t("wallet.payable")}
              </Regular>
            </TouchableOpacity>
          </Row>

          {/* Transaction List */}
          <Column gap={12} px={20}>
            {filteredTransactions && filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, index) => {
                const isPending = tx.status === "PENDING";
                const isWithdrawal = tx.type === "WITHDRAWAL";
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
                            ? t("wallet.rechargedWallet")
                            : isWithdrawal
                              ? tx.description ||
                                `Requested ${formatter.format(tx.amount)} to **** 4343`
                              : tx.description ||
                                `${tx.from || "Unknown"} to ${tx.to || "Unknown"}`}
                        </Medium>
                      </Column>
                    </Row>
                    {activeTab === "recent" ? (
                      <Regular fontSize={14} color="Success/400">
                        +{formatter.format(tx.amount)}
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
                  {t("wallet.noTransactionsFound")}
                </Regular>
              </Container>
            )}
          </Column>
        </Column>
      </ScrollView>

      {/* Date Filter Bottom Sheet */}
      <BottomSheetModal
        ref={filterBottomSheetRef}
        enableDynamicSizing={true}
        backdropComponent={Backdrop}
        handleIndicatorStyle={{ backgroundColor: Colors["Neutrals/100"] }}
        backgroundStyle={{
          backgroundColor: Colors.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
        enablePanDownToClose>
        <BottomSheetView
          style={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 20,
            paddingTop: 20,
          }}>
          <Column gap={16}>
            <SemiBold fontSize={20} color="Primary/50">
              {t("wallet.filterByDate")}
            </SemiBold>
            <Column gap={8}>
              {DATE_FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => {
                    setSelectedFilter(filter);
                    filterBottomSheetRef.current?.dismiss();
                  }}>
                  <Container
                    backgroundColor={selectedFilter === filter ? "Primary/600" : "transparent"}
                    borderRadius={32}
                    px={16}
                    py={3}
                    borderWidth={selectedFilter === filter ? 0 : 1}
                    borderColor="Primary/400">
                    <Medium
                      fontSize={16}
                      color={selectedFilter === filter ? "white" : "Primary/50"}>
                      {t(`wallet.filters.${filter}`)}
                    </Medium>
                  </Container>
                </TouchableOpacity>
              ))}
            </Column>
          </Column>
        </BottomSheetView>
      </BottomSheetModal>
    </Fill>
  );
}
