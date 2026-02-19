import { Column, Container, Fill, Row, TouchableOpacity } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { useState } from "react";
import { TextInput, View } from "react-native";
import { useLocale } from "~/i18n/LocaleContext";
import { Icon } from "~/shared/ui/icons";

export default function ContactSupportScreen() {
  const { t } = useLocale();
  const [problem] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Fill backgroundColor="Bg Color" px={20} pt={10}>
      <Column gap={14}>
        {/* Select Problem */}
        <Column gap={14}>
          <Regular fontSize={16} color="Primary/50">
            {t("profile.selectProblem")}
          </Regular>
          <TouchableOpacity
            backgroundColor="Input Color"
            borderRadius={20}
            h={60}
            px={22}
            justifyContent="center"
            activeOpacity={0.8}>
            <Row alignItems="center" justifyContent="space-between">
              <Regular fontSize={14} color="Neutrals/400">
                {problem || t("profile.selectProblem")}
              </Regular>
              <View style={{ transform: [{ rotate: "90deg" }] }}>
                <Icon name="next-ltr" width={17} height={17} color={Colors["Neutrals/400"]} />
              </View>
            </Row>
          </TouchableOpacity>
        </Column>

        {/* Description */}
        <Column gap={14}>
          <Regular fontSize={16} color="Primary/50">
            {t("profile.selectProblem")}
          </Regular>
          <Container backgroundColor="Input Color" borderRadius={20} h={241} p={20}>
            <TextInput
              placeholder={t("profile.explainProblem")}
              placeholderTextColor={Colors["Neutrals/400"]}
              multiline
              textAlignVertical="top"
              style={{
                flex: 1,
                fontFamily: "BRHendrix-Regular",
                fontSize: 14,
                color: Colors["Primary/50"],
              }}
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />
          </Container>
          <Regular
            fontSize={12}
            color="Neutrals/400"
            style={{ alignSelf: "flex-end", fontStyle: "italic", fontFamily: undefined }}>
            {t("profile.charLimit")}
          </Regular>
        </Column>
      </Column>

      {/* Submit Button */}
      <TouchableOpacity
        backgroundColor="Primary/600"
        borderRadius={20}
        h={66}
        justifyContent="center"
        alignItems="center"
        mt={30}
        activeOpacity={0.8}>
        <Regular fontSize={18} color="Primary/950">
          {t("common.submit")}
        </Regular>
      </TouchableOpacity>
    </Fill>
  );
}
