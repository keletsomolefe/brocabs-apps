"use client";

import { useTranslationContext } from "@/features/editor/context/translation-context";
import { Badge } from "@/components/ui/badge";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";

export function NavSections() {
  const ctx = useTranslationContext();

  if (!ctx || ctx.sections.length === 0) return null;

  const { sections, sectionMissingCounts, activeSection, setActiveSection } =
    ctx;

  return (
    <NavGroup label="Sections">
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={activeSection === null}
          onClick={() => setActiveSection(null)}
        >
          <span>All sections</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {sections.map((section) => {
        const missing = sectionMissingCounts[section] ?? 0;
        return (
          <SidebarMenuItem key={section}>
            <SidebarMenuButton
              isActive={activeSection === section}
              onClick={() =>
                setActiveSection(activeSection === section ? null : section)
              }
            >
              <span>{section}</span>
            </SidebarMenuButton>
            {missing > 0 && (
              <SidebarMenuBadge>
                <Badge
                  variant="destructive"
                  className="text-[10px] px-1.5 py-0"
                >
                  {missing}
                </Badge>
              </SidebarMenuBadge>
            )}
          </SidebarMenuItem>
        );
      })}
    </NavGroup>
  );
}
