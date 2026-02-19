import { Fill } from "@brocabs/ui/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BroScholarFormFields, broScholarApplicationSchema } from "~/features/bro-scholar/schema";
import { ApplicationForm } from "~/features/bro-scholar/ui/application-form";
import { WaitingApprovalModal } from "~/features/bro-scholar/ui/waiting-approval-modal";
import { useBroSCLRApplication } from "~/hooks/use-bro-scholar-application";

export default function CreateApplicationScreen() {
  const queryClient = useQueryClient();
  const { bottom } = useSafeAreaInsets();
  const [showApprovalModal, setShowApprovalModal] = React.useState(false);
  const { mutateAsync: submitApplication } = useBroSCLRApplication();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<BroScholarFormFields>({
    resolver: zodResolver(broScholarApplicationSchema),
    defaultValues: {
      studentName: "",
      institute: "",
      identityFile: null,
      studentCardFile: null,
      selfieFile: null,
    },
  });

  const onSubmit = async (data: BroScholarFormFields) => {
    try {
      await submitApplication(data);
      await queryClient.invalidateQueries({ queryKey: ["bro-scholar", "latest"] });
      // ModalBox (loading) is ensured to be hidden by the hook before we proceed
      setShowApprovalModal(true);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleClose = () => {
    setShowApprovalModal(false);
    router.replace("/(app)/home");
  };

  const handleContactSupport = () => {
    setShowApprovalModal(false);
    // TODO: Navigate to support or open support contact
    console.log("Contact support");
  };

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 + bottom }}
        showsVerticalScrollIndicator={false}>
        <ApplicationForm
          control={control}
          errors={errors}
          isSubmitted={isSubmitted}
          onSubmit={handleSubmit(onSubmit)}
          showContinueButton={true}
        />
      </ScrollView>

      {/* Waiting Approval Modal */}
      <WaitingApprovalModal
        visible={showApprovalModal}
        onClose={handleClose}
        onContactSupport={handleContactSupport}
      />
    </Fill>
  );
}
