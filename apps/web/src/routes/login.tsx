/**
 * Admin Login Page
 *
 * FusionAuth login page for admin dashboard access.
 * Uses email/password authentication with the admin application.
 */

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Input } from "../components/ui";
import { useAuthStore } from "../lib/auth";
import { Colors } from "../lib/theme";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setLocalError("Please enter email and password");
      return;
    }

    clearError();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate({ to: "/admin" });
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: Colors.primary[500] }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ backgroundColor: Colors.primary[500] }}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: Colors.primary[500] }}
          >
            <span className="text-2xl font-bold text-white">BC</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Portal</h1>
          <p className="text-neutral-500 mt-1">
            Sign in to access the dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Alert */}
            {displayError && (
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Authentication Failed
                  </p>
                  <p className="text-sm text-red-600 mt-0.5">{displayError}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@brocabs.co.za"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-[11px] text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
              leftIcon={LogIn}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-neutral-100">
            <p className="text-center text-sm text-neutral-500">
              Having trouble signing in?{" "}
              <a
                href="mailto:support@brocabs.co.za"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          This is a secure admin portal. All access is logged and monitored.
        </p>
      </div>
    </div>
  );
}
