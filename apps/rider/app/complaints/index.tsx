import { useShadow } from "@brocabs/ui";
import { Column, Container, PressableScale, Row } from "@brocabs/ui/layout";
import { Regular, SemiBold } from "@brocabs/ui/text";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "~/i18n/LocaleContext";

type ComplaintStatus = "Pending" | "Resolved";

interface Complaint {
  id: string;
  date: string;
  complaintId: string;
  tripId: string;
  title: string;
  description: string;
  status: ComplaintStatus;
}

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    date: "06/10/2025",
    complaintId: "C-2025-0045",
    tripId: "T12345",
    title: "Driver arrived late",
    description: "Driver arrived at 10:20. Missed meeting.",
    status: "Resolved",
  },
  {
    id: "2",
    date: "06/10/2025",
    complaintId: "C-2025-0045",
    tripId: "T12345",
    title: "Driver arrived late",
    description: "Driver arrived at 10:20. Missed meeting.",
    status: "Resolved",
  },
  {
    id: "3",
    date: "06/10/2025",
    complaintId: "C-2025-0046",
    tripId: "T12346",
    title: "Car condition poor",
    description: "The car was not clean.",
    status: "Pending",
  },
  {
    id: "4",
    date: "06/10/2025",
    complaintId: "C-2025-0047",
    tripId: "T12347",
    title: "Rude behavior",
    description: "Driver was rude during the trip.",
    status: "Pending",
  },
];

export default function ComplaintsScreen() {
  const [filter, setFilter] = useState<ComplaintStatus>("Pending");
  const shadow = useShadow(2, "penumbra");
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const filteredComplaints = MOCK_COMPLAINTS.filter((c) => c.status === filter);

  return (
    <Container flex={1} backgroundColor="Bg Color">
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <Container mb={24} mt={20}>
            <Row gap={10} height={45}>
              <TouchableOpacity onPress={() => setFilter("Pending")} style={{ flex: 1 }}>
                <Container
                  backgroundColor={filter === "Pending" ? "Primary/600" : "transparent"}
                  borderRadius={22.5}
                  px={22}
                  height={45}
                  borderWidth={filter === "Pending" ? 0 : 1}
                  borderColor="Primary/600"
                  alignItems="center"
                  justifyContent="center">
                  {filter === "Pending" ? (
                    <SemiBold fontSize={18} color="Primary/950" lineHeight={24}>
                      {t("common.pending")}
                    </SemiBold>
                  ) : (
                    <Regular fontSize={18} color="Primary/600" lineHeight={24}>
                      {t("common.pending")}
                    </Regular>
                  )}
                </Container>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilter("Resolved")} style={{ flex: 1 }}>
                <Container
                  backgroundColor={filter === "Resolved" ? "Primary/600" : "transparent"}
                  borderRadius={22.5}
                  px={22}
                  height={45}
                  borderWidth={filter === "Resolved" ? 0 : 1}
                  borderColor="Primary/600"
                  alignItems="center"
                  justifyContent="center">
                  {filter === "Resolved" ? (
                    <SemiBold fontSize={18} color="Primary/950" lineHeight={24}>
                      {t("common.resolved")}
                    </SemiBold>
                  ) : (
                    <Regular fontSize={18} color="Primary/600" lineHeight={24}>
                      {t("common.resolved")}
                    </Regular>
                  )}
                </Container>
              </TouchableOpacity>
            </Row>
          </Container>
        }
        ItemSeparatorComponent={() => <Container height={14} />}
        renderItem={({ item }) => (
          <PressableScale onPress={() => router.push(`/complaints/${item.id}`)}>
            <Container backgroundColor="white" borderRadius={20} px={20} py={20} style={shadow}>
              <Row justifyContent="space-between" alignItems="center">
                <Column gap={10} flex={1}>
                  <Regular fontSize={12} color="Neutrals/400">
                    {item.date} • ID: {item.complaintId}
                  </Regular>
                  <SemiBold fontSize={18} color="Primary/50">
                    {item.tripId} - {item.title}
                  </SemiBold>
                  <Regular fontSize={12} color="Neutrals/400">
                    {item.description}
                  </Regular>
                </Column>
                <Container
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" as any }}
                  borderColor={item.status === "Resolved" ? "Success/400" : "Warning/400"}
                  borderWidth={0.5}
                  borderRadius={20}
                  px={10}
                  height={25}
                  justifyContent="center"
                  alignItems="center">
                  <Regular
                    fontSize={14}
                    color={item.status === "Resolved" ? "Success/400" : "Warning/400"}>
                    {item.status}
                  </Regular>
                </Container>
              </Row>
            </Container>
          </PressableScale>
        )}
      />

      {/* Add New Complaint Button */}
      <Container position="absolute" bottom={insets.bottom} left={20} right={20}>
        <TouchableOpacity onPress={() => router.push("/complaints/add-complain")}>
          <Container
            backgroundColor="Primary/600"
            borderRadius={20}
            py={20}
            alignItems="center"
            justifyContent="center">
            <SemiBold fontSize={18} color="Primary/950">
              {t("common.addComplain")}
            </SemiBold>
          </Container>
        </TouchableOpacity>
      </Container>
    </Container>
  );
}
