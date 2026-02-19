import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { ArrowRight } from "lucide-react-native";
import { Icon } from "~/shared/ui/icons";
import { Row, TouchableOpacity } from "@brocabs/ui/layout";
import { useTranslation } from "~/i18n/LocaleContext";

interface SearchTriggerProps {
  onPress: () => void;
  pickup?: string;
  destination?: string;
}

export function SearchTrigger(props: SearchTriggerProps) {
  const { onPress, pickup, destination } = props;
  const hasRoute = pickup && destination;
  const { t } = useTranslation();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Row
        backgroundColor="white"
        borderRadius={10}
        px={15}
        height={48}
        alignItems="center"
        justifyContent="space-between">
        <Row gap={10} alignItems="center" flex={1}>
          <Icon name="search" width={24} height={24} color={Colors["Primary/400"]} />
          {hasRoute ? (
            <Row alignItems="center" flex={1}>
              <Regular color="Neutrals/900" fontSize={16} numberOfLines={1}>
                {pickup}
              </Regular>
              <ArrowRight
                size={16}
                color={Colors["Neutrals/900"]}
                style={{ marginHorizontal: 4 }}
              />
              <Regular color="Neutrals/900" fontSize={16} numberOfLines={1} style={{ flex: 1 }}>
                {destination}
              </Regular>
            </Row>
          ) : (
            <Regular color="Neutrals/400" fontSize={16}>
              {t("home.whereToAndForHowMuch")}
            </Regular>
          )}
        </Row>
        <Icon name="chevron-right" width={7.36} height={12.73} color={Colors["Primary/400"]} />
      </Row>
    </TouchableOpacity>
  );
}
