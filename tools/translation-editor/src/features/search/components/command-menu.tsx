"use client";

import { useRouter } from "next/navigation";
import {
  Home,
  Settings,
  Smartphone,
  Car,
  Globe,
} from "lucide-react";
import { Command } from "cmdk";
import { useSearch } from "../context/search-context";
import { NON_ENGLISH_LANGUAGES, APPS } from "@/lib/constants";

export function CommandMenu() {
  const { open, setOpen } = useSearch();
  const router = useRouter();

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border bg-popover text-popover-foreground shadow-2xl">
        <Command.Input
          placeholder="Type to search..."
          className="w-full border-b bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          <Command.Group
            heading="Navigation"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <Command.Item
              onSelect={() => navigate("/")}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Home className="size-4" />
              Dashboard
            </Command.Item>
            <Command.Item
              onSelect={() => navigate("/settings/appearance")}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <Settings className="size-4" />
              Settings
            </Command.Item>
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          <Command.Group
            heading="Apps"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {APPS.map((app) => {
              const Icon = app.value === "rider" ? Smartphone : Car;
              return (
                <Command.Item
                  key={app.value}
                  onSelect={() => navigate(`/${app.value}`)}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Icon className="size-4" />
                  {app.label} App
                </Command.Item>
              );
            })}
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          <Command.Group
            heading="Languages (Rider)"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {NON_ENGLISH_LANGUAGES.map((lang) => (
              <Command.Item
                key={`rider-${lang.code}`}
                onSelect={() => navigate(`/rider/${lang.code}`)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Globe className="size-4" />
                Rider &middot; {lang.name}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          <Command.Group
            heading="Languages (Driver)"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {NON_ENGLISH_LANGUAGES.map((lang) => (
              <Command.Item
                key={`driver-${lang.code}`}
                onSelect={() => navigate(`/driver/${lang.code}`)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <Globe className="size-4" />
                Driver &middot; {lang.name}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
