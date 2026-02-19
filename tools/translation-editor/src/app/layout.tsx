import type { Metadata } from "next";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/context/theme-provider";
import { SearchProvider, CommandMenu } from "@/features/search";
import { TranslationProvider } from "@/features/editor/context/translation-context";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { SkipToMain } from "@/components/layout/skip-to-main";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "BroCabs Translation Editor",
  description: "Edit translations for BroCabs rider and driver apps",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <TranslationProvider>
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 64)",
                    "--header-height": "calc(var(--spacing) * 12)",
                  } as React.CSSProperties
                }
              >
                <SkipToMain />
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <Header />
                  <Main>{children}</Main>
                </SidebarInset>
              </SidebarProvider>
            </TranslationProvider>
            <CommandMenu />
          </SearchProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
