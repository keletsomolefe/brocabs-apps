import { getShadow } from "@brocabs/ui";
import { Button } from "@brocabs/ui/button";
import { Container, Fill, Row } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput } from "react-native";
import { useBankAccount, useWithdraw } from "~/features/wallet/hooks";

const shadow = getShadow(1, "penumbra");

export default function WithdrawalScreen() {
  const router = useRouter();
  const { data: bankAccount } = useBankAccount();
  const { mutateAsync: withdraw, isPending: loading } = useWithdraw();

  const [amount, setAmount] = useState("");

  const handleSave = async () => {
    if (!amount) return;

    try {
      await withdraw({
        value: parseFloat(amount),
      });
      Alert.alert("Success", "Withdrawal initiated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Withdrawal error:", error);
      Alert.alert("Error", "Failed to process withdrawal. Please try again.");
    }
  };

  const handleEditBankDetails = () => {
    router.push("/home/edit-bank-details");
  };

  return (
    <>
      <Fill backgroundColor="Bg Color">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 20,
              gap: 24,
            }}>
            {/* Prompt */}
            <Regular fontSize={16} color="Primary/50" lineHeight={24}>
              How much would you like to withdraw from your wallet?
            </Regular>

            {/* Amount Input */}
            <Container gap={8}>
              <Row
                borderRadius={20}
                backgroundColor="white"
                style={shadow}
                px={20}
                height={64}
                alignItems="center"
                justifyContent="space-between">
                <TextInput
                  placeholder="00.00"
                  placeholderTextColor={Colors["Neutrals/400"]}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    fontSize: 24,
                    fontFamily: "BRHendrix-Regular",
                    color: Colors["Primary/50"],
                  }}
                />
                <Regular fontSize={16} color="Primary/50">
                  ZAR
                </Regular>
              </Row>
            </Container>

            {/* Bank Details Section */}
            <Container gap={8}>
              <Row justifyContent="space-between" alignItems="center">
                <Bold fontSize={18} color="Primary/50">
                  Banking Details
                </Bold>
                <Button label="Edit" onPress={handleEditBankDetails} variant="outline" size="sm" />
              </Row>
              <Container backgroundColor="white" borderRadius={12} p={16} style={shadow}>
                {bankAccount ? (
                  <Container gap={8}>
                    <Row justifyContent="space-between">
                      <Regular color="Neutrals/400">Bank Name</Regular>
                      <Regular color="Primary/50">{bankAccount.bankName}</Regular>
                    </Row>
                    <Row justifyContent="space-between">
                      <Regular color="Neutrals/400">Account Holder</Regular>
                      <Regular color="Primary/50">{bankAccount.accountHolder}</Regular>
                    </Row>
                    <Row justifyContent="space-between">
                      <Regular color="Neutrals/400">Account Number</Regular>
                      <Regular color="Primary/50">{bankAccount.accountNumber}</Regular>
                    </Row>
                    <Row justifyContent="space-between">
                      <Regular color="Neutrals/400">Branch Code</Regular>
                      <Regular color="Primary/50">{bankAccount.branchCode}</Regular>
                    </Row>
                    <Row justifyContent="space-between">
                      <Regular color="Neutrals/400">Account Type</Regular>
                      <Regular color="Primary/50">{bankAccount.accountType}</Regular>
                    </Row>
                  </Container>
                ) : (
                  <Regular color="Neutrals/400">
                    No banking details added. Please add them to withdraw funds.
                  </Regular>
                )}
              </Container>
            </Container>

            {/* Withdraw Button */}
            <Button
              label={loading ? "Processing..." : "Withdraw"}
              onPress={handleSave}
              variant="primary"
              radius="rounded"
              size="lg"
              disabled={loading || !amount || parseFloat(amount) <= 0 || !bankAccount}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Fill>
    </>
  );
}
