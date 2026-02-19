/**
 * Wallet Feature
 *
 * Complete wallet management flow including:
 * - Empty wallet state
 * - Add card flow (scan/manual)
 * - Wallet dashboard
 * - Wallet recharge
 * - Transaction history
 */

// Main screen
export { WalletScreen } from "./screens/wallet-screen";

// Individual screens (for direct navigation if needed)
export { EmptyWalletScreen, SuccessScreen, WalletDashboardScreen } from "./screens";

// Components
export {
  BalanceCard,
  CardVisual,
  SelectionOption,
  TransactionRow,
  WalletHeader,
} from "./components";

// Hooks
export { useSavedCards, useWalletFlow } from "./hooks";

// Store
export { useWalletStore } from "./store";

// Storage
export { walletStorage } from "./storage";

// Types
export * from "./types";

// Constants
export * from "./constants";
