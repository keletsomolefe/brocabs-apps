import { AdminFeeActionDtoActionEnum } from "@brocabs/client";
import { Button } from "@brocabs/ui/button";
import { Container, Fill, Image, ImageBackground, Row, ScrollView } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, Dimensions, StyleSheet } from "react-native";
import { profilesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { AssetFiles } from "~/theme/assets";
import { navigateBasedOnSession } from "~/utils/session-navigation";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH - 40;

export default function AdminFeeScreen() {
  const { refetch } = useUser({ enabled: false });
  const router = useRouter();
  // const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Fetch saved cards
  // const { data: savedCards, isLoading: isLoadingCards } = useQuery({
  //   queryKey: ["saved-cards"],
  //   queryFn: async () => {
  //     const { data } = await cardsApi.cardControllerGetMySavedCards();
  //     return data;
  //   },
  // });

  const mutation = useMutation({
    mutationFn: ({ action, cardId }: { action: AdminFeeActionDtoActionEnum; cardId?: string }) =>
      profilesApi.driverProfileControllerUpdateAdminFeeAction({
        adminFeeActionDto: {
          action,
          cardId,
        },
      }),
    onSuccess: async () => {
      const { data } = await refetch();
      console.log("AdminFee: Session after update:", JSON.stringify(data, null, 2));
      navigateBasedOnSession(data);
    },
    onError: (error) => {
      console.error("Failed to update admin fee action", error);
      Alert.alert("Payment Failed", "Something went wrong. Please check your card or try again.");
    },
  });

  const handlePay = () => {
    router.push("/(auth)/add-card-welcome");
  };

  return (
    <Fill style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Container style={styles.header}>
          <Bold color="Primary/50" fontSize={24} lineHeight={48} textTransform="uppercase" center>
            Admin FEE
          </Bold>
          <Regular color="Primary/50" fontSize={14} lineHeight={24} center>
            You can pay this yearly fee now using the bank account you will add or can skip to pay
            with first month&apos;s subscription fee at month end.
          </Regular>
        </Container>
        <Container style={styles.cardContainer}>
          <ImageBackground
            source={AssetFiles.images["card"]}
            contentFit="cover"
            style={styles.cardBackground}>
            <Row style={styles.cardHeader}>
              <Image
                source={AssetFiles.images["logo-light"]}
                contentFit="contain"
                style={styles.logo}
              />
              <Container style={styles.feeBadge}>
                <Bold color="Primary/400" fontSize={12}>
                  12-month Fee
                </Bold>
              </Container>
            </Row>
            <Fill style={styles.cardContent}>
              <Bold fontSize={56} color="Primary/950">
                R300
              </Bold>
              <Regular color="Primary/950" fontSize={16}>
                One Time{" "}
                <Regular color="Primary/700" fontSize={16}>
                  in an
                </Regular>{" "}
                Year
              </Regular>
            </Fill>
          </ImageBackground>
        </Container>
        <Container style={styles.actionsContainer}>
          <Container style={styles.buttonsGap}>
            <Button
              variant="primary"
              radius="rounded"
              size="md"
              label="Pay on Account Approval"
              onPress={handlePay}
            />
            <Button
              variant="light"
              radius="rounded"
              textWeight="normal"
              size="md"
              label={`Pay Later`}
              isLoading={mutation.isPending}
              onPress={() => {
                mutation.mutate({ action: AdminFeeActionDtoActionEnum.Skip });
              }}
            />
          </Container>
          <Regular color="Schemes/Error" fontSize={12} style={styles.disclaimer}>
            *Remember if your account will be out of funds the payment will be charged at the end of
            month
          </Regular>
        </Container>
      </ScrollView>
    </Fill>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["Neutrals/50"],
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 30,
  },
  header: {
    gap: 4,
    alignItems: "center",
  },
  cardContainer: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
  },
  cardBackground: {
    width: CARD_WIDTH,
    height: 205,
    padding: 20,
  },
  cardHeader: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: 63,
    height: 24,
  },
  feeBadge: {
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionsContainer: {
    gap: 10,
  },
  buttonsGap: {
    gap: 10,
  },
  disclaimer: {
    fontStyle: "italic",
    lineHeight: 16,
  },
});
