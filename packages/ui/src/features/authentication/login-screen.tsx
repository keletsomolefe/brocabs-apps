import {
  AuthApi,
  LoginDtoApplicationTypeEnum,
  VerifyOtpResponseDtoDataNextStepEnum,
} from "@brocabs/client";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabDescriptor,
  TabView,
} from "react-native-tab-view";

import { Container, Row } from "../../layout";
import { AuthLayout } from "./auth-layout";
import { EmailLogin } from "./components/email-login";
import { PhoneLogin } from "./components/phone-login";
import { TabBarItem } from "./components/tabbar-item";

const OFFSET = 250; // 45px + 19px (tab bar height)

export interface LoginScreenProps {
  authApi: AuthApi;
  applicationType: LoginDtoApplicationTypeEnum;
  onLoginSuccess: () => Promise<void>;
  onNavigateToProfile: (nextStep: VerifyOtpResponseDtoDataNextStepEnum) => void;
  onForgotPassword?: () => void;
  onRegister?: () => void;
  initialTab?: string;
}

export function LoginScreen({
  authApi,
  applicationType,
  onLoginSuccess,
  onNavigateToProfile,
  onForgotPassword,
  onRegister,
  initialTab,
}: LoginScreenProps) {
  const layout = useWindowDimensions();
  const [routes] = useState([
    { key: "phone", title: "Phone" },
    { key: "email", title: "Email" },
  ]);
  const [index, setIndex] = useState(() => {
    if (!initialTab) return 0;
    const targetIndex = routes.findIndex((route) => route.key === initialTab);
    return targetIndex >= 0 ? targetIndex : 0;
  });

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!initialTab) return;
    const targetIndex = routes.findIndex((route) => route.key === initialTab);
    if (targetIndex >= 0) {
      setIndex((prev) => (prev === targetIndex ? prev : targetIndex));
    }
  }, [initialTab, routes]);

  const renderScene = ({ route }: SceneRendererProps & { route: Route }) => {
    switch (route.key) {
      case "email":
        return (
          <EmailLogin
            authApi={authApi}
            applicationType={applicationType}
            onLoginSuccess={onLoginSuccess}
            onNavigateToProfile={onNavigateToProfile}
            onForgotPassword={onForgotPassword}
            onRegister={onRegister}
            isFocused={index === 1}
          />
        );
      case "phone":
        return (
          <PhoneLogin
            authApi={authApi}
            applicationType={applicationType}
            onLoginSuccess={onLoginSuccess}
            onNavigateToProfile={onNavigateToProfile}
            onForgotPassword={onForgotPassword}
            onRegister={onRegister}
            isFocused={index === 0}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (
    tabBarProps: SceneRendererProps & {
      navigationState: NavigationState<{
        key: string;
        title: string;
      }>;
      options:
        | Record<
            string,
            TabDescriptor<{
              key: string;
              title: string;
            }>
          >
        | undefined;
    },
  ) => {
    return (
      <Row height={45} borderRadius={25} gap={8} alignItems="center">
        {routes.map((route, i) => (
          <TabBarItem
            key={route.key}
            title={route.title}
            isActive={index === i}
            onPress={() => setIndex(i)}
          />
        ))}
      </Row>
    );
  };

  return (
    <AuthLayout title="Sign In" description="Welcome! Please sign in.">
      <Container mt={24} height={layout.height - (insets.top + OFFSET)}>
        <TabView
          style={{ flex: 1 }}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          swipeEnabled={false}
        />
      </Container>
    </AuthLayout>
  );
}
