import { Container } from "@brocabs/ui/layout";
import { Bold } from "@brocabs/ui/text";
import MaskedView from "@react-native-masked-view/masked-view";
import React from "react";
import { useTranslation } from "~/i18n/LocaleContext";

interface BroScholarTextProps {
  fontSize?: number;
  lineHeight?: number;
  width?: number;
}

export function BroScholarText({ fontSize = 20, lineHeight = 28, width = 90 }: BroScholarTextProps) {
  const { t } = useTranslation();
  return (
    <MaskedView
      style={{ width, flexDirection: "row", height: lineHeight }}
      maskElement={
        <Bold fontSize={fontSize} lineHeight={lineHeight}>
          {t("common.broSclr")}
        </Bold>
      }>
      <Container
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: "#A000FF",
          transform: [{ rotate: "22.5deg" }, { scale: 1.5 }],
        }}
      />
      <Container
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: "#5905FF",
          transform: [{ rotate: "22.5deg" }, { scale: 1.5 }],
        }}
      />
      <Container
        style={{
          flex: 1,
          height: "100%",
          backgroundColor: "#E4211E",
          transform: [{ rotate: "22.5deg" }, { scale: 1.5 }],
        }}
      />
    </MaskedView>
  );
}
