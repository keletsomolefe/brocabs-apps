import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { operatingZonesApi, profilesApi } from "~/api";
import { useUser } from "~/hooks/use-auth";
import { DropdownField, type Option } from "~/shared/ui/dropdown";
import { Icon } from "~/shared/ui/icons";
import { navigateBasedOnSession } from "~/utils/session-navigation";

import { Button } from "@brocabs/ui/button";
import { Container, Fill, Row } from "@brocabs/ui/layout";
import { Bold, Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { PressableScale } from "pressto";

const schema = z.object({
  selectedAreas: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, "At least one service area is required"),
});

type FormFields = z.infer<typeof schema>;

export default function AreaOfOperationScreen() {
  const insets = useSafeAreaInsets();
  const { refetch } = useUser({ enabled: false });
  const [selectedZoneStart, setSelectedZoneId] = useState<string | null>(null);

  // Fetch zones
  const { data: zones } = useQuery({
    queryKey: ["operating-zones"],
    queryFn: async () => {
      const res = await operatingZonesApi.operatingZonesControllerFindAll({ activeOnly: true });
      return res || [];
    },
  });

  // Fetch driver profile to identify selected areas
  const { data: profileResponse } = useQuery({
    queryKey: ["driver-profile"],
    queryFn: () => profilesApi.driverProfileControllerGetDriverProfile(),
  });

  const zoneOptions: Option[] = useMemo(() => {
    return (zones || []).map((z) => ({ label: z.name, value: z.id }));
  }, [zones]);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormFields, any, FormFields>({
    resolver: zodResolver(schema as never) as Resolver<FormFields, any, FormFields>,
    mode: "onChange",
    defaultValues: {
      selectedAreas: [],
    },
  });

  // Populate form with existing areas from profile
  useEffect(() => {
    if (profileResponse?.data?.operatingZones) {
      const areas = profileResponse.data.operatingZones.map(({ id, name }) => ({
        id,
        name,
      }));
      if (areas.length > 0) {
        setValue("selectedAreas", areas);
      }
    }
  }, [profileResponse, setValue]);

  const selectedAreas = watch("selectedAreas");

  const mutation = useMutation({
    mutationFn: (data: FormFields) =>
      profilesApi.driverProfileControllerUpdateServiceAreas({
        updateServiceAreasDto: { zoneIds: data.selectedAreas.map((a) => a.id) },
      }),
    onSuccess: async () => {
      const { data } = await refetch();
      navigateBasedOnSession(data);
    },
    onError: (error) => {
      console.error("Failed to update service areas", error);
    },
  });

  const handleAddArea = useCallback(() => {
    if (!selectedZoneStart) return;

    const zone = zones?.find((z) => z.id === selectedZoneStart);
    if (!zone) return;

    if (selectedAreas.some((area) => area.id === selectedZoneStart)) {
      setSelectedZoneId(null);
      return;
    }

    const newAreas = [...selectedAreas, { id: zone.id, name: zone.name }];
    setValue("selectedAreas", newAreas);
    setSelectedZoneId(null);
  }, [selectedZoneStart, selectedAreas, setValue, zones]);

  const handleRemoveArea = useCallback(
    (id: string) => {
      setValue(
        "selectedAreas",
        selectedAreas.filter((area) => area.id !== id)
      );
    },
    [selectedAreas, setValue]
  );

  const onSubmit = useCallback(
    (data: FormFields) => {
      mutation.mutate(data);
    },
    [mutation]
  );

  return (
    <Fill backgroundColor="Neutrals/50">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 + insets.bottom, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}>
        <Container px={20} gap={36}>
          <Container gap={24}>
            <Container alignItems="center" gap={4}>
              <Bold fontSize={20} color="Primary/50">
                Service Areas
              </Bold>
              <Regular fontSize={18} center color="black-500">
                Where will you operate? choose from the options below
              </Regular>
            </Container>

            <Row gap={8} alignItems="center">
              <Container flex={1}>
                <DropdownField
                  value={selectedZoneStart || ""}
                  placeholder="Select the area"
                  style={styles.dropdown}
                  rightIconColor={Colors["Primary/600"]}
                  data={zoneOptions.filter(
                    (p) => !selectedAreas.some((area) => area.id === p.value)
                  )}
                  onChange={(value) => setSelectedZoneId(String(value))}
                />
              </Container>
              <PressableScale onPress={handleAddArea} enabled={!!selectedZoneStart}>
                <Container
                  style={[styles.addButton, !selectedZoneStart && styles.addButtonDisabled]}>
                  <SemiBold style={styles.addButtonText} fontSize={18}>
                    Add
                  </SemiBold>
                </Container>
              </PressableScale>
            </Row>
          </Container>

          {selectedAreas.length > 0 && (
            <Container gap={14}>
              <Medium fontSize={14} color="black-800">
                Selected Areas
              </Medium>
              <Container gap={20}>
                {selectedAreas.map((area, index) => (
                  <Container
                    key={area.id}
                    backgroundColor="white"
                    borderRadius={20}
                    p={16}
                    gap={20}>
                    <Container
                      height={95}
                      backgroundColor="Neutrals/100"
                      borderRadius={10}
                      alignItems="center"
                      justifyContent="center"
                      style={styles.areaIconContainer}>
                      <Icon name="map-pin" width={32} height={32} color={Colors["Primary/400"]} />
                    </Container>

                    <Row justifyContent="space-between" alignItems="center">
                      <Container gap={4}>
                        <Medium fontSize={9} color="black-600">
                          Area {index + 1}
                        </Medium>
                        <SemiBold fontSize={14} color="Primary/50">
                          {area.name}
                        </SemiBold>
                      </Container>
                      <Row gap={10} alignItems="center">
                        <PressableScale onPress={() => {}}>
                          <Icon
                            name="edit-fill"
                            width={24}
                            height={24}
                            color={Colors["Primary/600"]}
                          />
                        </PressableScale>
                        <PressableScale onPress={() => handleRemoveArea(area.id)}>
                          <Container
                            backgroundColor="Secondary/400"
                            style={styles.removeButton}
                            borderRadius={20}
                            height={35}
                            px={10}
                            alignItems="center"
                            justifyContent="center">
                            <Regular fontSize={14} color="white">
                              Remove
                            </Regular>
                          </Container>
                        </PressableScale>
                      </Row>
                    </Row>
                  </Container>
                ))}
              </Container>
            </Container>
          )}

          {errors.selectedAreas && (
            <Regular color="Secondary/600" fontSize={16} center>
              {errors.selectedAreas.message}
            </Regular>
          )}

          <Button
            label="Continue"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            radius="rounded"
            isLoading={mutation.isPending}
            disabled={selectedAreas.length === 0}
          />
        </Container>
      </ScrollView>
    </Fill>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: Colors["Primary/400"],
    borderRadius: 20,
    width: 78,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: "white",
  },
  dropdown: {
    height: 56,
    backgroundColor: Colors["Input Color"],
    borderRadius: 20,
  },
  areaIconContainer: {
    overflow: "hidden",
  },
  removeButton: {
    opacity: 0.4,
  },
});
