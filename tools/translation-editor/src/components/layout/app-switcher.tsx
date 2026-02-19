"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, Car, Smartphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { APPS } from "@/lib/constants";

const APP_ICONS: Record<string, React.ElementType> = {
  rider: Smartphone,
  driver: Car,
};

export function AppSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const segments = pathname.split("/").filter(Boolean);
  const currentApp =
    segments[0] === "rider" || segments[0] === "driver"
      ? segments[0]
      : null;

  const currentLabel = currentApp
    ? APPS.find((a) => a.value === currentApp)?.label ?? currentApp
    : "Select App";
  const CurrentIcon = currentApp ? APP_ICONS[currentApp] : Smartphone;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CurrentIcon className="size-3.5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{currentLabel}</span>
                <span className="text-xs text-muted-foreground">App</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {APPS.map((app) => {
              const Icon = APP_ICONS[app.value] ?? Smartphone;
              return (
                <DropdownMenuItem
                  key={app.value}
                  onClick={() => router.push(`/${app.value}`)}
                  className="gap-2"
                >
                  <Icon className="size-4" />
                  <span>{app.label} App</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
