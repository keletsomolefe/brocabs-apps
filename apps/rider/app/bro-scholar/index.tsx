import { Fill } from "@brocabs/ui/layout";
import { Colors } from "@brocabs/ui/theme/colors";
import { router, useFocusEffect } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AcceptedStateView } from "~/features/bro-scholar/components/accepted-state-view";
import { ApplicationStateView } from "~/features/bro-scholar/components/application-state-view";
import { RejectedStateView } from "~/features/bro-scholar/components/rejected-state-view";
import { BroScholarFormFields } from "~/features/bro-scholar/schema";
import { ApplicationForm } from "~/features/bro-scholar/ui/application-form";
import { WaitingApprovalModal } from "~/features/bro-scholar/ui/waiting-approval-modal";
import { useLatestBroSCLRApplication } from "~/hooks/use-latest-bro-scholar-application";

const REJECTED_STATUS = "REJECTED";
const APPROVED_STATUS = "APPROVED";
const PENDING_STATUS = "PENDING";

export default function BroScholarScreen() {
  const { data: latestApplication, isLoading } = useLatestBroSCLRApplication();
  const { bottom } = useSafeAreaInsets();
  const [isPendingModalVisible, setIsPendingModalVisible] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (latestApplication?.status === PENDING_STATUS) {
        setIsPendingModalVisible(true);
      }
      return () => setIsPendingModalVisible(false);
    }, [latestApplication?.status])
  );

  const {
    control,
    formState: { errors },
    reset,
  } = useForm<BroScholarFormFields>({
    defaultValues: {
      studentName: "",
      institute: "",
      identityFile: null,
      studentCardFile: null,
      selfieFile: null,
    },
  });

  useEffect(() => {
    if (latestApplication) {
      reset({
        studentName: latestApplication.studentName,
        institute: latestApplication.institution || "",
        identityFile: latestApplication.studentFaceImageFile
          ? {
              filePath: latestApplication.studentFaceImageFile,
              fileName: "identity.jpg",
            }
          : null,
        studentCardFile: latestApplication.studentCardFile
          ? {
              filePath: latestApplication.studentCardFile,
              fileName: "student-card.jpg",
            }
          : null,
        selfieFile: latestApplication.selfieWithStudentCardFile
          ? {
              filePath: latestApplication.selfieWithStudentCardFile,
              fileName: "selfie.jpg",
            }
          : null,
      });
    }
  }, [latestApplication, reset]);

  if (isLoading) {
    return (
      <Fill backgroundColor="Bg Color" justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={Colors["Primary/500"]} />
      </Fill>
    );
  }

  // If approved, show the card
  if (latestApplication?.status === APPROVED_STATUS) {
    return <AcceptedStateView application={latestApplication} />;
  }

  // If rejected, show the rejected view
  if (latestApplication?.status === REJECTED_STATUS) {
    return <RejectedStateView application={latestApplication} />;
  }

  // If pending, show the form + waiting modal
  if (latestApplication?.status === PENDING_STATUS) {
    return (
      <Fill backgroundColor="Bg Color">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 + bottom }}
          showsVerticalScrollIndicator={false}>
          <ApplicationForm
            control={control}
            errors={errors}
            isSubmitted={false}
            disabled={true} // Read-only
            showContinueButton={false}
          />
        </ScrollView>
        {isPendingModalVisible && (
          <WaitingApprovalModal
            visible={isPendingModalVisible}
            onClose={() => {
              router.back();
            }}
            onContactSupport={() => console.log("Contact support")}
          />
        )}
      </Fill>
    );
  }

  // Otherwise (Rejected or No Application), show apply screen
  return <ApplicationStateView />;
}
