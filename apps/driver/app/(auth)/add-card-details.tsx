import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { profilesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { navigateBasedOnSession } from "~/utils/session-navigation";

import { Button } from "@brocabs/ui/button";
import { Container, Fill } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { FormDropdown } from "~/shared/ui/form/form-dropdown";
import { FormInput } from "~/shared/ui/form/form-input";

const schema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountType: z.string().min(1, "Account type is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branchCode: z.string().min(1, "Branch code is required"),
});

type FormFields = z.infer<typeof schema>;

// Mock data for dropdowns
const ACCOUNT_TYPES = [
  { label: "Savings", value: "Savings" },
  { label: "Current", value: "Current" },
  { label: "Cheque", value: "Cheque" },
  { label: "Business", value: "Business" },
];

export default function BankDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { refetch } = useUser({ enabled: false });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<FormFields, any, FormFields>,
    mode: "onChange",
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      accountType: "",
      bankName: "",
      branchCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormFields) =>
      profilesApi.driverProfileControllerUpdateBankDetails({ updateBankDetailsDto: data }),
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
    (data: FormFields) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <Fill backgroundColor="Neutrals/50">
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom, paddingTop: 20 }}>
        <Container px={20} gap={36}>
          {/* Title and Description */}
          <Container gap={4} alignItems="center">
            <Bold color="black" fontSize={20} textAlign="center">
              Bank details for payouts
            </Bold>
            <Regular color="black-500" fontSize={18} textAlign="center" style={{ maxWidth: 364 }}>
              Make sure the account belongs to you and matches your National ID.
            </Regular>
          </Container>

          {/* Form Fields */}
          <Container gap={16}>
            <FormInput
              label="Account Holder Name"
              name="accountHolderName"
              control={control}
              placeholder="e.g. Daniel Smith"
              error={isSubmitted ? errors.accountHolderName?.message : undefined}
              returnKeyType="next"
              editable={!mutation.isPending}
              containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
            />

            <FormInput
              label="Account Number"
              name="accountNumber"
              control={control}
              placeholder="e.g. 132 - 4567 - 7890"
              error={isSubmitted ? errors.accountNumber?.message : undefined}
              returnKeyType="next"
              keyboardType="numeric"
              editable={!mutation.isPending}
              containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
            />

            <FormDropdown
              name="accountType"
              control={control}
              placeholder="Account Type"
              data={ACCOUNT_TYPES}
              error={isSubmitted ? errors.accountType?.message : undefined}
              rightIconColor={Colors["Primary/600"]}
              style={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
            />

            <FormInput
              label="Bank Name"
              name="bankName"
              control={control}
              placeholder="e.g. SunGlow Bank Limited"
              error={isSubmitted ? errors.bankName?.message : undefined}
              returnKeyType="next"
              editable={!mutation.isPending}
              containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
            />

            <FormInput
              label="Branch Code"
              name="branchCode"
              control={control}
              placeholder="e.g. 456789"
              error={isSubmitted ? errors.branchCode?.message : undefined}
              returnKeyType="done"
              keyboardType="numeric"
              editable={!mutation.isPending}
              containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
            />

            <Container mt={14}>
              <Button
                label="Continue"
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                radius="rounded"
                isLoading={mutation.isPending}
              />
            </Container>
          </Container>
        </Container>
      </KeyboardAwareScrollView>
    </Fill>
  );
}
