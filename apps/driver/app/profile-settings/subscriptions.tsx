import { processApiError } from "@brocabs/client";
import { Lottie } from "@brocabs/ui/animations";
import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill, Image } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Bold, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { forwardRef, useRef, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { queryClient, subscriptionsApi } from "~/api";
import { DutySwitch } from "~/features/trip/components/duty-switch";
import { Icon } from "~/shared/ui/icons";
import { AssetFiles } from "~/theme/assets";

interface SubscriptionCardProps {
  title: string;
  price: string;
  interval: string;
  status?: string;
  isCurrent?: boolean;
  autoRenew: boolean;
  onAutoRenewToggle: (value: boolean) => void;
  showExpandable?: boolean;
}

const SubscriptionCard = ({
  title,
  price,
  interval,
  status,
  isCurrent = false,
  autoRenew,
  onAutoRenewToggle,
  showExpandable = false,
}: SubscriptionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Container backgroundColor="white" borderRadius={20} px={22} py={20} gap={16}>
      <Container flexDirection="row" alignItems="flex-start" justifyContent="space-between">
        <Container flex={1} gap={8}>
          <Regular fontSize={14} lineHeight={20} color="Primary/600">
            {title}
          </Regular>
          <Container flexDirection="row" alignItems="baseline" gap={4}>
            <Bold fontSize={24} lineHeight={32} color="Primary/50">
              {price}
            </Bold>
            <Regular fontSize={12} lineHeight={16} color="Neutrals/400">
              {interval}
            </Regular>
          </Container>
        </Container>
        {isCurrent && (
          <Container
            backgroundColor="Success/600"
            borderRadius={16}
            px={10}
            py={2}
            alignItems="center"
            justifyContent="center">
            <Regular fontSize={12} lineHeight={14} color="white">
              Current
            </Regular>
          </Container>
        )}
      </Container>

      <Container flexDirection="row" alignItems="center" justifyContent="space-between">
        {status ? (
          <Container
            backgroundColor="Neutrals/100"
            borderRadius={15}
            px={12}
            py={2}
            alignItems="center"
            justifyContent="center">
            <Regular fontSize={10} lineHeight={14} color="Neutrals/600">
              {status}
            </Regular>
          </Container>
        ) : (
          <Container />
        )}

        <Container flexDirection="row" alignItems="center" gap={10}>
          <Regular fontSize={12} lineHeight={16} color="Neutrals/400">
            Auto-Renew
          </Regular>
          <DutySwitch isOnline={autoRenew} onToggle={onAutoRenewToggle} />
        </Container>
      </Container>

      {showExpandable && (
        <>
          <Container height={1} backgroundColor="Neutrals/200" width="100%" />
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} activeOpacity={0.7}>
            <Container flexDirection="row" alignItems="center" justifyContent="space-between">
              <Regular fontSize={12} lineHeight={16} color="Neutrals/400">
                What includes in plan:
              </Regular>
              <Container
                style={{
                  transform: [{ rotate: isExpanded ? "180deg" : "0deg" }],
                }}>
                <Icon name="drop-down" width={16} height={16} color={Colors["Primary/600"]} />
              </Container>
            </Container>
          </TouchableOpacity>
        </>
      )}

      {showExpandable && isExpanded && (
        <Container gap={6}>
          <Regular fontSize={12} lineHeight={18} color="Neutrals/600">
            - Access to all standard ride categories
          </Regular>
          <Regular fontSize={12} lineHeight={18} color="Neutrals/600">
            - Priority support during peak hours
          </Regular>
          <Regular fontSize={12} lineHeight={18} color="Neutrals/600">
            - Weekly payout eligibility
          </Regular>
        </Container>
      )}
    </Container>
  );
};

interface CancelSubscriptionSheetProps {
  onConfirm: () => void;
}

const CancelSubscriptionSheet = forwardRef<BottomSheetModal, CancelSubscriptionSheetProps>(
  ({ onConfirm }, ref: any) => {
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        enableDynamicSizing={true}
        backdropComponent={Backdrop}
        handleComponent={null}
        backgroundStyle={{
          backgroundColor: "white",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}>
        <BottomSheetView
          style={{
            paddingHorizontal: 20,
            paddingBottom: 50,
            paddingTop: 30,
          }}>
          <Container alignItems="center" style={{ gap: 20 }}>
            <Container alignItems="center" style={{ gap: 20 }}>
              <Image source={AssetFiles.images["mascot-warning"]} width={120} height={120} />
              <Bold fontSize={18} lineHeight={24} color="Danger/600" textAlign="center">
                Cancel Subscription
              </Bold>
              <Regular
                fontSize={16}
                lineHeight={24}
                color="Primary/50"
                textAlign="center"
                style={{ width: 336 }}>
                Are you sure you want to cancel your active subscription plan?
              </Regular>
            </Container>

            <Container flexDirection="row" style={{ gap: 10 }} width="100%">
              <TouchableOpacity style={{ flex: 1 }} onPress={() => (ref as any).current?.dismiss()}>
                <Container
                  height={56}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="Primary/950"
                  borderRadius={20}>
                  <Regular fontSize={18} lineHeight={24} color="Primary/600">
                    Cancel
                  </Regular>
                </Container>
              </TouchableOpacity>

              <TouchableOpacity style={{ flex: 1 }} onPress={onConfirm}>
                <Container
                  height={56}
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="Danger/600"
                  borderRadius={20}>
                  <SemiBold fontSize={18} lineHeight={24} color="white">
                    Confirm Request
                  </SemiBold>
                </Container>
              </TouchableOpacity>
            </Container>
          </Container>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

CancelSubscriptionSheet.displayName = "CancelSubscriptionSheet";

export default function SubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const cancelSheetRef = useRef<BottomSheetModal>(null);

  const { data: subscription, refetch } = useQuery({
    queryKey: ["current-subscription"],
    queryFn: async () => {
      return await subscriptionsApi.subscriptionControllerGetCurrentSubscription();
    },
  });

  const enableAutoRenewMutation = useMutation({
    mutationFn: async () => {
      if (!subscription?.id) {
        throw new Error("No subscription found");
      }
      return await subscriptionsApi.subscriptionControllerEnableAutoRenew({
        subscriptionIdDto: { subscriptionId: subscription.id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
      refetch();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Auto-Renew Enabled"
            description="Your subscription will automatically renew at the end of the billing period."
            icon="check-circle"
            buttonLabel="OK"
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    },
    onError: async (error) => {
      const errorObj = await processApiError(error);
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Update Failed"
            description={errorObj.message}
            icon="mdi-cross-circle"
            buttonLabel="OK"
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!subscription?.id) {
        throw new Error("No subscription found");
      }
      return await subscriptionsApi.subscriptionControllerCancelSubscription({
        subscriptionIdDto: { subscriptionId: subscription.id },
      });
    },
    onSuccess: () => {
      ModalBox.hide();
      cancelSheetRef.current?.dismiss();
      queryClient.invalidateQueries({ queryKey: ["current-subscription"] });
      refetch();
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Cancellation Requested"
            description="Your subscription cancellation request has been submitted successfully."
            icon="check-circle"
            buttonLabel="OK"
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    },
    onError: async (error) => {
      ModalBox.hide();
      cancelSheetRef.current?.dismiss();
      const errorObj = await processApiError(error);
      ModalBox.show("popup", {
        content: (
          <Dialog.Confirmation
            title="Cancellation Failed"
            description={errorObj.message}
            icon="mdi-cross-circle"
            buttonLabel="OK"
            onPress={() => ModalBox.hide()}
          />
        ),
      });
    },
  });

  const handleAutoRenewToggle = (value: boolean) => {
    if (!value) {
      cancelSheetRef.current?.present();
      return;
    }
    enableAutoRenewMutation.mutate();
  };

  const handleCancelRequest = () => {
    ModalBox.show("popup", {
      content: (
        <Dialog.Loader
          source={Lottie.loader}
          title="Processing..."
          description="Please wait while we process your cancellation request"
        />
      ),
    });
    cancelSubscriptionMutation.mutate();
  };

  const handleChangePlan = () => {
    router.push("/profile-settings/driver-plans");
  };

  const plan = subscription?.plan;
  const planName = plan?.name || "Basic";
  const planPrice = plan?.price ? `R ${plan.price}` : "R 600";
  const subscriptionStatus = subscription?.status;
  const isPendingPayment =
    subscriptionStatus === "PENDING_APPROVAL" || subscriptionStatus === "PAYMENT_FAILED";
  const isCurrent = subscriptionStatus === "ACTIVE";
  const autoRenew = subscription?.autoRenew ?? true;

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 + insets.bottom, paddingTop: 20, gap: 20 }}
        showsVerticalScrollIndicator={false}>
        <Container px={20} gap={20}>
          {/* Basic Plan Card */}
          <SubscriptionCard
            title={planName}
            price={planPrice}
            interval="/ monthly"
            status={isPendingPayment ? "Pending Payment" : undefined}
            isCurrent={isCurrent}
            autoRenew={autoRenew}
            onAutoRenewToggle={handleAutoRenewToggle}
            showExpandable={true}
          />

          {/* Admin Fee Card */}
          <SubscriptionCard
            title="Admin Fee"
            price="R 300"
            interval="/ yearly"
            status={isPendingPayment ? "Pending Payment" : undefined}
            autoRenew={true}
            onAutoRenewToggle={(value) => {
              // Admin fee auto-renew logic if needed
              console.log("Admin fee auto-renew:", value);
            }}
          />
        </Container>

        <Container px={20}>
          <Container gap={12}>
            <TouchableOpacity onPress={handleChangePlan} activeOpacity={0.7}>
              <Container
                height={56}
                alignItems="center"
                justifyContent="center"
                backgroundColor="Primary/600"
                borderRadius={20}>
                <SemiBold fontSize={16} lineHeight={24} color="white">
                  Change Plan
                </SemiBold>
              </Container>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => cancelSheetRef.current?.present()} activeOpacity={0.7}>
              <Container
                height={56}
                alignItems="center"
                justifyContent="center"
                backgroundColor="white"
                borderWidth={1}
                borderColor="Primary/600"
                borderRadius={20}>
                <SemiBold fontSize={16} lineHeight={24} color="Primary/600">
                  Request Cancellation
                </SemiBold>
              </Container>
            </TouchableOpacity>
          </Container>
        </Container>
      </ScrollView>

      <CancelSubscriptionSheet ref={cancelSheetRef} onConfirm={handleCancelRequest} />
    </Fill>
  );
}
