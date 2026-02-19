import { Dialog } from "@brocabs/ui/dialogs";
import { Container, Fill } from "@brocabs/ui/layout";
import { ModalBox } from "@brocabs/ui/modal-box";
import { Bold, Regular } from "@brocabs/ui/text";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BankDetailsForm,
  BankDetailsFormFields,
} from "~/features/wallet/components/bank-details-form";
import { useBankAccount } from "~/features/wallet/hooks";
import { useUniversalBranchCodes } from "~/hooks/use-lookups";
import { useUpdateBankDetails } from "~/hooks/use-update-bank-details";

export default function EditBankDetailsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: bankAccount, isLoading: isLoadingBankAccount } = useBankAccount();
  const { data: universalBranchCodes, isLoading: isLoadingBranchCodes } = useUniversalBranchCodes();
  const { mutateAsync: updateBankDetails, isPending: updatingBank } = useUpdateBankDetails();

  const defaultValues = useMemo<Partial<BankDetailsFormFields>>(() => {
    if (!bankAccount) return {};

    const isBankInList = universalBranchCodes?.some((bank) => bank.value === bankAccount.bankName);

    return {
      accountHolderName: bankAccount.accountHolder,
      idNumber: "",
      accountNumber: bankAccount.accountNumber,
      accountType: bankAccount.accountType,
      selectedBank: isBankInList ? bankAccount.bankName : "OTHER",
      branchCode: bankAccount.branchCode,
      otherBankName: isBankInList ? undefined : bankAccount.bankName,
    };
  }, [bankAccount, universalBranchCodes]);

  const onSubmit = useCallback(
    async (data: BankDetailsFormFields) => {
      try {
        await updateBankDetails({
          accountHolderName: data.accountHolderName,
          idNumber: data.idNumber,
          accountNumber: data.accountNumber,
          accountType: data.accountType,
          bankName: data.selectedBank === "OTHER" ? data.otherBankName! : data.selectedBank,
          branchCode: data.branchCode,
        });

        ModalBox.show("popup", {
          content: (
            <Dialog.Confirmation
              title="Success"
              description="Banking details updated successfully"
              icon="double-ticks"
              buttonLabel="Done"
              onPress={() => {
                ModalBox.hide();
                setImmediate(() => {
                  router.back();
                });
              }}
            />
          ),
        });
      } catch (error) {
        console.error("Failed to update bank details:", error);
        // console.error("Failed to update bank details:", error);
        Alert.alert("Error", "Failed to update banking details. Please try again.");
      }
    },
    [updateBankDetails, router]
  );

  if (isLoadingBankAccount || isLoadingBranchCodes) {
    return (
      <Fill backgroundColor="Neutrals/50" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
      </Fill>
    );
  }

  return (
    <Fill backgroundColor="Neutrals/50">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom, paddingTop: 20 }}>
        <Container px={20} gap={30}>
          <Container gap={4} alignItems="center">
            <Bold color="Primary/50" fontSize={20} textAlign="center">
              Edit Banking Details
            </Bold>
            <Regular color="black-500" fontSize={18} textAlign="center" style={{ maxWidth: 364 }}>
              Update your bank account information for payouts.
            </Regular>
          </Container>

          <BankDetailsForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            isLoading={updatingBank}
            submitLabel="Save Changes"
          />
        </Container>
      </KeyboardAwareScrollView>
    </Fill>
  );
}
