import { WalletShimmer } from "../components";
import { useBalance } from "../hooks/use-balance";
import { useSavedCards } from "../hooks/use-saved-cards";
import { useTransactions } from "../hooks/user-transactions";
import { WalletDashboardScreen } from "./wallet-dashboard";

/**
 * WalletScreen
 *
 * Main orchestrator for the wallet flow.
 * Renders different screens based on the current flow state.
 *
 * Flow (Simplified):
 * 1. Empty wallet → Show "Fund Your Wallet"
 * 2. User enters amount → Create checkout session
 * 3. Open checkout in WebView → User pays and optionally saves card
 * 4. Success → Show confirmation, refetch cards/balance
 * 5. Dashboard → Show balance, cards, transactions
 */
export function WalletScreen() {
  const mySavedCards = useSavedCards();
  const transactionsQuery = useTransactions();
  const walletBalanceQuery = useBalance();

  const isLoading =
    mySavedCards.isLoading || walletBalanceQuery.isLoading || transactionsQuery.isLoading;
  if (isLoading) {
    return <WalletShimmer />;
  }

  return (
    <WalletDashboardScreen
      mySavedCards={mySavedCards.data}
      transactions={transactionsQuery.data}
      walletBalance={walletBalanceQuery.data}
    />
  );
}
