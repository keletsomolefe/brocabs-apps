import {
  QueryKeys,
  RechargeWalletDto,
  RechargeWalletDtoMethodEnum,
  WalletBalanceDto,
} from "@brocabs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { cardsApi, walletApi } from "~/api";
import { useUser } from "~/hooks/use-auth";

import { WALLET_QUERY_KEYS } from "../constants";
import { useWalletStore } from "../store";
import type { RechargeFormData } from "../types";
import { useSavedCards } from "./use-saved-cards";
import { useTransactions } from "./user-transactions";

/**
 * Generate a simple UUID v4 for idempotency keys
 */
function generateIdempotencyKey(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Extract error message from various error types
 */
const getErrorMessage = (error: unknown): string => {
  // Handle ResponseError from generated API client
  if (error && typeof error === "object" && "response" in error) {
    const responseError = error as { response?: Response };
    if (responseError.response) {
      // Try to extract error message from response
      const status = responseError.response.status;
      const statusText = responseError.response.statusText;

      // For 400/422, try to get body message
      if (status === 400 || status === 422) {
        return `Invalid request: ${statusText || "Please check your input"}`;
      }
      if (status === 401) {
        return "Please log in again";
      }
      if (status === 403) {
        return "You don't have permission to perform this action";
      }
      if (status >= 500) {
        return "Server error. Please try again later";
      }
      return `Request failed: ${statusText || `Error ${status}`}`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unexpected error occurred";
};

/**
 * useWalletFlow Hook
 *
 * Central hook for managing wallet flow state and API operations.
 * Uses Zustand store for shared navigation state.
 * Uses the Generated API Client exclusively - no raw fetch calls.
 *
 * Features:
 * - Proper error handling for all API operations
 * - Loading states tracked via mutations
 * - Success/error states for card saving and recharge flows
 */
export function useWalletFlow() {
  const queryClient = useQueryClient();

  // Get authenticated user
  const { data: userData } = useUser();
  const authenticated = userData?.authenticated;

  // Get shared flow state from Zustand store
  const {
    flowState,
    selectedCardEntryMethod,
    selectedCardId,
    error,
    cardSaving,
    recharge,
    setSelectedCardId,
    setError,
    setCardSavingError,
    setAuthorizationUrl,
    resetCardSaving,
    startRecharge,
    setCheckoutReady,
    setRechargeSuccess,
    setRechargeError,
    resetRecharge,
    navigateToAddCard,
    navigateToManualEntry,
    navigateToScanCard,
    navigateToDashboard,
    navigateToRecharge,
    navigateToViewAllCards,
    navigateToError,
    resetFlow,
  } = useWalletStore();

  // Use the token ID from the store if available (for immediate feedback after creation)
  // otherwise fall back to the user profile token ID

  // ============================================
  // QUERIES - Using Generated API Client
  // ============================================

  /**
   * Fetch wallet balance from real API
   */
  const balanceQuery = useQuery<WalletBalanceDto>({
    queryKey: WALLET_QUERY_KEYS.balance,
    queryFn: () => walletApi.walletControllerGetBalance(),
    enabled: !!authenticated,
  });

  /**
   * Fetch transaction history from real API
   */
  const transactionsQuery = useTransactions();

  const mySavedCards = useSavedCards();

  // ============================================
  // MUTATIONS - With proper error handling
  // ============================================

  /**
   * Recharge wallet using saved card or checkout
   */
  const rechargeMutation = useMutation({
    mutationFn: async (data: RechargeFormData) => {
      const rechargeDto: RechargeWalletDto = {
        amount: data.amount,
        method: data.cardId ? "CARD" : ("CHECKOUT" as RechargeWalletDtoMethodEnum),
        cardId: data.cardId,
        // buyerTokenId is now optional and handled by backend
      };

      return walletApi.walletControllerRechargeWallet({
        rechargeWalletDto: rechargeDto,
      });
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.balance });
      queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AUTHENTICATE_USER] });

      // Set success immediately with current balance estimate
      // The balance will be updated when the query refetches
      const currentBalance = balanceQuery.data?.balance ?? 0;
      const rechargeAmt = recharge.amount ?? 0;
      setRechargeSuccess(currentBalance + rechargeAmt);
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err);
      setRechargeError(message);
    },
  });

  /**
   * Create checkout session for adding a card
   */
  const createCheckoutMutation = useMutation({
    mutationFn: async (params: { title: string; amount: number; buyerTokenId: string }) => {
      return cardsApi.cardControllerCreateCheckout({
        createCheckoutDto: {
          title: params.title,
          description: params.title,
          amount: params.amount,
          buyerTokenId: params.buyerTokenId,
          reference: `card_${Date.now()}`,
        },
      });
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        setAuthorizationUrl(data.checkoutUrl);
      }
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err);
      setCardSavingError(message);
    },
  });

  /**
   * Delete a saved card
   */
  const deleteCardMutation = useMutation({
    mutationFn: async ({ tokenId, cardId }: { tokenId: string; cardId: string }) => {
      return cardsApi.cardControllerDeleteCard({ cardId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: WALLET_QUERY_KEYS.cards(variables.tokenId),
      });
    },
    onError: (err: unknown) => {
      const message = getErrorMessage(err);
      setError(message);
    },
  });

  // ============================================
  // ACTION HANDLERS - With error handling
  // ============================================

  const selectCardForRecharge = useCallback(
    (cardId: string | null) => {
      setSelectedCardId(cardId);
    },
    [setSelectedCardId]
  );

  /**
   * Handle card authorization cancel
   */
  const handleCardAuthorizationCancel = useCallback(() => {
    resetCardSaving();
    navigateToDashboard();
  }, [resetCardSaving, navigateToDashboard]);

  /**
   * Create a checkout session for wallet funding using TradeSafe Token Deposit
   * This generates a payment link that directly adds funds to the user's wallet
   */
  const createCheckoutSession = useCallback(
    async (amount: number, saveCard: boolean = true) => {
      try {
        startRecharge(amount);

        // Use the new token deposit API (adds funds directly to TradeSafe wallet)
        const depositResponse = await walletApi.walletControllerAddFunds({
          addFundsDto: { amount },
        });

        if (!depositResponse.paymentUrl) {
          throw new Error("Failed to create payment link");
        }

        // Store checkout URL and show WebView
        setCheckoutReady(
          depositResponse.paymentUrl,
          depositResponse.transactionId ?? `tx_${Date.now()}`
        );
      } catch (err) {
        console.error("Token deposit creation error:", err);
        const message = getErrorMessage(err);
        setRechargeError(message);
      }
    },
    [startRecharge, setCheckoutReady, setRechargeError]
  );

  /**
   * Handle successful checkout completion
   */
  const handleCheckoutSuccess = useCallback(async () => {
    try {
      const transactionId = recharge.transactionId;

      if (!transactionId) {
        console.warn("No transaction ID found, skipping verification");
        await Promise.all([
          balanceQuery.refetch(),
          mySavedCards.refetch(),
          transactionsQuery.refetch(),
        ]);
        setRechargeSuccess(balanceQuery.data?.balance ?? 0);
        return;
      }

      // Verify and complete the transaction
      try {
        const verifyResponse = await walletApi.walletControllerVerifyCheckoutTransaction({
          transactionId,
        });

        console.log("Transaction verified and completed:", verifyResponse);

        const [balanceResult] = await Promise.all([
          balanceQuery.refetch(),
          mySavedCards.refetch(),
          transactionsQuery.refetch(),
        ]);

        const newBalance = balanceResult.data?.balance ?? 0;
        setRechargeSuccess(newBalance);
      } catch (verifyError) {
        console.warn("Transaction verification failed:", verifyError);

        const [balanceResult] = await Promise.all([
          balanceQuery.refetch(),
          mySavedCards.refetch(),
          transactionsQuery.refetch(),
        ]);

        const newBalance = balanceResult.data?.balance ?? 0;
        const oldBalance = balanceQuery.data?.balance ?? 0;

        if (newBalance > oldBalance) {
          setRechargeSuccess(newBalance);
        } else {
          setRechargeError("Transaction was not completed");
        }
      }
    } catch (err) {
      console.error("Error handling checkout success:", err);
      setRechargeError("An error occurred while verifying the transaction");
    }
  }, [
    recharge.transactionId,
    balanceQuery,
    transactionsQuery,
    setRechargeSuccess,
    mySavedCards,
    setRechargeError,
  ]);

  /**
   * Handle checkout cancellation
   */
  const handleCheckoutCancel = useCallback(() => {
    resetRecharge();
    navigateToDashboard();
  }, [resetRecharge, navigateToDashboard]);

  /**
   * Submit recharge request
   */
  const submitRecharge = useCallback(
    async (data: RechargeFormData) => {
      await createCheckoutSession(data.amount);
    },
    [createCheckoutSession]
  );

  /**
   * Recharge wallet with saved card
   * Wraps the mutation to properly set loading state and amount
   */
  const rechargeWithCard = useCallback(
    async (data: RechargeFormData) => {
      startRecharge(data.amount);
      try {
        await rechargeMutation.mutateAsync(data);
      } catch (err) {
        // Error is already handled in mutation's onError
        throw err;
      }
    },
    [startRecharge, rechargeMutation]
  );

  /**
   * Retry a failed card save operation
   */
  const retryCardSave = useCallback(() => {
    resetCardSaving();
    navigateToManualEntry();
  }, [resetCardSaving, navigateToManualEntry]);

  /**
   * Retry a failed recharge operation
   */
  const retryRecharge = useCallback(() => {
    resetRecharge();
    navigateToRecharge();
  }, [resetRecharge, navigateToRecharge]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const savedCards = mySavedCards.data ?? [];
  const hasCards = savedCards.length > 0;
  const hasBalance = (balanceQuery.data?.balance ?? 0) > 0;
  const isEmpty = !hasCards && !hasBalance && !balanceQuery.isLoading && !mySavedCards.isLoading;
  const isLoading =
    balanceQuery.isLoading ||
    transactionsQuery.isLoading ||
    rechargeMutation.isPending ||
    createCheckoutMutation.isPending;

  // Card saving state helpers
  const isCardSaving = cardSaving.status === "loading";
  const cardSaveError = cardSaving.errorMessage;
  const cardSaveSuccess = cardSaving.status === "success";

  // Recharge state helpers
  const isRecharging = recharge.status === "loading" || rechargeMutation.isPending;
  const rechargeError = recharge.errorMessage;
  const rechargeSuccess = recharge.status === "success";
  const rechargeAmount = recharge.amount;
  const newBalance = recharge.newBalance;

  return {
    // State (from Zustand store)
    flowState,
    selectedCardEntryMethod,
    selectedCardId,
    error,
    isEmpty,
    isLoading,
    hasCards,

    // Card saving state
    isCardSaving,
    cardSaveError,
    cardSaveSuccess,
    cardSaving,

    // Recharge state
    isRecharging,
    rechargeError,
    rechargeSuccess,
    rechargeAmount,
    newBalance,
    recharge: recharge,

    // Queries
    balance: balanceQuery.data,
    balanceLoading: balanceQuery.isLoading,
    balanceError: balanceQuery.error,
    transactions: transactionsQuery.data ?? [],
    transactionsLoading: transactionsQuery.isLoading,
    savedCards,
    cardsLoading: mySavedCards.isLoading,

    // Mutations
    rechargeWallet: rechargeWithCard,
    createCheckout: createCheckoutMutation.mutateAsync,
    deleteCard: deleteCardMutation.mutateAsync,

    // Navigation (from Zustand store)
    navigateToAddCard,
    navigateToManualEntry,
    navigateToScanCard,
    navigateToDashboard,
    navigateToRecharge,
    navigateToViewAllCards,
    navigateToError,
    selectCardForRecharge,

    // Actions
    submitRecharge,
    createCheckoutSession,
    handleCheckoutSuccess,
    handleCheckoutCancel,
    handleCardAuthorizationCancel,
    retryCardSave,
    retryRecharge,
    resetFlow,
    resetCardSaving,
    resetRecharge,

    // Error setters (for WebView error handling)
    setRechargeError,
    setCardSavingError,

    // Refetch helpers
    refetchBalance: balanceQuery.refetch,
    refetchTransactions: transactionsQuery.refetch,
    refetchCards: mySavedCards.refetch,
  };
}
