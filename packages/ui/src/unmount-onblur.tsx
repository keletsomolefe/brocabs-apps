import { useIsFocused } from "@react-navigation/native";
import { PropsWithChildren, useEffect, useState } from "react";
import { View } from "react-native";

export function UnmountOnBlur({ children }: PropsWithChildren<unknown>) {
  const isFocused = useIsFocused();
  const [isDelayedUnmount, setIsDelayedUnmount] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      const timeout = setTimeout(() => {
        setIsDelayedUnmount(true);
      }, 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsDelayedUnmount(false);
    }
  }, [isFocused]);

  if (isFocused || !isDelayedUnmount) {
    return children;
  }

  return <View style={{ flex: 1 }} />;
}
