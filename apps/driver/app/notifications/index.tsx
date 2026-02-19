import type { NotificationResponseDto } from "@brocabs/client";
import { Column, Container, Row } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useMemo, useState } from "react";
import { SectionList, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
  useNotifications,
} from "~/hooks/use-notifications";
import { useTranslation } from "~/i18n/LocaleContext";
import { Icon, IconName } from "~/shared/ui/icons";

type NotificationType = "wallet" | "trip" | "system" | "rate";

const getIconForNotification = (type: NotificationType, title?: string): IconName => {
  // Match specific notification titles for more descriptive icons
  if (title) {
    const t = title.toLowerCase();
    if (t.includes("ride accepted") || t.includes("ride request")) return "car";
    if (t.includes("arrived")) return "map-pin";
    if (t.includes("ride started")) return "direction";
    if (t.includes("ride completed")) return "check-circle";
    if (t.includes("cancelled")) return "cancel-outline";
    if (t.includes("expired") || t.includes("no driver")) return "hourglass";
    if (t.includes("chat") || t.includes("message")) return "chat-filled";
  }

  switch (type) {
    case "wallet":
      return "wallet2";
    case "trip":
      return "car";
    case "system":
      return "support";
    case "rate":
      return "star";
    default:
      return "bell";
  }
};

const getIconColorForNotification = (type: NotificationType, title?: string) => {
  if (title) {
    const t = title.toLowerCase();
    if (t.includes("ride accepted") || t.includes("ride request")) return "#3B82F6";
    if (t.includes("arrived")) return "#F7931A";
    if (t.includes("ride started")) return "#8B5CF6";
    if (t.includes("ride completed")) return "#19B869";
    if (t.includes("cancelled")) return "#EF4444";
    if (t.includes("expired") || t.includes("no driver")) return "#F59E0B";
    if (t.includes("chat") || t.includes("message")) return "#6D5DFB";
  }

  switch (type) {
    case "wallet":
      return "#19B869";
    case "trip":
      return "#3B82F6";
    case "system":
      return "#EF4444";
    case "rate":
      return "#F7931A";
    default:
      return Colors["Primary/50"];
  }
};

// Helper to format the date for grouping
const getDateGroup = (createdAt: Date): string => {
  const now = new Date();
  const notificationDate = new Date(createdAt);
  const diffTime = now.getTime() - notificationDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "7 days ago";
  return "Older";
};

// Helper to format time
const formatTime = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

  if (diffMinutes < 1) return "Just Now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const NotificationSkeleton = () => {
  return (
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
        padding: 14,
      }}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <SkeletonPlaceholder.Item flexDirection="row" gap={10} alignItems="center" flex={1}>
            <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
            <SkeletonPlaceholder.Item flexDirection="column" gap={6} flex={1}>
              <SkeletonPlaceholder.Item width={120} height={16} borderRadius={4} />
              <SkeletonPlaceholder.Item width={180} height={24} borderRadius={4} />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item width={50} height={12} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </Container>
  );
};

const FilterSkeleton = () => (
  <Container mb={"6px"} mt={20}>
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item flexDirection="row" gap={10}>
        <SkeletonPlaceholder.Item flex={1} height={45} borderRadius={20} />
        <SkeletonPlaceholder.Item flex={1} height={45} borderRadius={20} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  </Container>
);

export default function NotificationScreen() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const insets = useSafeAreaInsets();

  // Fetch notifications from API
  const { data, isLoading } = useNotifications(filter);
  const deleteNotification = useDeleteNotification();
  const markAsRead = useMarkNotificationAsRead();

  const notifications = useMemo(() => data?.notifications ?? [], [data?.notifications]);

  const handlePress = (item: NotificationResponseDto) => {
    if (!item.isRead) {
      markAsRead.mutate(item.id);
    }
  };

  const handleDelete = (id: string) => {
    deleteNotification.mutate(id);
  };

  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity
        onPress={() => handleDelete(id)}
        style={{
          backgroundColor: "#FDE2E2",
          justifyContent: "center",
          alignItems: "center",
          width: 64,
          height: "100%",
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
        }}>
        <Icon name="trash" width={18} height={18} color={Colors["Danger/600"]} />
      </TouchableOpacity>
    );
  };

  // Group notifications by date
  const sections = useMemo(() => {
    if (isLoading) {
      return [
        {
          title: t("common.loading") as string,
          data: Array.from({ length: 6 }).map(
            (_, i) => ({ id: `skeleton-${i}` }) as NotificationResponseDto
          ),
        },
      ];
    }

    const groups: Record<string, NotificationResponseDto[]> = {};

    for (const notification of notifications) {
      const group = getDateGroup(notification.createdAt);
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(notification);
    }

    // Define the order of sections
    const orderedGroups = ["Today", "Yesterday", "7 days ago", "Older"];

    return orderedGroups
      .filter((group) => groups[group]?.length > 0)
      .map((group) => ({
        title: group === "Today" ? (t("common.today") as string) : group,
        data: groups[group],
      }));
  }, [notifications, isLoading, t]);

  // Empty state
  if (!isLoading && notifications.length === 0) {
    return (
      <Container flex={1} backgroundColor="Bg Color" justifyContent="center" alignItems="center">
        <Container mb={20}>
          <Icon name="bell" width={48} height={48} color={Colors["Neutrals/400"]} />
        </Container>
        <Regular fontSize={16} color="Neutrals/400">
          No notifications yet
        </Regular>
      </Container>
    );
  }

  return (
    <Container flex={1} backgroundColor="Bg Color">
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20 + insets.bottom,
          gap: 18,
        }}
        ListHeaderComponent={
          isLoading ? (
            <FilterSkeleton />
          ) : (
            <Container mb={"6px"} mt={20}>
              <Row gap={10}>
                <TouchableOpacity onPress={() => setFilter("all")} style={{ flex: 1 }}>
                  <Container
                    backgroundColor={filter === "all" ? "Primary/600" : "transparent"}
                    borderRadius={20}
                    height={45}
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={filter === "all" ? 0 : 1}
                    borderColor="Primary/600">
                    <SemiBold fontSize={14} color={filter === "all" ? "white" : "Primary/600"}>
                      {t("common.all")}
                    </SemiBold>
                  </Container>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter("unread")} style={{ flex: 1 }}>
                  <Container
                    backgroundColor={filter === "unread" ? "Primary/600" : "transparent"}
                    borderRadius={20}
                    height={45}
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={filter === "unread" ? 0 : 1}
                    borderColor="Primary/600">
                    <SemiBold fontSize={14} color={filter === "unread" ? "white" : "Primary/600"}>
                      {t("common.unread")}
                    </SemiBold>
                  </Container>
                </TouchableOpacity>
              </Row>
            </Container>
          )
        }
        renderSectionHeader={({ section: { title } }) =>
          isLoading ? null : (
            <Container mt={10}>
              <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
                {title}
              </Regular>
            </Container>
          )
        }
        renderItem={({ item }) =>
          isLoading ? (
            <NotificationSkeleton />
          ) : (
            <Swipeable
              containerStyle={{
                backgroundColor: "white",
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 1,
              }}
              renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(item)}>
                <Container p={14} backgroundColor="white">
                  <Row justifyContent="space-between" alignItems="center">
                    <Row gap={10} alignItems="center" flex={1}>
                      <Container width={24} height={24} alignItems="center" justifyContent="center">
                        <Icon
                          name={getIconForNotification(item.type as NotificationType, item.title)}
                          width={22}
                          height={22}
                          color={getIconColorForNotification(
                            item.type as NotificationType,
                            item.title
                          )}
                        />
                      </Container>
                      <Column gap={6} flex={1}>
                        <Row alignItems="center" gap={6}>
                          <Medium fontSize={14} lineHeight={16} color="Primary/50">
                            {item.title}
                          </Medium>
                          {!item.isRead && (
                            <Container
                              width={8}
                              height={8}
                              borderRadius={4}
                              backgroundColor="Primary/600"
                            />
                          )}
                        </Row>
                        <Regular fontSize={14} lineHeight={24} color="Neutrals/400">
                          {item.description}
                        </Regular>
                      </Column>
                    </Row>
                    <Column alignItems="flex-end" justifyContent="space-between" height="100%">
                      <Regular fontSize={12} lineHeight={16} color="Neutrals/400">
                        {formatTime(item.createdAt)}
                      </Regular>
                    </Column>
                  </Row>
                </Container>
              </TouchableOpacity>
            </Swipeable>
          )
        }
        stickySectionHeadersEnabled={false}
      />
    </Container>
  );
}
