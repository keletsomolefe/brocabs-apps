import { Column, Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Option {
  label: string;
  value: string;
}

interface Props {
  title: string;
  subtitle?: string;
  options: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export const SelectionSheet = forwardRef<BottomSheetModal, Props>((props, ref) => {
  const { title, subtitle, options, selectedValue, onSelect } = props;
  const insets = useSafeAreaInsets();

  const handleSelect = (value: string) => {
    onSelect(value);
    (ref as React.RefObject<BottomSheetModal | null>)?.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      topInset={insets.top}
      enableDynamicSizing={true}
      backdropComponent={Backdrop}
      handleIndicatorStyle={{ backgroundColor: Colors["Neutrals/100"] }}
      backgroundStyle={{
        backgroundColor: Colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
      enablePanDownToClose>
      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}>
        <Column gap={16}>
          <SemiBold fontSize={20} color="Primary/50">
            {title}
          </SemiBold>
          {subtitle && (
            <Regular fontSize={14} lineHeight={20} color="Neutrals/400">
              {subtitle}
            </Regular>
          )}
          <Column gap={8}>
            {options.map((item) => {
              const isSelected = selectedValue === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleSelect(item.value)}
                  activeOpacity={0.7}>
                  <Container
                    backgroundColor={isSelected ? "Primary/600" : "transparent"}
                    borderRadius={32}
                    px={16}
                    py={12}
                    borderWidth={isSelected ? 0 : 1}
                    borderColor="Primary/400">
                    <Medium fontSize={16} color={isSelected ? "white" : "Neutrals/900"}>
                      {item.label}
                    </Medium>
                  </Container>
                </TouchableOpacity>
              );
            })}
          </Column>
        </Column>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

SelectionSheet.displayName = "SelectionSheet";
