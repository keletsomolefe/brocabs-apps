import { Container, Row } from "@brocabs/ui/layout";
import { Regular } from "@brocabs/ui/text";
import { Colors } from "@brocabs/ui/theme/colors";
import { TouchableOpacity } from "react-native";
import { Icon } from "~/shared/ui/icons";

interface Props {
  label?: string;
  placeholder: string;
  value?: string;
  options: { label: string; value: string }[];
  error?: string;
  onPress: () => void;
  required?: boolean;
}

export function SheetSelectTrigger({
  label,
  placeholder,
  value,
  options,
  error,
  onPress,
  required,
}: Props) {
  const selectedOption = options.find((o) => o.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;
  const isSelected = !!selectedOption;

  return (
    <Container gap={8}>
      {label && (
        <Regular color="black-700" fontSize={18}>
          {label} {required && <Regular color="Secondary/600">*</Regular>}
        </Regular>
      )}
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Row
          height={56}
          backgroundColor="Input Color"
          borderRadius={20}
          alignItems="center"
          justifyContent="space-between"
          px={22}
          borderWidth={1}
          borderColor={error ? "Secondary/600" : "Input Color"}>
          <Regular fontSize={16} color={isSelected ? "Neutrals/900" : "black-400"}>
            {displayValue}
          </Regular>
          <Icon name="drop-down" width={20} height={20} color={Colors["Neutrals/400"]} />
        </Row>
      </TouchableOpacity>
      {error && (
        <Regular color="Secondary/600" fontSize={12}>
          {error}
        </Regular>
      )}
    </Container>
  );
}
