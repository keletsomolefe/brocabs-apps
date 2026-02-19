/**
 * Wallet Feature Types
 *
 * Type definitions for the wallet flow including cards, transactions, and state management.
 */

/**
 * Wallet flow states based on Figma designs
 */
export type WalletFlowState =
  | "empty" // No cards/balance
  | "dashboard" // Main wallet view with cards and balance
  | "add-card-selection" // Scan vs Manual entry selection
  | "add-card-manual" // Manual card entry form
  | "add-card-scanning" // Card scanning in progress
  | "processing" // Operation in progress
  | "checkout" // WebView checkout in progress
  | "card-authorization" // WebView card authorization in progress
  | "success" // Operation successful
  | "error" // Operation failed
  | "recharge" // Recharge wallet form
  | "recharge-success" // Recharge successful
  | "view-all-cards"; // List of all saved cards

/**
 * Card type enum
 */
export enum CardType {
  VISA = "VISA",
  MASTERCARD = "Mastercard",
  AMEX = "American Express",
  OTHER = "Other",
}

/**
 * Saved card information
 */
export interface SavedCard {
  id: string;
  maskedNumber: string; // e.g., "**** **** **** 2345"
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: CardType;
  isDefault?: boolean;
}

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
 * Wallet balance information
 */
export interface WalletBalance {
  id: string;
  balance: number;
  userId: string;
  updatedAt: Date;
}

/**
 * Card input form data
 */
export interface CardFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
  saveCard: boolean;
}

/**
 * Recharge form data
 */
export interface RechargeFormData {
  amount: number;
  cardId: string;
}

/**
 * Card entry method
 */
export type CardEntryMethod = "scan" | "manual";

/**
 * Predefined recharge amounts
 */
export const RECHARGE_AMOUNTS = [50, 100, 200, 500, 1000] as const;
export type RechargeAmount = (typeof RECHARGE_AMOUNTS)[number];

/**
 * Minimum recharge amount (must match backend validation)
 */
export const MIN_RECHARGE_AMOUNT = 50;

/**
 * Format currency for display (South African Rand)
 */
export const formatCurrency = (amount: number): string => {
  return `R ${amount.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Mask card number for display
 */
export const maskCardNumber = (maskedNumber: string): string => {
  return maskedNumber.replace(/\s/g, "");
};

/**
 * Format expiry date
 */
export const formatExpiry = (month: number, year: number): string => {
  return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
};

/**
 * Detect card type from card number
 */
export const detectCardType = (cardNumber: string): CardType => {
  const cleaned = cardNumber.replace(/\s/g, "");
  if (/^4/.test(cleaned)) return CardType.VISA;
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return CardType.MASTERCARD;
  if (/^3[47]/.test(cleaned)) return CardType.AMEX;
  return CardType.OTHER;
};
