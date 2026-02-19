import styled from "@emotion/native";
import { TextInput } from "react-native";
import { Colors } from "../theme/colors";

import { FontFamily } from "../theme/fonts";

export const Input = styled(TextInput)`
  flex: 1;
  font-size: 16px;
  font-family: ${FontFamily.Regular};
  border-radius: 10px;
  color: ${Colors.black};
`;
