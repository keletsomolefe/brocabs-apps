/**
 * Shared Types Index
 *
 * Re-export common types used across the admin dashboard.
 */

// Re-export API types from the generated client
export type {
  LoginDto,
  LoginResponseDto,
  PaymentListResponseDto,
  PaymentResponseDto,
  ProfileResponseDto,
  RideTypeListResponseDto,
  RideTypeResponseDto,
  SavedCardDto,
  WalletBalanceDto,
} from "@brocabs/client";

/**
 * Dashboard Statistics
 * Used for the overview page stat cards
 */
export interface DashboardStats {
  totalUsers: number;
  activeRides: number;
  totalDrivers: number;
  totalRevenue: number;
  pendingApprovals: number;
  completedRides: number;
}

/**
 * Navigation Item
 * Used for sidebar navigation
 */
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

/**
 * Table Column Definition
 * Generic column config for DataTable component
 */
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

/**
 * Pagination State
 */
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

/**
 * API Response Wrapper
 * Standard response format from the API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * User Session
 * Admin user session data
 */
export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: "admin" | "super_admin";
  permissions: string[];
}
