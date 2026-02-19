/**
 * Wallet Feature Constants
 *
 * UI text, configuration, and other constants for the wallet feature.
 */

/**
 * Text content for wallet screens
 */
export const WALLET_TEXT = {
  // Empty wallet state
  empty: {
    title: "Add a Card to Your Wallet",
    description: "Securely link a card to pay and top up instantly. You can skip and add later.",
    addCardButton: "Add Card",
    skipButton: "Skip for Now",
    helpText: "Need help? Contact support from Settings → Help",
  },

  // Card selection screen
  cardSelection: {
    title: "How would you like to add your card?",
    scanCard: {
      title: "Scan card",
      description: "Automatic card number & expiry capture",
    },
    manualEntry: {
      title: "Enter manually",
      description: "Type card details yourself",
    },
    nextButton: "Next",
  },

  // Card details form
  cardForm: {
    title: "Card details",
    scanAgain: "Scan Again",
    cardNumber: "Card number",
    expiry: "Expiry (MM/YY)",
    cvv: "CVV",
    cardHolder: "Card Holder",
    saveCard: "Save this card for faster payments",
    linkCardButton: "Link Card",
  },

  // Processing state
  processing: {
    title: "Processing",
    description: "Please wait while we add your card...",
  },

  // Success state
  success: {
    title: "Card Added!",
    description: "Your card has been successfully linked to your wallet.",
    continueButton: "Continue",
  },

  // Dashboard
  dashboard: {
    availableBalance: "Available Balance",
    rechargeButton: "+ Recharge Wallet",
    myCards: "My Cards",
    addNewCard: "Fund Wallet",
    recentTransactions: "Recent Transactions",
    viewAll: "View all",
  },

  // Recharge
  recharge: {
    title: "Recharge Wallet",
    amountLabel: "Enter amount",
    selectCard: "Select payment card",
    rechargeButton: "Recharge",
    minAmount: "Minimum amount: R10",
  },

  // Recharge success
  rechargeSuccess: {
    title: "Wallet Recharged!",
    description: "Your wallet has been successfully topped up.",
    newBalance: "New Balance",
    doneButton: "Done",
  },

  // View all cards
  allCards: {
    title: "My Cards",
    deleteCard: "Delete Card",
    setDefault: "Set as Default",
  },

  // Errors
  errors: {
    generic: "Something went wrong. Please try again.",
    cardNotFound: "Card not found",
    insufficientFunds: "Insufficient funds",
    invalidCard: "Invalid card details",
    networkError: "Network error. Please check your connection.",
  },
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  fade: 200,
  slide: 300,
  cardFlip: 400,
  success: 500,
} as const;

/**
 * Card number input configuration
 */
export const CARD_INPUT_CONFIG = {
  cardNumber: {
    maxLength: 19, // 16 digits + 3 spaces
    placeholder: "4242 4242 4242 4242",
  },
  expiry: {
    maxLength: 5, // MM/YY
    placeholder: "12/27",
  },
  cvv: {
    maxLength: 4, // 3 or 4 digits
    placeholder: "---",
  },
  cardHolder: {
    maxLength: 50,
    placeholder: "JOHN DOE",
  },
} as const;

/**
 * Quick amount selection for recharge
 */
export const QUICK_RECHARGE_AMOUNTS = [
  { value: 50, label: "R 50" },
  { value: 100, label: "R 100" },
  { value: 200, label: "R 200" },
  { value: 500, label: "R 500" },
] as const;

/**
 * Transaction icons mapping
 */
export const TRANSACTION_ICONS = {
  RIDE: "ic:twotone-trip-origin",
  RECHARGE: "mingcute:wallet-fill",
  REFUND: "material-symbols:undo",
  WITHDRAWAL: "material-symbols:arrow-outward",
} as const;

/**
 * Card brand logos mapping
 */
export const CARD_BRAND_LOGOS = {
  VISA: "visa",
  Mastercard: "mastercard",
  "American Express": "amex",
  Other: "generic-card",
} as const;

/**
 * Query keys for wallet-related queries
 */
export const WALLET_QUERY_KEYS = {
  balance: ["wallet", "balance"] as const,
  transactions: ["wallet", "transactions"] as const,
  cards: (tokenId: string) => ["wallet", "cards", tokenId] as const,
};
