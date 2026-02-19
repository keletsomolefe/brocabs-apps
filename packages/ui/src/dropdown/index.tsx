import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import { Icon } from "../icons/icon";
import { Container } from "../layout";
import { Colors } from "../theme/colors";
import { FontFamily } from "../theme/fonts";

export function DropdownField(props: DropdownFieldProps) {
  const [value, setValue] = useState<number | string | null>(
    props.value || null,
  );
  const [isFocus, setIsFocus] = useState(false);
  const { placeholder, data, onChange, icon, disabled, error } = props;

  return (
    <Container>
      <Dropdown
        style={[
          stylesheet.dropdown,
          isFocus && { borderColor: Colors["Primary/400"] },
          error ? stylesheet.dropdownError : null,
        ]}
        placeholderStyle={stylesheet.placeholderStyle}
        selectedTextStyle={stylesheet.selectedTextStyle}
        inputSearchStyle={stylesheet.inputSearchStyle}
        fontFamily={FontFamily.Regular}
        iconStyle={stylesheet.iconStyle}
        disable={disabled}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        search
        searchPlaceholder="Search..."
        containerStyle={{
          borderRadius: 15,
          borderColor: Colors["Input Color"],
          marginTop: 8,
        }}
        placeholder={!isFocus ? placeholder ?? "Select item" : "..."}
        renderRightIcon={() => (
          <Icon
            name="drop-down"
            style={stylesheet.icon}
            color={Colors["Neutrals/400"]}
          />
        )}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        renderLeftIcon={icon}
        onChange={(item) => {
          setValue(item.value);
          setIsFocus(false);
          onChange(item.value);
        }}
      />
    </Container>
  );
}

const stylesheet = StyleSheet.create({
  dropdown: {
    height: 50,
    backgroundColor: Colors["Input Color"],
    borderColor: Colors["Input Color"],
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  dropdownError: {
    borderColor: Colors["Secondary/600"],
    borderWidth: 1,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: Colors.white,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: FontFamily.Medium,
  },
  placeholderStyle: {
    fontSize: 16,
    fontFamily: FontFamily.Medium,
    color: Colors["black-400"],
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

/** Type definitions */
export interface Option {
  label: string;
  value: number | string;
}

interface DropdownFieldProps {
  value: number | string;
  placeholder: string;
  data: Option[];
  disabled?: boolean;
  icon?: (visible?: boolean) => React.ReactElement | null;
  onChange: (value: number | string) => void;
  error?: string;
}
