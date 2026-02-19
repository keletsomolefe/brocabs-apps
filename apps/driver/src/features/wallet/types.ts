/**
 * Wallet Feature Types
 *
 * Type definitions for the wallet flow including cards, transactions, and state management.
 */

/**
 * Transaction type enum
 */
export enum TransactionType {
  RIDE = "RIDE",
  RECHARGE = "RECHARGE",
  REFUND = "REFUND",
  WITHDRAWAL = "WITHDRAWAL",
}

/**
 * Transaction status enum
 */
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

/**
 * Transaction record
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  date: Date;
  description: string;
  // For ride transactions
  from?: string;
  to?: string;
}

/**
 * Mask card number for display
 */
export const maskCardNumber = (maskedNumber: string): string => {
  return maskedNumber.replace(/\s/g, "");
};
