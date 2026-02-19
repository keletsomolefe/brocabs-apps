import { useShadow } from "@brocabs/ui";
import { Column, Container, Fill, Row } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Paperclip } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ComplaintStatus = "Pending" | "Resolved";

interface ComplaintDetail {
  id: string;
  status: ComplaintStatus;
  date: string;
  time: string;
  subject: string;
  tripId: string;
  description: string;
  desiredOutcome: string;
  attachments: Array<{
    id: string;
    fileName: string;
    fileSize: string;
  }>;
}

// Mock data - replace with actual API call
const MOCK_COMPLAINT_DETAIL: ComplaintDetail = {
  id: "1",
  status: "Pending",
  date: "Dec 21, 2025",
  time: "05:52 PM",
  subject: "Trip or Driver",
  tripId: "T12345",
  description: "Driver arrived at 10:20. Missed meeting.",
  desiredOutcome: "Partial refund (R 50)",
  attachments: [
    {
      id: "1",
      fileName: "chatwithdriver.pdf",
      fileSize: "5 MB",
    },
    {
      id: "2",
      fileName: "chatwithdriver.pdf",
      fileSize: "5 MB",
    },
  ],
};

function InfoRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <Row justifyContent="space-between" alignItems="center" py={12}>
      <Medium fontSize={14} color="Neutrals/400" style={{ flex: 1 }}>
        {label}
      </Medium>
      <Container flex={1} alignItems="flex-end">
        {typeof value === "string" ? (
          <Regular fontSize={14} color="Primary/50" style={{ textAlign: "right" }}>
            {value}
          </Regular>
        ) : (
          value
        )}
      </Container>
    </Row>
  );
}

function StatusTag({ status }: { status: ComplaintStatus }) {
  const color = status === "Pending" ? "Warning/400" : "Success/400";

  return (
    <Container
      borderColor={color}
      borderWidth={1}
      borderRadius={20}
      px={12}
      py={2}
      alignSelf="flex-end">
      <Regular fontSize={14} color={color}>
        {status}
      </Regular>
    </Container>
  );
}

function AttachmentItem({ fileName, fileSize }: { fileName: string; fileSize: string }) {
  return (
    <Row alignItems="center" gap={12} py={12} px={16}>
      <Container borderRadius={10} alignItems="center" justifyContent="center">
        <Paperclip width={30} height={30} color={Colors["Warning/400"]} />
      </Container>
      <Column flex={1}>
        <Regular fontSize={14} color="Primary/50">
          {fileName}
        </Regular>
      </Column>
      <Regular fontSize={12} color="Neutrals/500">
        {fileSize}
      </Regular>
    </Row>
  );
}

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const shadow = useShadow(2, "penumbra");

  // TODO: Fetch complaint detail by id
  const complaint = MOCK_COMPLAINT_DETAIL;

  const handleClose = () => {
    router.back();
  };

  const handleMarkAsResolved = () => {
    // TODO: Implement mark as resolved logic
    console.log("Marking complaint as resolved:", id);
    router.back();
  };

  return (
    <Fill backgroundColor="Bg Color">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}>
        <Container px={20} pt={20} gap={16}>
          {/* Status Card */}
          <Container backgroundColor="white" borderRadius={20} px={20} py={16} style={shadow}>
            <InfoRow label="Status" value={<StatusTag status={complaint.status} />} />
            <Container height={1} backgroundColor="Neutrals/100" my={1} />
            <InfoRow label="Date" value={complaint.date} />
            <Container height={1} backgroundColor="Neutrals/100" my={1} />
            <InfoRow label="Time" value={complaint.time} />
          </Container>

          {/* Details Card */}
          <Container backgroundColor="white" borderRadius={20} px={20} py={16} style={shadow}>
            <InfoRow label="Subject" value={complaint.subject} />
            <Container height={1} backgroundColor="Neutrals/100" my={1} />
            <InfoRow label="Trip ID" value={complaint.tripId} />
            <Container height={1} backgroundColor="Neutrals/100" my={1} />
            <Row justifyContent="space-between" alignItems="flex-start" py={12}>
              <Regular fontSize={14} color="Neutrals/400" style={{ flex: 1 }}>
                Description
              </Regular>
              <Container flex={1} alignItems="flex-end">
                <Regular fontSize={14} color="Primary/50" style={{ textAlign: "right" }}>
                  {complaint.description}
                </Regular>
              </Container>
            </Row>
          </Container>

          {/* Desired Outcome Card */}
          <Container backgroundColor="white" borderRadius={20} px={20} py={16} style={shadow}>
            <InfoRow label="Desired outcome:" value={complaint.desiredOutcome} />
          </Container>

          {/* Attachments Section */}
          {complaint.attachments.length > 0 && (
            <Container gap={12}>
              <SemiBold fontSize={16} color="Primary/50">
                Attachments
              </SemiBold>
              <Container backgroundColor="white" borderRadius={20} style={shadow}>
                {complaint.attachments.map((attachment, index) => (
                  <Container key={attachment.id}>
                    <AttachmentItem fileName={attachment.fileName} fileSize={attachment.fileSize} />
                    {index < complaint.attachments.length - 1 && (
                      <Container height={1} backgroundColor="Neutrals/100" mx={16} />
                    )}
                  </Container>
                ))}
              </Container>
            </Container>
          )}
        </Container>
      </ScrollView>

      {/* Footer Buttons */}
      <Container
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        backgroundColor="white"
        borderTopWidth={1}
        borderTopColor="Neutrals/100"
        px={20}
        py={16}
        style={{ paddingBottom: 16 + insets.bottom }}>
        <Row gap={10}>
          <TouchableOpacity style={{ flex: 1 }} onPress={handleClose} activeOpacity={0.7}>
            <Container
              backgroundColor="Primary/950"
              borderRadius={20}
              height={56}
              alignItems="center"
              justifyContent="center">
              <Regular fontSize={18} color="Primary/600">
                Close
              </Regular>
            </Container>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={handleMarkAsResolved} activeOpacity={0.7}>
            <Container
              backgroundColor="Primary/600"
              borderRadius={20}
              height={56}
              alignItems="center"
              justifyContent="center">
              <SemiBold fontSize={18} color="Primary/950">
                Mark as Resolved
              </SemiBold>
            </Container>
          </TouchableOpacity>
        </Row>
      </Container>
    </Fill>
  );
}
