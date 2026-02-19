import React, { PropsWithChildren, useContext } from "react";
import { NoNetworkModal } from "~/components/no-network-modal";
import { useNetworkStatus } from "~/hooks/use-network-status";

interface NetworkContextValue {
  isConnected: boolean | null;
  retry: () => void;
}

const NetworkContext = React.createContext<NetworkContextValue | null>(null);

/**
 * NetworkProvider
 * Wraps the app and monitors network connectivity.
 * Shows NoNetworkModal when offline, allowing the modal to appear
 * on top of all wrapped components.
 */
export function NetworkProvider({ children }: PropsWithChildren<unknown>) {
  const { isConnected, retry } = useNetworkStatus();

  return (
    <NetworkContext.Provider value={{ isConnected, retry }}>
      {children}
      <NoNetworkModal visible={isConnected === false} onRetry={retry} />
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
