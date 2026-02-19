import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "../../icons/icon";
import { Column, Container, Image, Row } from "../../layout";
import { Regular, SemiBold } from "../../text";
import { Colors } from "../../theme/colors";
import { Visible } from "../../visible";

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  lastSeen?: string;
  onCallPress?: () => void;
  onBackPress?: () => void;
}

export function ChatHeader({
  name,
  avatar,
  lastSeen = "Last seen 12:45",
  onCallPress,
  onBackPress,
}: ChatHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <Container backgroundColor="Bg Color" pt={insets.top + 10} pb={10} px={20}>
      <Row alignItems="center" justifyContent="space-between">
        <Row alignItems="center" gap={14}>
          <TouchableOpacity onPress={handleBack}>
            <Icon
              name="arrow-back"
              width={22}
              height={18}
              color={Colors["Primary/50"]}
            />
          </TouchableOpacity>
          <Row alignItems="center" gap={10}>
            <Container
              width={37}
              height={37}
              overflow="hidden"
              borderRadius={18.5}
              backgroundColor={avatar ? undefined : "Primary/950"}
              alignItems="center"
              justifyContent="center"
            >
              <Visible if={!avatar}>
                <Icon
                  name="profile-fill"
                  width={22}
                  height={22}
                  color={Colors["Primary/400"]}
                />
              </Visible>
              <Visible if={!!avatar}>
                <Image
                  width={37}
                  height={37}
                  source={avatar}
                  borderRadius={18.5}
                />
              </Visible>
            </Container>
            <Column gap={2}>
              <SemiBold fontSize={16} color="Primary/50">
                {name}
              </SemiBold>
              <Regular fontSize={14} color="Primary/300">
                {lastSeen}
              </Regular>
            </Column>
          </Row>
        </Row>

        <TouchableOpacity
          onPress={onCallPress}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#5905ff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="phone" width={20} height={20} color="#FFFFFF" />
        </TouchableOpacity>
      </Row>
    </Container>
  );
}
