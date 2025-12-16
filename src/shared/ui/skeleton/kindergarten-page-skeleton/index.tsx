import MapSkeleton from "@/features/map/ui/MapSkeleton";
import { TABS } from "@/pages/kindergarten/index";
import KindergartenCardSkeleton from "@/shared/ui/skeleton/kindergarten-card-skeleton";
import { cn } from "@/shared/utils/cn";

interface KindergartenPageSkeletonProps {
  activeTab?: "nearby" | "region";
  showSearchButton?: boolean;
}

export default function KindergartenPageSkeleton({
  activeTab = "nearby",
  showSearchButton = false,
}: KindergartenPageSkeletonProps) {
  const title = activeTab === "nearby" ? "주변 유치원" : "유치원 찾기";

  return (
    <>
      <section className="mx-5 mt-3 flex flex-col gap-3">
        <nav className="flex rounded-md bg-primary-light02 text-center">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={cn(
                "flex w-1/2 items-center justify-center gap-1.5 rounded-md py-2 font-medium",
                "text-primary-normal03 opacity-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Search button skeleton */}
        {activeTab === "region" && showSearchButton && (
          <div className="flex items-center justify-end">
            <div className="h-8 w-14 animate-pulse rounded-md bg-primary-light02" />
          </div>
        )}
      </section>

      <section className="mx-5 mb-2 flex flex-col gap-3">
        <MapSkeleton height="h-80" />
      </section>

      <section className="flex min-h-[300px] flex-col gap-3">
        <div className="flex items-center gap-1 px-5 font-bold">
          <h2 className="text-lg">{title}</h2>
        </div>
        <KindergartenCardSkeleton count={5} />
      </section>
    </>
  );
}
