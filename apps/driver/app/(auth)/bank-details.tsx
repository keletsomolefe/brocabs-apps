import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { profilesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { navigateBasedOnSession } from "~/utils/session-navigation";

import { Container, Fill } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import {
  BankDetailsForm,
  BankDetailsFormFields,
} from "~/features/wallet/components/bank-details-form";

export default function BankDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { refetch } = useUser({ enabled: false });

  const mutation = useMutation({
    mutationFn: (data: BankDetailsFormFields) =>
      profilesApi.driverProfileControllerUpdateBankDetails({
        updateBankDetailsDto: {
          accountHolderName: data.accountHolderName,
          accountNumber: data.accountNumber,
          accountType: data.accountType,
          bankName: data.selectedBank === "OTHER" ? data.otherBankName! : data.selectedBank,
          branchCode: data.branchCode,
          bank: data.selectedBank === "OTHER" ? undefined : data.selectedBank,
          idNumber: data.idNumber,
        },
      }),
    onSuccess: async () => {
      const { data } = await refetch();
      console.log(
        "BankDetails: Successfully saved to backend. Session:",
        JSON.stringify(data, null, 2)
      );
      navigateBasedOnSession(data);
    },
    onError: (error: any) => {
      console.error("Failed to save bank details to backend:", error);
      // You could show a toast/alert here to notify the user
      alert("Failed to save bank details. Please try again.");
    },
  });

  const onSubmit = useCallback(
    (data: BankDetailsFormFields) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <Fill backgroundColor="Neutrals/50">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 20 + insets.bottom,
          paddingTop: 20,
        }}>
        <Container px={20} gap={30}>
          {/* Title and Description */}
          <Container gap={4} alignItems="center">
            <Bold color="Primary/50" fontSize={20} textAlign="center">
              Bank details for payouts
            </Bold>
            <Regular color="black-500" fontSize={18} textAlign="center" style={{ maxWidth: 364 }}>
              Make sure the account belongs to you and matches your National ID.
            </Regular>
          </Container>

          <BankDetailsForm
            defaultValues={{
              accountHolderName: "",
              idNumber: "",
              accountNumber: "",
              accountType: "",
              selectedBank: "",
              otherBankName: "",
              branchCode: "",
            }}
            onSubmit={onSubmit}
            isLoading={mutation.isPending}
            submitLabel="Continue"
          />
        </Container>
      </KeyboardAwareScrollView>
    </Fill>
  );
}
