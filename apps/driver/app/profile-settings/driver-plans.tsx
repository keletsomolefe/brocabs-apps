import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { processApiError } from "@brocabs/client";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill, Row, ScrollView } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { router } from "expo-router";
import { PressableScale } from "pressto";
import { queryClient, subscriptionsApi } from "~/api";
import { PlanDetail } from "~/features/authentication/components/driver-plans";
import { usePlans } from "~/hooks/use-plans";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

export default function DriverPlansScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  const { t } = useLocale();
  const { data: plans, isLoading } = usePlans();

  const subscribeMutation = useMutation({
    mutationFn: (planId: string) =>
      subscriptionsApi.subscriptionControllerSubscribe({
        createSubscriptionDto: { planId },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
      ModalBox.hide();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title={t("subscriptions.planUpdated")}
            description={t("subscriptions.planUpdatedDesc")}
            icon="check-circle"
            buttonLabel={t("common.back")}
            onPress={() => {
              ModalBox.hide();
              router.back();
            }}
          />
        ),
      });
    },
    onError: async (error) => {
      ModalBox.hide();
      const errorMessage = await processApiError(error);
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title={t("subscriptions.subscriptionFailed")}
            description={errorMessage.message}
            icon="mdi-cross-circle"
            buttonLabel={t("common.ok")}
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
          description={t("subscriptions.processingSubscription")}
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
              {t("subscriptions.driverPlansTitle")}
            </Bold>
            <Regular color="Primary/50" fontSize={14} center>
              {t("subscriptions.driverPlansDesc")}
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
                priceInterval={`/ ${selectedPlan.durationDays === 30 ? "monthly" : `${selectedPlan.durationDays} days`}`}
                vehicleCategories={[]}
                benefits={selectedPlan.features}
                isPopular={selectedPlan.isPopular}
                onChoosePlan={() => handleSelectPlan(selectedPlan.id)}
                primaryCtaLabel="Choose Plan"
                showSecondaryCta={false}
              />
            </Container>
          )}
        </ScrollView>
      )}
    </Fill>
  );
}
