import { Column, Container } from "@brocabs/ui/layout";
import { Backdrop } from "@brocabs/ui/sheet/backdrop";
import { Medium, Regular, SemiBold } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SupportedLocale } from "~/i18n";
import { useLocale, useTranslation } from "~/i18n/LocaleContext";

export const LanguageSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const { t } = useTranslation();
  const { locale, setLocale, supportedLocales } = useLocale();
  const insets = useSafeAreaInsets();

  const handleSelect = async (code: SupportedLocale) => {
    await setLocale(code);
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
            {t("common.language")}
          </SemiBold>
          <Regular fontSize={14} lineHeight={20} color="Neutrals/400">
            {t("common.chooseLanguage")}
          </Regular>
          <Column gap={8}>
            {supportedLocales.map((item) => {
              const isSelected = locale === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  onPress={() => handleSelect(item.code)}
                  activeOpacity={0.7}>
                  <Container
                    backgroundColor={isSelected ? "Primary/600" : "transparent"}
                    borderRadius={32}
                    px={16}
                    py={12}
                    borderWidth={isSelected ? 0 : 1}
                    borderColor="Primary/400">
                    <Medium fontSize={16} color={isSelected ? "white" : "Neutrals/900"}>
                      {item.nativeName}
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

LanguageSheet.displayName = "LanguageSheet";

export default LanguageSheet;
