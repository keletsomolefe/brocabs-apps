import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  TRADESAFE_TOKEN_ID: "@brocabs/wallet/tradesafe_token_id",
} as const;

/**
 * Wallet storage utilities
 * Persists wallet-related data across app restarts
 */
export const walletStorage = {
  /**
   * Save the TradeSafe token ID
   */
  saveTokenId: async (tokenId: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRADESAFE_TOKEN_ID, tokenId);
    } catch (error) {
      console.error("Failed to save TradeSafe token ID:", error);
    }
  },

  /**
   * Get the saved TradeSafe token ID
   */
  getTokenId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TRADESAFE_TOKEN_ID);
    } catch (error) {
      console.error("Failed to get TradeSafe token ID:", error);
      return null;
    }
  },

  /**
   * Clear the saved TradeSafe token ID
   */
  clearTokenId: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TRADESAFE_TOKEN_ID);
    } catch (error) {
      console.error("Failed to clear TradeSafe token ID:", error);
    }
  },
};
