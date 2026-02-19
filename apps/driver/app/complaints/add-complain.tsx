import { useShadow } from "@brocabs/ui";
import { Column, Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Paperclip, Trash2 } from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";
import LoaderKit from "react-native-loader-kit";
import Modal from "react-native-modal";
import PagerView from "react-native-pager-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FileType } from "~/constants";
import { DropdownField, type Option } from "~/shared/ui/dropdown";
import { FormIDPicker } from "~/shared/ui/form/form-id-picker";

const STEPS = ["Subject", "Trip", "Describe", "Review"] as const;
type Step = (typeof STEPS)[number];

interface ComplaintFormData {
  subject: string;
  tripId: string | null;
  description: string;
  desiredOutcome: string;
  attachments: FileType[];
}

interface Trip {
  id: string;
  date: string;
  from: string;
  to: string;
  price: string;
}

const MOCK_TRIPS: Trip[] = [
  {
    id: "1",
    date: "June 4 at 9:08 AM",
    from: "Lahore, Punjab",
    to: "Karachi, Sindh",
    price: "R 55.00",
  },
  {
    id: "2",
    date: "June 4 at 9:08 AM",
    from: "Lahore, Punjab",
    to: "Karachi, Sindh",
    price: "R 55.00",
  },
  {
    id: "3",
    date: "June 4 at 9:08 AM",
    from: "Lahore, Punjab",
    to: "Karachi, Sindh",
    price: "R 55.00",
  },
];

const SUGGESTED_SUBJECTS = [
  "Rider Behavior",
  "Payment Issue",
  "Trip Cancellation",
  "No-Show",
  "App/Technical Issue",
  "Safety Concern",
];

const DESIRED_OUTCOME_OPTIONS: Option[] = [
  { label: "Compensation", value: "compensation" },
  { label: "Payment Adjustment", value: "payment_adjustment" },
  { label: "Rider Warning", value: "rider_warning" },
  { label: "Trip Fee Adjustment", value: "trip_fee_adjustment" },
  { label: "Other", value: "other" },
];

function StepIndicator({ steps, currentStep }: { steps: readonly string[]; currentStep: number }) {
  return (
    <Container px={20} py={16}>
      <Row alignItems="center" justifyContent="space-between">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              <Container
                backgroundColor={isActive || isCompleted ? "Primary/600" : "transparent"}
                borderRadius={20}
                px={16}
                py={2}
                borderWidth={isActive || isCompleted ? 0 : 1}
                borderColor="Neutrals/400"
                alignItems="center"
                justifyContent="center">
                <Medium
                  fontSize={14}
                  color={isActive || isCompleted ? "Primary/950" : "Neutrals/400"}>
                  {step}
                </Medium>
              </Container>
              {!isLast && (
                <Container
                  height={1}
                  width={16}
                  backgroundColor={isCompleted ? "Primary/600" : "Neutrals/400"}
                />
              )}
            </React.Fragment>
          );
        })}
      </Row>
    </Container>
  );
}

function SubjectStep({
  subject,
  onSubjectChange,
}: {
  subject: string;
  onSubjectChange: (value: string) => void;
}) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Container px={20} pt={16} gap={16}>
        <Container gap={10}>
          <Regular fontSize={16} color="Neutrals/400">
            Subject
          </Regular>
          <Container
            backgroundColor="Input Color"
            borderRadius={15}
            px={16}
            height={50}
            borderWidth={1}
            borderColor="Input Color">
            <TextInput
              value={subject}
              onChangeText={onSubjectChange}
              placeholder="Trip or Rider Issue"
              placeholderTextColor={Colors["Neutrals/400"]}
              style={{
                flex: 1,
                fontSize: 16,
                color: Colors["Primary/50"],
              }}
            />
          </Container>
        </Container>

        <Container gap={10}>
          <Regular fontSize={14} color="Neutrals/400">
            Suggested:
          </Regular>
          <Row gap={10} flexWrap="wrap">
            {SUGGESTED_SUBJECTS.map((suggested) => (
              <TouchableOpacity
                key={suggested}
                onPress={() => onSubjectChange(suggested)}
                activeOpacity={0.7}>
                <Container backgroundColor="Primary/950" borderRadius={20} px={16} py={2}>
                  <Regular fontSize={14} color="Primary/600">
                    {suggested}
                  </Regular>
                </Container>
              </TouchableOpacity>
            ))}
          </Row>
        </Container>
      </Container>
    </ScrollView>
  );
}

function TripStep({
  selectedTripId,
  onTripSelect,
  trips,
}: {
  selectedTripId: string | null;
  onTripSelect: (tripId: string) => void;
  trips: Trip[];
}) {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Container px={20} pt={20} gap={20}>
        <SemiBold fontSize={16} color="Primary/50">
          Choose Trip
        </SemiBold>
        <Container gap={12}>
          {trips.map((trip) => {
            const isSelected = selectedTripId === trip.id;
            return (
              <TouchableOpacity
                key={trip.id}
                onPress={() => onTripSelect(trip.id)}
                activeOpacity={0.7}>
                <Container
                  backgroundColor="white"
                  borderRadius={15}
                  px={16}
                  py={16}
                  borderColor={isSelected ? "Primary/600" : "transparent"}
                  style={isSelected ? { borderWidth: 1 } : undefined}>
                  <Row alignItems="center" gap={12}>
                    <Container
                      width={24}
                      height={24}
                      borderRadius={12}
                      borderWidth={3}
                      borderColor={"Primary/600"}
                      alignItems="center"
                      justifyContent="center">
                      {isSelected && (
                        <Container
                          width={12}
                          height={12}
                          borderRadius={6}
                          backgroundColor="Primary/600"
                        />
                      )}
                    </Container>
                    <Column flex={1} gap={4}>
                      <Regular fontSize={12} color="Neutrals/500">
                        {trip.date}
                      </Regular>
                      <Row alignItems="center" gap={4}>
                        <SemiBold fontSize={14} color="Primary/50">
                          {trip.from}
                        </SemiBold>
                        <Regular fontSize={14} color="Primary/50">
                          to {trip.to}
                        </Regular>
                      </Row>
                    </Column>
                    <Regular fontSize={14} color="Success/400">
                      + {trip.price}
                    </Regular>
                  </Row>
                </Container>
              </TouchableOpacity>
            );
          })}
        </Container>
      </Container>
    </ScrollView>
  );
}

function DescribeStep({
  description,
  onDescriptionChange,
  desiredOutcome,
  onDesiredOutcomeChange,
  attachments,
  onAttachmentsChange,
}: {
  description: string;
  onDescriptionChange: (value: string) => void;
  desiredOutcome: string;
  onDesiredOutcomeChange: (value: string) => void;
  attachments: FileType[];
  onAttachmentsChange: (files: FileType[]) => void;
}) {
  const shadow = useShadow(2, "penumbra");
  const handleFileAdd = (file: FileType | null) => {
    if (file) {
      onAttachmentsChange([...attachments, file]);
    }
  };

  const handleFileRemove = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Container px={20} pt={20} gap={16}>
        <Container gap={10}>
          <Regular fontSize={16} color="Neutrals/400">
            Explain your problem
          </Regular>
          <Container
            backgroundColor="Input Color"
            borderRadius={15}
            px={16}
            py={12}
            minHeight={120}
            borderWidth={1}
            borderColor="Input Color">
            <TextInput
              value={description}
              onChangeText={onDescriptionChange}
              placeholder="Explain your problem here...."
              placeholderTextColor={Colors["Neutrals/400"]}
              multiline
              numberOfLines={5}
              maxLength={500}
              style={{
                flex: 1,
                fontSize: 16,
                color: Colors["Primary/50"],
                textAlignVertical: "top",
              }}
            />
          </Container>
          <Regular fontSize={12} color="Neutrals/500">
            Less than 500 characters
          </Regular>
        </Container>

        <Container gap={10}>
          <Regular fontSize={16} color="Neutrals/400">
            Desired outcome:
          </Regular>
          <DropdownField
            value={desiredOutcome}
            placeholder="Select outcome"
            data={DESIRED_OUTCOME_OPTIONS}
            onChange={(value) => onDesiredOutcomeChange(String(value))}
          />
        </Container>

        <Container gap={10}>
          <FormIDPicker
            label="Upload your evidence"
            value={null}
            onChange={handleFileAdd}
            required={false}
          />
          <Regular fontSize={12} color="Neutrals/500">
            File Size: Min 5 MB, File Format: Png, pdf, svg
          </Regular>

          {attachments.length > 0 && (
            <Container gap={8}>
              {attachments.map((attachment, index) => (
                <Container
                  key={index}
                  backgroundColor="white"
                  style={shadow}
                  borderRadius={10}
                  px={12}
                  py={12}
                  flexDirection="row"
                  alignItems="center"
                  gap={12}>
                  <Paperclip width={20} height={20} color={Colors["Warning/400"]} />
                  <Column flex={1}>
                    <Regular fontSize={14} color="Primary/50">
                      {attachment.fileName || "file.pdf"}
                    </Regular>
                  </Column>
                  <Regular fontSize={12} color="Neutrals/500">
                    5 MB
                  </Regular>
                  <TouchableOpacity onPress={() => handleFileRemove(index)}>
                    <Trash2 width={18} height={18} color={Colors["Danger/600"]} />
                  </TouchableOpacity>
                </Container>
              ))}
            </Container>
          )}
        </Container>
      </Container>
    </ScrollView>
  );
}

function ReviewStep({
  formData,
  selectedTrip,
}: {
  formData: ComplaintFormData;
  selectedTrip: Trip | null;
}) {
  const shadow = useShadow(2, "penumbra");

  const desiredOutcomeLabel =
    DESIRED_OUTCOME_OPTIONS.find((opt) => opt.value === formData.desiredOutcome)?.label ||
    formData.desiredOutcome;

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <Container px={20} pt={20} gap={16}>
        {/* Complaint Details Card */}
        <Container backgroundColor="white" borderRadius={20} px={20} py={16} style={shadow}>
          <InfoRow label="Subject" value={formData.subject} />
          <Container height={1} backgroundColor="Neutrals/100" my={1} />
          <InfoRow label="Trip ID" value={selectedTrip?.id || "N/A"} />
          <Container height={1} backgroundColor="Neutrals/100" my={1} />
          <Container justifyContent="space-between" alignItems="flex-start" py={12} gap={10}>
            <Medium fontSize={14} color="Neutrals/400" style={{ flex: 1 }}>
              Description
            </Medium>
            <Container flex={1} alignItems="flex-end">
              <Regular fontSize={14} color="Primary/50">
                {formData.description}
              </Regular>
            </Container>
          </Container>
        </Container>

        {/* Desired Outcome Card */}
        <Container backgroundColor="white" borderRadius={20} px={20} py={16} style={shadow}>
          <InfoRow label="Desired outcome:" value={desiredOutcomeLabel} />
        </Container>

        {/* Attachments Section */}
        {formData.attachments.length > 0 && (
          <Container gap={12}>
            <SemiBold fontSize={16} color="Primary/50">
              Attachments
            </SemiBold>
            <Container backgroundColor="white" borderRadius={20} style={shadow}>
              {formData.attachments.map((attachment, index) => (
                <Container key={index}>
                  <Row alignItems="center" gap={12} py={12} px={16}>
                    <Paperclip width={30} height={30} color={Colors["Warning/400"]} />
                    <Column flex={1}>
                      <Regular fontSize={14} color="Primary/50">
                        {attachment.fileName || "file.pdf"}
                      </Regular>
                    </Column>
                    <Regular fontSize={12} color="Neutrals/500">
                      5 MB
                    </Regular>
                  </Row>
                  {index < formData.attachments.length - 1 && (
                    <Container height={1} backgroundColor="Neutrals/100" mx={16} />
                  )}
                </Container>
              ))}
            </Container>
          </Container>
        )}
      </Container>
    </ScrollView>
  );
}

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

function ProcessingModal({ visible }: { visible: boolean }) {
  return (
    <Modal
      isVisible={visible}
      style={{ margin: 0, padding: 0 }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="rgba(10, 2, 26, 0.4)"
      backdropOpacity={1}
      useNativeDriver>
      <View style={styles.modalBackdrop}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        <Container
          backgroundColor="white"
          borderRadius={30}
          px={30}
          py={40}
          gap={24}
          alignItems="center"
          style={styles.modalCard}>
          <LoaderKit
            style={{ width: 50, height: 50 }}
            name={Platform.OS === "ios" ? "CircleStrokeSpin" : "LineSpinFadeLoader"}
            color={Colors["Success/600"]}
          />
          <Column gap={16} alignItems="center">
            <SemiBold fontSize={22} color="Primary/50" textAlign="center">
              Processing....
            </SemiBold>
            <Regular fontSize={16} color="Neutrals/500" textAlign="center">
              Please wait! Your action is under process
            </Regular>
          </Column>
        </Container>
      </View>
    </Modal>
  );
}

export default function AddComplaintScreen() {
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<ComplaintFormData>({
    subject: "",
    tripId: null,
    description: "",
    desiredOutcome: "",
    attachments: [],
  });

  const selectedTrip = MOCK_TRIPS.find((t) => t.id === formData.tripId) || null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      const nextStep = currentStep + 1;
      pagerRef.current?.setPage(nextStep);
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      pagerRef.current?.setPage(prevStep);
      setCurrentStep(prevStep);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // TODO: Implement actual submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    router.back();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.subject.trim().length > 0;
      case 1:
        return formData.tripId !== null;
      case 2:
        return formData.description.trim().length > 0 && formData.desiredOutcome.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Fill backgroundColor="Bg Color">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setCurrentStep(e.nativeEvent.position)}
        scrollEnabled={false}>
        <Container key="subject">
          <SubjectStep
            subject={formData.subject}
            onSubjectChange={(value) => setFormData({ ...formData, subject: value })}
          />
        </Container>
        <Container key="trip">
          <TripStep
            selectedTripId={formData.tripId}
            onTripSelect={(tripId) => setFormData({ ...formData, tripId })}
            trips={MOCK_TRIPS}
          />
        </Container>
        <Container key="describe">
          <DescribeStep
            description={formData.description}
            onDescriptionChange={(value) => setFormData({ ...formData, description: value })}
            desiredOutcome={formData.desiredOutcome}
            onDesiredOutcomeChange={(value) => setFormData({ ...formData, desiredOutcome: value })}
            attachments={formData.attachments}
            onAttachmentsChange={(files) => setFormData({ ...formData, attachments: files })}
          />
        </Container>
        <Container key="review">
          <ReviewStep formData={formData} selectedTrip={selectedTrip} />
        </Container>
      </PagerView>

      {/* Navigation Buttons */}
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
          <TouchableOpacity style={{ flex: 1 }} onPress={handleBack} activeOpacity={0.7}>
            <Container
              backgroundColor="Primary/950"
              borderRadius={20}
              height={56}
              alignItems="center"
              justifyContent="center">
              <Regular fontSize={18} color="Primary/600">
                {currentStep === 0 ? "Back" : "Back"}
              </Regular>
            </Container>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={currentStep === STEPS.length - 1 ? handleSubmit : handleNext}
            disabled={!canProceed()}
            activeOpacity={0.7}>
            <Container
              backgroundColor={canProceed() ? "Primary/600" : "Neutrals/300"}
              borderRadius={20}
              height={56}
              alignItems="center"
              justifyContent="center">
              <SemiBold
                fontSize={18}
                color={currentStep === STEPS.length - 1 ? "Primary/950" : "white"}>
                {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
              </SemiBold>
            </Container>
          </TouchableOpacity>
        </Row>
      </Container>

      <ProcessingModal visible={isProcessing} />
    </Fill>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    maxWidth: 350,
    shadowColor: "#3A0CA3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
