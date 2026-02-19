import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { type Resolver, useForm, useWatch } from "react-hook-form";
import { ActivityIndicator } from "react-native";
import { z } from "zod";
import { useBankAccountTypes, useUniversalBranchCodes } from "~/hooks/use-lookups";

import { Button } from "@brocabs/ui/button";
import { Container } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { FormInput } from "~/shared/ui/form/form-input";
import { FormSheetSelect } from "~/shared/ui/form/form-sheet-select";
import { SelectionSheet } from "~/shared/ui/sheet/selection-sheet";

export const bankDetailsSchema = z
  .object({
    accountHolderName: z.string().min(1, "Account holder name is required"),
    idNumber: z
      .string()
      .length(13, "SA ID number must be 13 digits")
      .regex(/^\d+$/, "SA ID number must be numeric"),
    accountNumber: z.string().min(1, "Account number is required"),
    accountType: z.string().min(1, "Account type is required"),
    selectedBank: z.string().min(1, "Bank is required"),
    otherBankName: z.string().optional(),
    branchCode: z.string().min(1, "Branch code is required"),
  })
  .superRefine((data, ctx) => {
    if (data.selectedBank === "OTHER" && !data.otherBankName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter your bank name",
        path: ["otherBankName"],
      });
    }
  });

export type BankDetailsFormFields = z.infer<typeof bankDetailsSchema>;

interface BankDetailsFormProps {
  defaultValues: Partial<BankDetailsFormFields>;
  onSubmit: (data: BankDetailsFormFields) => void;
  isLoading?: boolean;
  submitLabel?: string;
  editable?: boolean;
}

export function BankDetailsForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitLabel = "Continue",
  editable = true,
}: BankDetailsFormProps) {
  const { data: bankAccountTypes, isLoading: isLoadingAccountTypes } = useBankAccountTypes();
  const { data: universalBranchCodes, isLoading: isLoadingBranchCodes } = useUniversalBranchCodes();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<BankDetailsFormFields, any, BankDetailsFormFields>({
    resolver: zodResolver(bankDetailsSchema as never) as Resolver<
      BankDetailsFormFields,
      any,
      BankDetailsFormFields
    >,
    mode: "onChange",
    defaultValues: {
      accountHolderName: "",
      idNumber: "",
      accountNumber: "",
      accountType: "",
      selectedBank: "",
      otherBankName: "",
      branchCode: "",
      ...defaultValues,
    },
  });

  const bankSheetRef = useRef<BottomSheetModal>(null);
  const accountTypeSheetRef = useRef<BottomSheetModal>(null);

  const selectedBank = useWatch({ control, name: "selectedBank" });
  const accountType = useWatch({ control, name: "accountType" });

  const handleBankSelect = (value: string) => {
    setValue("selectedBank", value, { shouldValidate: true, shouldDirty: true });
  };

  const handleAccountTypeSelect = (value: string) => {
    setValue("accountType", value, { shouldValidate: true, shouldDirty: true });
  };

  if (isLoadingAccountTypes || isLoadingBranchCodes) {
    return (
      <Container flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
        <Regular color="black-500" fontSize={16} style={{ marginTop: 16 }}>
          Loading banking options...
        </Regular>
      </Container>
    );
  }

  return (
    <>
      <Container gap={16}>
        <FormInput
          label="Account Holder Name"
          name="accountHolderName"
          control={control}
          placeholder="e.g. Daniel Smith"
          placeholderTextColor={Colors["Neutrals/400"]}
          error={isSubmitted ? errors.accountHolderName?.message : undefined}
          returnKeyType="next"
          editable={editable && !isLoading}
          containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
        />

        <FormInput
          label="ID Number"
          name="idNumber"
          control={control}
          placeholder="e.g. 9001015800080"
          placeholderTextColor={Colors["Neutrals/400"]}
          error={isSubmitted ? errors.idNumber?.message : undefined}
          returnKeyType="next"
          keyboardType="numeric"
          editable={editable && !isLoading}
          containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
        />

        <FormInput
          label="Account Number"
          name="accountNumber"
          control={control}
          placeholder="e.g. 132 - 4567 - 7890"
          placeholderTextColor={Colors["Neutrals/400"]}
          error={isSubmitted ? errors.accountNumber?.message : undefined}
          returnKeyType="next"
          keyboardType="numeric"
          editable={editable && !isLoading}
          containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
        />

        <FormSheetSelect
          name="accountType"
          control={control}
          placeholder="Account Type"
          options={bankAccountTypes || []}
          onPress={() => accountTypeSheetRef.current?.present()}
        />

        <FormSheetSelect
          name="selectedBank"
          control={control}
          placeholder="Bank Name"
          options={universalBranchCodes || []}
          onPress={() => bankSheetRef.current?.present()}
        />

        {selectedBank === "OTHER" && (
          <FormInput
            label="Other Bank Name"
            name="otherBankName"
            control={control}
            placeholder="Enter your bank name"
            placeholderTextColor={Colors["Neutrals/400"]}
            error={isSubmitted ? errors.otherBankName?.message : undefined}
            returnKeyType="next"
            editable={editable && !isLoading}
            containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
          />
        )}

        <FormInput
          label="Branch Code"
          name="branchCode"
          control={control}
          placeholder="e.g. 456789"
          placeholderTextColor={Colors["Neutrals/400"]}
          error={isSubmitted ? errors.branchCode?.message : undefined}
          returnKeyType="done"
          keyboardType="numeric"
          editable={editable && !isLoading}
          containerStyle={{ borderRadius: 20, height: 56, paddingHorizontal: 22 }}
        />

        <Container>
          <Button
            label={submitLabel}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
            isLoading={isLoading}
          />
        </Container>
      </Container>

      <SelectionSheet
        ref={accountTypeSheetRef}
        title="Select Account Type"
        options={bankAccountTypes || []}
        onSelect={handleAccountTypeSelect}
        selectedValue={accountType}
      />
      <SelectionSheet
        ref={bankSheetRef}
        title="Select Bank"
        options={universalBranchCodes || []}
        onSelect={handleBankSelect}
        selectedValue={selectedBank}
      />
    </>
  );
}
