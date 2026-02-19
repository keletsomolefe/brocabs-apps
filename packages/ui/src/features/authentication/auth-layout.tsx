import { Container } from "@brocabs/ui/layout";
import { Bold, Regular } from "@brocabs/ui/text";
import { Visible } from "@brocabs/ui/visible";
import { PropsWithChildren, ReactNode } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export function AuthLayout({
  children,
  title,
  description,
}: PropsWithChildren<AuthLayoutHeaderProps>) {
  return (
    <KeyboardAwareScrollView style={{ paddingTop: 16, flex: 1 }}>
      <Container px={20} gap={14}>
        <Visible if={!!title}>
          <Bold color="Primary/50" fontSize={26}>
            {title}
          </Bold>
        </Visible>
        <Visible if={!!description}>
          {typeof description === "string" ? (
            <Regular color="Primary/50" fontSize={16}>
              {description}
            </Regular>
          ) : (
            description
          )}
        </Visible>
        {children}
      </Container>
    </KeyboardAwareScrollView>
  );
}

interface AuthLayoutHeaderProps {
  title?: string;
  description?: string | ReactNode;
}
