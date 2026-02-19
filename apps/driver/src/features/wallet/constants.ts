/**
 * Wallet Feature Constants
 *
 * Query keys for wallet-related queries
 */
export const WALLET_QUERY_KEYS = {
  balance: ["wallet", "balance"] as const,
  transactions: ["wallet", "transactions"] as const,
  cards: (tokenId: string) => ["wallet", "cards", tokenId] as const,
};
