/**
 * Admin Settings Page
 *
 * System settings and configuration interface.
 */

import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Coins, Globe, Lock, Shield, Wallet } from "lucide-react";

export const Route = createFileRoute("/admin/settings/")({
  component: AdminSettingsPage,
});

interface SettingCard {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  status: 'active' | 'coming-soon';
}

const settingCards: SettingCard[] = [
  {
    title: "Fees & Pricing",
    description: "Set admin fees and pricing configuration",
    icon: Coins,
    href: "/admin/settings/fees",
    status: 'active',
  },
  {
    title: "Security",
    description: "Manage authentication, passwords, and access controls",
    icon: Shield,
    href: "/admin/settings/security",
    status: 'coming-soon',
  },
  {
    title: "Notifications",
    description: "Configure email, push, and in-app notification settings",
    icon: Bell,
    href: "/admin/settings/notifications",
    status: 'coming-soon',
  },
  {
    title: "Wallet & Payments",
    description: "Payment gateway configuration and wallet settings",
    icon: Wallet,
    href: "/admin/settings/payments",
    status: 'coming-soon',
  },
  {
    title: "Localization",
    description: "Language, currency, and regional preferences",
    icon: Globe,
    href: "/admin/settings/localization",
    status: 'coming-soon',
  },
  {
    title: "Access Control",
    description: "User roles, permissions, and admin management",
    icon: Lock,
    href: "/admin/settings/access",
    status: 'coming-soon',
  },
];

function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">Settings</h2>
        <p className="text-neutral-500 mt-1">
          Manage system configuration and preferences.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingCards.map((card) => (
          <SettingCardComponent key={card.title} {...card} />
        ))}
      </div>

      {/* System Info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          System Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem label="Version" value="1.0.0" />
          <InfoItem label="Environment" value="Production" />
          <InfoItem
            label="API Status"
            value="Healthy"
            valueColor="text-green-600"
          />
          <InfoItem label="Last Deploy" value="Dec 15, 2024" />
        </div>
      </div>
    </div>
  );
}

function SettingCardComponent({ title, description, icon: Icon, href, status }: SettingCard) {
  const CardContent = (
    <div className={`flex items-start gap-4 ${
      status === 'coming-soon' ? "opacity-75" : ""
    }`}>
      <div className="p-3 bg-neutral-100 rounded-xl">
        <Icon className="h-6 w-6 text-neutral-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-neutral-900">{title}</h3>
          {status === 'coming-soon' && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
    </div>
  );

  if (status === 'active') {
    return (
      <Link 
        to={href}
        className="block bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        {CardContent}
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 cursor-not-allowed">
      {CardContent}
    </div>
  );
}

function InfoItem({
  label,
  value,
  valueColor = "text-neutral-900",
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className={`font-medium ${valueColor}`}>{value}</p>
    </div>
  );
}
