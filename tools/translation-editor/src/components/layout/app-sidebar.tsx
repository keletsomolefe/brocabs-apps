"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings } from "lucide-react";

import { AppTitle } from "./app-title";
import { AppSwitcher } from "./app-switcher";
import { NavLanguages } from "./nav-languages";
import { NavSections } from "./nav-sections";
import { NavGroup } from "./nav-group";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenu,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentApp =
    segments[0] === "rider" || segments[0] === "driver"
      ? segments[0]
      : null;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <AppTitle />
        <AppSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavGroup label="Navigation" collapsible={false}>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/"}
              tooltip="Dashboard"
            >
              <Link href="/">
                <Home className="size-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </NavGroup>

        {currentApp && (
          <>
            <SidebarSeparator />
            <NavLanguages app={currentApp} />
          </>
        )}

        <NavSections />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/settings")}
              tooltip="Settings"
            >
              <Link href="/settings/appearance">
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
