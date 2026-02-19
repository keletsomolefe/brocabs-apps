import { getAppStats } from "@/lib/actions";
import { OverviewCards } from "@/features/dashboard";
import { LanguageGrid } from "@/features/dashboard";
import { OverallProgress } from "@/features/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [riderStats, driverStats] = await Promise.all([
    getAppStats("rider"),
    getAppStats("driver"),
  ]);

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-6 py-4 md:py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <OverviewCards riderStats={riderStats} driverStats={driverStats} />
          <div className="px-4 lg:px-6">
            <OverallProgress
              riderStats={riderStats}
              driverStats={driverStats}
            />
          </div>
        </div>
        <div className="px-4 lg:px-6">
          <LanguageGrid riderStats={riderStats} driverStats={driverStats} />
        </div>
      </div>
    </div>
  );
}
