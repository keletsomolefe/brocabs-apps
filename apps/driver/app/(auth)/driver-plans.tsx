import { useMutation } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { processApiError } from "@brocabs/client";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill, Row, ScrollView } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { PressableScale } from "pressto";
import { chargebeeApi, queryClient, subscriptionsApi } from "~/api";
import { PlanDetail } from "~/features/authentication/components/driver-plans";
import { useUser } from "~/hooks/use-auth";
import { usePlans } from "~/hooks/use-plans";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";
import { AssetFiles } from "~/theme/assets";
import { navigateBasedOnSession } from "~/utils/session-navigation";

const MAX_POLL_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 2000;

export default function DriverPlansScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const { t } = useLocale();

  const { data: plans, isLoading, isError, refetch } = usePlans();
  const userQuery = useUser({ enabled: false });

  // Ensure modal is hidden when component unmounts
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      ModalBox.hide();
      WebBrowser.coolDownAsync();
    };
  }, []);

  const checkSubscriptionStatus = async (): Promise<boolean> => {
    // 1. Refetch the user session
    await userQuery.refetch();
    // 2. Invalidate and refetch subscription data
    await queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
    try {
      const subscription = await subscriptionsApi.subscriptionControllerGetCurrentSubscription();
      // 3. Check if the subscription is active
      return subscription.status === "ACTIVE";
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) =>
      chargebeeApi.chargebeeControllerCreateCheckout({
        createCheckoutDto: { planId },
      }),
    onSuccess: async (data) => {
      console.log("DriverPlans: Checkout URL received", data.url);

      // Wait for modal to fully close before opening browser
      await new Promise<void>((resolve) => {
        ModalBox.update("popup", {
          onHide: () => {
            resolve();
            return true;
          },
        });
        ModalBox.hide();
      });

      if (data.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          "brocabs-driver://subscription-complete",
          {
            preferEphemeralSession: true,
          }
        );

        // After browser closes, we refresh the user session to check if subscription is active
        if (result.type === "success") {
          // Check if the user was redirected to the cancel URL
          if (result.url.includes("subscription-cancel")) {
            ModalBox.show("popup", {
              content: (
                <Dialog.Error
                  title="Transaction Cancelled"
                  description="The subscription process was cancelled."
                  image={AssetFiles.images["subscription-failed"]}
                  onPress={() => ModalBox.hide()}
                />
              ),
            });
            return;
          }

          ModalBox.show("popup", {
            content: (
              <Dialog.Loader
                source={Lottie.loader}
                title={t("common.processing")}
                description={t("subscription.verifyingStatus")}
              />
            ),
          });

          let attempts = 0;
          const poll = setInterval(async () => {
            attempts++;
            const isActive = await checkSubscriptionStatus();
            if (isActive) {
              clearInterval(poll);
              ModalBox.hide(); // Hide loading modal
              const { data: session } = await userQuery.refetch();
              if (session) {
                navigateBasedOnSession(session);
              }
            } else if (attempts >= MAX_POLL_ATTEMPTS) {
              clearInterval(poll);
              ModalBox.show("popup", {
                content: (
                  <Dialog.Error
                    title="Verification Timeout"
                    description="We couldn't confirm your subscription status. Please contact support if you were charged."
                    image={AssetFiles.images["subscription-failed"]}
                    onPress={() => ModalBox.hide()}
                  />
                ),
              });
            }
          }, POLL_INTERVAL_MS);
        } else if (result.type === "cancel") {
          ModalBox.show("popup", {
            content: (
              <Dialog.Error
                title="Transaction Cancelled"
                description="The subscription process was cancelled."
                image={AssetFiles.images["subscription-failed"]}
                onPress={() => ModalBox.hide()}
              />
            ),
          });
        }
      }
    },
    onError: async (error) => {
      ModalBox.hide();
      const apiError = await processApiError(error);
      ModalBox.show("popup", {
        content: (
          <Dialog.Error
            title="Transaction Failed"
            description={apiError.message}
            image={AssetFiles.images["subscription-failed"]}
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    },
  });

  const handleSelectPlan = (planId: string) => {
    ModalBox.show("popup", {
      content: (
        <Dialog.Loader
          source={Lottie.loader}
          title={t("common.processing")}
          description={t("subscription.processingDesc")}
        />
      ),
    });
    subscribeMutation.mutate(planId);
  };

  const routes = plans?.map((plan) => ({ key: plan.id, title: plan.name })) || [];
  const selectedPlan = plans?.find((p) => p.id === routes[index]?.key);

  return (
    <Fill backgroundColor="Neutrals/50">
      {isLoading ? (
        <Container flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size="large" />
        </Container>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 + insets.bottom }}
          showsVerticalScrollIndicator={false}>
          <Container px={20} pt={20} gap={4} alignItems="center">
            <Icon name="crown-outline" width={78} height={78} color={Colors["Warning/400"]} />
            <Bold color="Primary/50" fontSize={24} textTransform="uppercase" center>
              {t("subscription.screenTitle")}
            </Bold>
            <Regular color="Primary/50" fontSize={14} center>
              {t("subscription.screenSubtitle")}
            </Regular>
          </Container>

          <Container mt={28}>
            <Row height={45} borderRadius={10000} gap={10} alignItems="center" px={20}>
              {routes.map((route, i) => {
                const isActive = index === i;
                return (
                  <PressableScale key={route.key} onPress={() => setIndex(i)} style={{ flex: 1 }}>
                    <Container
                      backgroundColor={isActive ? "Primary/600" : undefined}
                      borderRadius={100}
                      px={10}
                      py={10}
                      alignItems="center"
                      justifyContent="center"
                      style={
                        !isActive && {
                          borderWidth: 1,
                          borderColor: Colors["Primary/600"],
                        }
                      }>
                      <Bold
                        color={isActive ? "white" : "Primary/600"}
                        fontSize={18}
                        style={{ lineHeight: 24 }}>
                        {route.title}
                      </Bold>
                    </Container>
                  </PressableScale>
                );
              })}
            </Row>
          </Container>

          {selectedPlan && (
            <Container mt={24}>
              <PlanDetail
                planName={selectedPlan.name}
                price={`R ${selectedPlan.price}`}
                priceInterval={
                  selectedPlan.durationDays === 30
                    ? t("subscription.monthlyFrequency")
                    : t("subscription.daysFrequency", { days: selectedPlan.durationDays })
                }
                vehicleCategories={[]}
                benefits={selectedPlan.features}
                isPopular={selectedPlan.isPopular}
                onChoosePlan={() => {
                  if (selectedPlan.chargebeePlanId) {
                    handleSelectPlan(selectedPlan.chargebeePlanId);
                  }
                }}
              />
            </Container>
          )}
        </ScrollView>
      )}
    </Fill>
  );
}
