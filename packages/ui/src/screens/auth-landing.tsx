import React from "react";
import {
  TouchableOpacity,
  useWindowDimensions,
  type ImageSourcePropType,
} from "react-native";

import { Container, Image, ScrollView } from "@brocabs/ui/layout";
import { Bold, SemiBold } from "../text";

export interface AuthLandingProps {
  ButtonComponent: React.ComponentType<any>;
  logoSource: ImageSourcePropType;
  onCreateAccount: () => void;
  onSignInPassword: () => void;
  onSignInOTP: () => void;
}

export function AuthLanding({
  ButtonComponent,
  logoSource,
  onCreateAccount,
  onSignInPassword,
  onSignInOTP,
}: AuthLandingProps) {
  const { width, height } = useWindowDimensions();

  return (
    <ScrollView>
      <Container
        backgroundColor="Bg Color"
        justifyContent="center"
        gap={40}
        width={width}
        height={height}
      >
        <Container alignItems="center" gap={40}>
          <Image source={logoSource} width={140} height={48} />
          <Bold color="Primary/50" fontSize={24} center>
            Making travel fun again
          </Bold>
        </Container>
        <Container gap={20}>
          <Container gap={40} mx={32}>
            <ButtonComponent
              label="Create Account"
              variant="outline"
              radius="rounded"
              textWeight="normal"
              onPress={onCreateAccount}
            />
            <Container flexDirection="row" alignItems="center" gap={12}>
              <Container flex={1} height={1} backgroundColor="black-200" />
              <SemiBold color="Primary/50" fontSize={16} whiteSpace="nowrap">
                or
              </SemiBold>
              <Container flex={1} height={1} backgroundColor="black-200" />
            </Container>
            <ButtonComponent
              label="Sign in with Password"
              variant="primary"
              radius="rounded"
              onPress={onSignInPassword}
            />
          </Container>
          <TouchableOpacity onPress={onSignInOTP}>
            <Container alignItems="center" gap={2} mx={32}>
              <SemiBold
                color="Primary/400"
                fontSize={18}
                style={{ textDecorationLine: "underline" }}
                whiteSpace="nowrap"
              >
                Sign in with OTP
              </SemiBold>
            </Container>
          </TouchableOpacity>
        </Container>
      </Container>
    </ScrollView>
  );
}
