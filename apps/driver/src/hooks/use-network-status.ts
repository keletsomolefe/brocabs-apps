import NetInfo from "@react-native-community/netinfo";
import { useCallback, useEffect, useState } from "react";

interface NetworkState {
  isConnected: boolean | null;
  retry: () => void;
}

/**
 * Hook to monitor network connectivity.
 * Returns isConnected (true when online, false when offline, null while checking)
 * and a retry function to re-check connectivity.
 */
export function useNetworkStatus(): NetworkState {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const retry = useCallback(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    // Initial fetch
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected, retry };
}
