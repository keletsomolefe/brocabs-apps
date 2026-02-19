import { create } from "zustand";

import type { CardEntryMethod, WalletFlowState } from "./types";

/**
 * Card saving state for tracking the add card flow
 */
export interface CardSavingState {
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string | null;
  authorizationUrl: string | null;
  tokenId: string | null;
}

/**
 * Recharge state for tracking the recharge flow
 */
export interface RechargeState {
  status: "idle" | "loading" | "checkout" | "success" | "error";
  errorMessage: string | null;
  amount: number | null;
  newBalance: number | null;
  checkoutUrl: string | null;
  transactionId: string | null;
}

/**
 * Wallet Flow Store
 *
 * Shared state for wallet flow navigation and operations.
 * Uses Zustand to ensure state is shared across all components.
 */
interface WalletFlowStore {
  // Flow state
  flowState: WalletFlowState;
  selectedCardEntryMethod: CardEntryMethod;
  selectedCardId: string | null;
  error: string | null;

  // Card saving state
  cardSaving: CardSavingState;

  // Recharge state
  recharge: RechargeState;

  // Actions
  setFlowState: (state: WalletFlowState) => void;
  setSelectedCardEntryMethod: (method: CardEntryMethod) => void;
  setSelectedCardId: (id: string | null) => void;
  setError: (error: string | null) => void;

  // Card saving actions
  startCardSaving: () => void;
  setCardAuthorizationReady: (authorizationUrl: string, tokenId: string) => void;
  setCardSavingSuccess: () => void;
  setCardSavingError: (message: string) => void;
  setAuthorizationUrl: (url: string) => void;
  setTokenId: (tokenId: string) => void;
  resetCardSaving: () => void;

  // Recharge actions
  startRecharge: (amount: number) => void;
  setCheckoutReady: (checkoutUrl: string, transactionId: string) => void;
  setRechargeSuccess: (newBalance: number) => void;
  setRechargeError: (message: string) => void;
  resetRecharge: () => void;

  // Navigation helpers
  navigateToAddCard: () => void;
  navigateToManualEntry: () => void;
  navigateToScanCard: () => void;
  navigateToDashboard: () => void;
  navigateToRecharge: () => void;
  navigateToViewAllCards: () => void;
  navigateToSuccess: () => void;
  navigateToRechargeSuccess: () => void;
  navigateToError: (message: string) => void;
  resetFlow: () => void;
}

const initialCardSavingState: CardSavingState = {
  status: "idle",
  errorMessage: null,
  authorizationUrl: null,
  tokenId: null,
};

const initialRechargeState: RechargeState = {
  status: "idle",
  errorMessage: null,
  amount: null,
  newBalance: null,
  checkoutUrl: null,
  transactionId: null,
};

export const useWalletStore = create<WalletFlowStore>((set) => ({
  // Initial state
  flowState: "dashboard",
  selectedCardEntryMethod: "scan",
  selectedCardId: null,
  error: null,
  cardSaving: initialCardSavingState,
  recharge: initialRechargeState,

  // Basic setters
  setFlowState: (flowState) => set({ flowState }),
  setSelectedCardEntryMethod: (selectedCardEntryMethod) => set({ selectedCardEntryMethod }),
  setSelectedCardId: (selectedCardId) => set({ selectedCardId }),
  setError: (error) => set({ error }),

  // Card saving actions
  startCardSaving: () =>
    set({
      cardSaving: {
        status: "loading",
        errorMessage: null,
        authorizationUrl: null,
        tokenId: null,
      },
      flowState: "processing",
    }),
  setCardAuthorizationReady: (authorizationUrl, tokenId) =>
    set({
      cardSaving: {
        status: "loading",
        errorMessage: null,
        authorizationUrl,
        tokenId,
      },
      flowState: "card-authorization",
    }),
  setCardSavingSuccess: () =>
    set((state) => ({
      cardSaving: {
        ...state.cardSaving,
        status: "success",
        authorizationUrl: null,
        tokenId: null,
      },
      flowState: "success",
    })),
  setCardSavingError: (message) =>
    set({
      cardSaving: {
        status: "error",
        errorMessage: message,
        authorizationUrl: null,
        tokenId: null,
      },
      flowState: "error",
      error: message,
    }),
  setAuthorizationUrl: (url) =>
    set((state) => ({
      cardSaving: {
        ...state.cardSaving,
        authorizationUrl: url,
      },
    })),
  setTokenId: (tokenId) =>
    set((state) => ({
      cardSaving: {
        ...state.cardSaving,
        tokenId,
      },
    })),
  resetCardSaving: () => set({ cardSaving: initialCardSavingState }),

  // Recharge actions
  startRecharge: (amount) =>
    set({
      recharge: {
        status: "loading",
        errorMessage: null,
        amount,
        newBalance: null,
        checkoutUrl: null,
        transactionId: null,
      },
      flowState: "processing",
    }),
  setCheckoutReady: (checkoutUrl, transactionId) =>
    set((state) => ({
      recharge: {
        ...state.recharge,
        status: "checkout",
        checkoutUrl,
        transactionId,
      },
      flowState: "checkout",
    })),
  setRechargeSuccess: (newBalance) =>
    set((state) => ({
      recharge: {
        status: "success",
        errorMessage: null,
        amount: state.recharge.amount,
        newBalance,
        checkoutUrl: null,
        transactionId: null,
      },
      flowState: "recharge-success",
    })),
  setRechargeError: (message) =>
    set((state) => ({
      recharge: {
        status: "error",
        errorMessage: message,
        amount: state.recharge.amount,
        newBalance: null,
        checkoutUrl: null,
        transactionId: null,
      },
      flowState: "error",
      error: message,
    })),
  resetRecharge: () => set({ recharge: initialRechargeState, flowState: "dashboard" }),

  // Navigation helpers
  navigateToAddCard: () =>
    set({
      flowState: "recharge",
      error: null,
      recharge: initialRechargeState,
    }),
  navigateToManualEntry: () =>
    set({
      flowState: "add-card-manual",
      selectedCardEntryMethod: "manual",
    }),
  navigateToScanCard: () =>
    set({
      flowState: "add-card-scanning",
      selectedCardEntryMethod: "scan",
    }),
  navigateToDashboard: () =>
    set({
      flowState: "dashboard",
      error: null,
      cardSaving: initialCardSavingState,
      recharge: initialRechargeState,
    }),
  navigateToRecharge: () =>
    set({
      flowState: "recharge",
      error: null,
      recharge: initialRechargeState,
    }),
  navigateToViewAllCards: () => set({ flowState: "view-all-cards" }),
  navigateToSuccess: () => set({ flowState: "success" }),
  navigateToRechargeSuccess: () => set({ flowState: "recharge-success" }),
  navigateToError: (message) =>
    set({
      flowState: "error",
      error: message,
    }),
  resetFlow: () =>
    set({
      flowState: "dashboard",
      selectedCardId: null,
      error: null,
      cardSaving: initialCardSavingState,
      recharge: initialRechargeState,
    }),
}));
