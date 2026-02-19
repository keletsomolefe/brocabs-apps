import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Car,
  CreditCard,
  LayoutDashboard,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: LandingPage });

function LandingPage() {
  const features = [
    {
      icon: <Users className="w-10 h-10 text-primary-400" />,
      title: "User Management",
      description:
        "Complete oversight of all riders and drivers on the platform with detailed profiles and activity logs.",
    },
    {
      icon: <Car className="w-10 h-10 text-primary-400" />,
      title: "Driver Approvals",
      description:
        "Streamlined driver application workflow with document verification and approval process.",
    },
    {
      icon: <CreditCard className="w-10 h-10 text-primary-400" />,
      title: "Payment Tracking",
      description:
        "Monitor all transactions, wallet recharges, and payment processing in real-time.",
    },
    {
      icon: <Wallet className="w-10 h-10 text-primary-400" />,
      title: "Wallet System",
      description:
        "Manage wallet balances, refunds, and financial operations across the platform.",
    },
    {
      icon: <Shield className="w-10 h-10 text-primary-400" />,
      title: "Secure Access",
      description:
        "Role-based admin access with FusionAuth integration for enterprise-grade security.",
    },
    {
      icon: <LayoutDashboard className="w-10 h-10 text-primary-400" />,
      title: "Analytics Dashboard",
      description:
        "Comprehensive statistics and insights to monitor platform health and growth.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-950 via-primary-900 to-primary-950">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-primary-400/10 to-primary-500/10" />
        <div className="relative max-w-5xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <span className="text-white font-bold text-2xl">BC</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Brocabs
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl text-primary-100 mb-4 font-light">
            Admin Dashboard
          </h2>
          <p className="text-lg text-primary-200/80 max-w-2xl mx-auto mb-10">
            Powerful administration tools to manage your ride-hailing platform.
            Monitor users, approve drivers, track payments, and gain insights
            into your business.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Link
              to="/admin"
              className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 flex items-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Enter Dashboard
            </Link>
            <p className="text-primary-300/60 text-sm mt-2">
              Secure admin access required
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold text-white text-center mb-12">
          Everything you need to manage Brocabs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-primary-900/50 backdrop-blur-sm border border-primary-800 rounded-2xl p-6 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="mb-4 p-3 bg-primary-800/50 rounded-xl w-fit">
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h4>
              <p className="text-primary-200/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-primary-800/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-300/60 text-sm">
            © {new Date().getFullYear()} Brocabs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-primary-300/60 hover:text-primary-300 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-primary-300/60 hover:text-primary-300 text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
