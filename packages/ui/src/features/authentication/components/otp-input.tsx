import { Colors } from "@brocabs/ui/theme/colors";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { TouchableOpacity } from "../../../layout";
import { Regular } from "../../../text";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (code: string) => void;
  error?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  error = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(
    autoFocus ? 0 : null,
  );
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChangeText = (text: string, index: number) => {
    // Only allow numbers
    const cleanedText = text.replace(/[^0-9]/g, "");

    if (cleanedText.length === 0) {
      // Handle backspace
      const newCode = value.split("");
      newCode[index] = "";
      onChange(newCode.join(""));

      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
      return;
    }

    // Handle paste of multiple digits
    if (cleanedText.length > 1) {
      const digits = cleanedText.slice(0, length).split("");
      const newCode = value.split("");

      digits.forEach((digit, i) => {
        if (index + i < length) {
          newCode[index + i] = digit;
        }
      });

      onChange(newCode.join(""));

      const nextIndex = Math.min(index + digits.length, length - 1);
      inputs.current[nextIndex]?.focus();
      return;
    }

    // Handle single digit
    const newCode = value.split("");
    newCode[index] = cleanedText;
    onChange(newCode.join(""));

    if (index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePress = (index: number) => {
    inputs.current[index]?.focus();
  };

  useEffect(() => {
    if (autoFocus && inputs.current[0]) {
      inputs.current[0].focus();
    }
  }, [autoFocus]);

  const digits = value.split("");

  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => {
        const isFocused = focusedIndex === index;
        const hasValue = Boolean(digits[index]);
        const borderColor = error
          ? Colors["Secondary/600"]
          : hasValue
            ? Colors["Success/300"]
            : Colors["Input Color"];

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(index)}
            style={[
              styles.cell,
              {
                backgroundColor: Colors["Input Color"],
                borderColor,
                borderWidth: error || hasValue ? 0.6 : 0,
              },
            ]}
            disabled={disabled}
          >
            <TextInput
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={styles.input}
              value={digits[index] || ""}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(null)}
              keyboardType="number-pad"
              editable={!disabled}
              selectTextOnFocus
              textAlign="center"
            />
            {!hasValue && !isFocused && (
              <View style={styles.placeholder}>
                <Regular
                  style={[
                    styles.placeholderText,
                    { color: Colors["Primary/50"] },
                  ]}
                >
                  -
                </Regular>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cell: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  input: {
    position: "absolute",
    width: "100%",
    height: "100%",
    fontSize: 18,
    fontFamily: "BR Hendrix",
    color: Colors["Primary/50"],
    textAlign: "center",
    backgroundColor: "transparent",
  },
  placeholder: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    lineHeight: 24,
  },
});
