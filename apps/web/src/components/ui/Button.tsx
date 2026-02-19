/**
 * Button Component
 *
 * Reusable button with multiple variants and sizes.
 */

import { Loader2, LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: React.ReactNode;
  /** Visual variant */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Loading state */
  isLoading?: boolean;
  /** Optional left icon */
  leftIcon?: LucideIcon;
  /** Optional right icon */
  rightIcon?: LucideIcon;
  /** Full width button */
  fullWidth?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variantStyles = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
  ghost: "text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
} as const;

export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : LeftIcon ? (
        <LeftIcon className="h-4 w-4" />
      ) : null}
      {children}
      {!isLoading && RightIcon && <RightIcon className="h-4 w-4" />}
    </button>
  );
}
