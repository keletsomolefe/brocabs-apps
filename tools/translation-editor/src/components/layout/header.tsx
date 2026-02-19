"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getLanguageName } from "@/lib/constants";
import type { LangCode } from "@/lib/types";
import { ThemeSwitch } from "./theme-switch";
import { useSearch } from "@/features/search/context/search-context";

export function Header() {
  const pathname = usePathname();
  const { setOpen } = useSearch();
  const segments = pathname.split("/").filter(Boolean);
  const app = segments[0];
  const lang = segments[1] as LangCode | undefined;
  const isSettings = segments[0] === "settings";
  const isApp = app === "rider" || app === "driver";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {isApp || isSettings ? (
                <BreadcrumbLink href="/">Translation Editor</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>Translation Editor</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {isApp && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {lang ? (
                    <BreadcrumbLink href={`/${app}`}>
                      {app.charAt(0).toUpperCase() + app.slice(1)} App
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>
                      {app.charAt(0).toUpperCase() + app.slice(1)} App
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
            {isApp && lang && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getLanguageName(lang)}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {isSettings && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground sm:flex"
            onClick={() => setOpen(true)}
          >
            <Search className="size-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">&#8984;</span>K
            </kbd>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8 sm:hidden"
            onClick={() => setOpen(true)}
          >
            <Search className="size-3.5" />
          </Button>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  );
}
