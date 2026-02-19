import { notFound } from "next/navigation";
import { getAppStats } from "@/lib/actions";
import { SingleLanguageGrid } from "@/features/dashboard";
import { APPS } from "@/lib/constants";
import type { AppName } from "@/lib/types";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ app: string }>;
}

export default async function AppOverviewPage({ params }: Props) {
  const { app } = await params;

  if (!APPS.some((a) => a.value === app)) {
    notFound();
  }

  const stats = await getAppStats(app as AppName);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold capitalize">{app} App</h1>
          <p className="text-sm text-muted-foreground">
            Translation progress across all languages
          </p>
        </div>
        <SingleLanguageGrid stats={stats} />
      </div>
    </div>
  );
}
