"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { NON_ENGLISH_LANGUAGES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";

interface Props {
  app: string;
}

export function NavLanguages({ app }: Props) {
  const pathname = usePathname();

  return (
    <NavGroup label="Languages">
      {NON_ENGLISH_LANGUAGES.map((l) => {
        const href = `/${app}/${l.code}`;
        const isActive = pathname === href;

        return (
          <SidebarMenuItem key={l.code}>
            <SidebarMenuButton asChild isActive={isActive} tooltip={l.name}>
              <Link href={href}>
                <Globe className="size-4" />
                <span>{l.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </NavGroup>
  );
}
