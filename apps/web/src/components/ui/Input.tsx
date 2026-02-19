/**
 * Input Component
 *
 * Form input field with label and error state support.
 */

import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Optional left icon */
  leftIcon?: LucideIcon;
  /** Optional right icon */
  rightIcon?: LucideIcon;
  /** Full width input */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-5 w-5 text-neutral-400" />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            className={`
              block w-full rounded-xl border bg-white
              px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-0
              disabled:bg-neutral-50 disabled:cursor-not-allowed
              ${LeftIcon ? "pl-10" : ""}
              ${RightIcon ? "pr-10" : ""}
              ${
                error
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                  : "border-neutral-200 focus:border-primary-500 focus:ring-primary-200"
              }
              ${className}
            `}
            {...props}
          />

          {/* Right Icon */}
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <RightIcon className="h-5 w-5 text-neutral-400" />
            </div>
          )}
        </div>

        {/* Error or Helper Text */}
        {(error || helperText) && (
          <p
            className={`mt-1.5 text-sm ${
              error ? "text-red-600" : "text-neutral-500"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
