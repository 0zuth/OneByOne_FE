import { Check } from "lucide-react";
import { useMemo, useState } from "react";

import type { Region } from "@/entities/kindergarten/DTO.d";
import {
  useAddressRegions,
  useNearbyKindergartens,
  useRegionKindergartens,
} from "@/entities/kindergarten/hooks";
import { SVG_PATHS } from "@/shared/constants/assets-path";
import { URL_PATHS } from "@/shared/constants/url-path";
import BadgeButton from "@/shared/ui/buttons/badge-button";
import Button from "@/shared/ui/buttons/base-button";
import PageLayout from "@/shared/ui/layout/page-layout";
import KindergartenPageSkeleton from "@/shared/ui/skeleton/kindergarten-page-skeleton";
import { cn } from "@/shared/utils/cn";
import KindergartenList from "@/widgets/kindergarten-list";
import { useGeolocation } from "@/widgets/kindergarten-list/lib/useGeolocation";
import NearbySchoolMap from "@/widgets/kindergarten-list/ui/NearbySchoolMap";
import RegionSelectSheet from "@/widgets/kindergarten-list/ui/RegionSelectSheet";

type TabType = "nearby" | "region";

export const TABS = [
  { id: "nearby", label: "주변" },
  { id: "region", label: "지역" },
];

// ------------------------------------------------------------------------------

export default function KindergartenPage() {
  const [activeTab, setActiveTab] = useState<TabType>("nearby");
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(
    null
  );
  const [selectedSubRegionIds, setSelectedSubRegionIds] = useState<number[]>(
    []
  );
  const [isRegionSheetOpen, setIsRegionSheetOpen] = useState(false);

  const { regions } = useAddressRegions();

  const selectedSubRegionNames = useMemo(() => {
    if (!selectedRegionId || selectedSubRegionIds.length === 0) return [];
    const region = regions.find((r: Region) => r.regionId === selectedRegionId);
    if (!region) return [];
    const subRegionMap = new Map(
      region.subRegions.map((sub) => [sub.subRegionId, sub.name])
    );
    return selectedSubRegionIds
      .map((id) => subRegionMap.get(id))
      .filter((name): name is string => name !== undefined);
  }, [regions, selectedRegionId, selectedSubRegionIds]);

  const { position: userLocation, loading: isLoadingLocation } = useGeolocation(
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 3600000,
    }
  );

  const { kindergartens: nearbyKindergartens, isLoading: isLoadingNearby } =
    useNearbyKindergartens({
      latitude: userLocation?.latitude || null,
      longitude: userLocation?.longitude || null,
    });

  const { kindergartens: regionKindergartens, isLoading: isLoadingRegion } =
    useRegionKindergartens({
      regionId: selectedRegionId,
      subRegionIds: selectedSubRegionIds,
    });

  const currentKindergartens =
    activeTab === "nearby" ? nearbyKindergartens : regionKindergartens;

  const isLoading =
    activeTab === "nearby"
      ? isLoadingLocation || isLoadingNearby
      : isLoadingRegion;

  // 지도 초기 위치 좌표 계산
  const mapInitialLocation = useMemo(() => {
    if (activeTab === "nearby" && userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      };
    }

    if (
      activeTab === "region" &&
      selectedRegionId &&
      currentKindergartens.length > 0
    ) {
      return {
        latitude: currentKindergartens[0].latitude,
        longitude: currentKindergartens[0].longitude,
      };
    }

    return null;
  }, [activeTab, userLocation, selectedRegionId, currentKindergartens]);

  const shouldShowRegionMessage =
    activeTab === "region" && !isLoading && !selectedRegionId;

  const handleClearRegion = () => {
    setSelectedRegionId(null);
    setSelectedRegionName(null);
    setSelectedSubRegionIds([]);
  };

  const handleRemoveSubRegion = (subRegionId: number) => {
    setSelectedSubRegionIds((prev) => prev.filter((id) => id !== subRegionId));
  };

  const handleSelectRegion = (
    regionId: number | null,
    regionName: string | null,
    subRegionIds: number[] = []
  ) => {
    setSelectedRegionId(regionId);
    setSelectedRegionName(regionName);
    setSelectedSubRegionIds(subRegionIds);
  };

  return (
    <PageLayout
      title="원바원 | 유치원 찾기"
      description="지도와 검색을 통해 유치원 찾기"
      headerType="kindergarten"
      headerLogo={true}
      currentPath={URL_PATHS.KINDERGARTEN}
      hasBackButton={false}
      mainClassName="h-full bg-primary-foreground flex flex-col gap-3 pb-5 mt-14 mb-24"
    >
      {isLoading ? (
        <KindergartenPageSkeleton
          activeTab={activeTab}
          showSearchButton={activeTab === "region"}
        />
      ) : (
        <>
          <section className="mx-5 mb-2 mt-3 flex flex-col gap-3">
            <nav
              className="flex rounded-md bg-primary-light02 text-center"
              aria-label="탭 메뉴"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      "flex w-1/2 items-center justify-center gap-1.5 rounded-md py-2 font-medium transition-colors",
                      isActive
                        ? "bg-primary-dark02 text-white"
                        : "text-primary-normal03 hover:text-primary-dark01"
                    )}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                    {tab.label}
                  </Button>
                );
              })}
            </nav>

            {activeTab === "region" && (
              <div className="relative flex items-center justify-end gap-2.5">
                <ul className="flex flex-1 gap-2 overflow-x-auto [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {selectedRegionName && (
                    <li className="flex-shrink-0">
                      <BadgeButton
                        size="lg"
                        onClose={handleClearRegion}
                        closeButtonAriaLabel="지역 선택 해제"
                      >
                        {selectedRegionName}
                      </BadgeButton>
                    </li>
                  )}
                  {selectedSubRegionNames.map((name, index) => (
                    <li
                      key={selectedSubRegionIds[index]}
                      className="flex-shrink-0"
                    >
                      <BadgeButton
                        size="lg"
                        onClose={() =>
                          handleRemoveSubRegion(selectedSubRegionIds[index])
                        }
                        closeButtonAriaLabel={`${name} 선택 해제`}
                      >
                        {name}
                      </BadgeButton>
                    </li>
                  ))}
                </ul>
                <Button
                  border="gray"
                  font="sm"
                  onClick={() => setIsRegionSheetOpen(true)}
                  className="flex-shrink-0 bg-white py-1.5 text-primary-dark01"
                >
                  {selectedRegionName ? "변경" : "검색 조건 설정"}
                </Button>
              </div>
            )}

            {mapInitialLocation ? (
              <NearbySchoolMap
                latitude={mapInitialLocation.latitude}
                longitude={mapInitialLocation.longitude}
                kindergartens={currentKindergartens}
              />
            ) : shouldShowRegionMessage ? (
              <div className="flex h-80 w-full flex-col items-center justify-center gap-3 rounded-lg border border-primary-normal01 bg-primary-light01 p-6">
                <img
                  src={SVG_PATHS.CHARACTER.USER}
                  alt="회색 병아리 아이콘"
                  width={46}
                  height={52}
                  className="mx-auto mb-2 h-16 w-14"
                />
                <p className="-mt-2 text-center text-xs font-medium text-primary-dark01">
                  검색 조건 설정에서 <br /> <strong>검색할 지역</strong>을
                  추가해보세요.
                </p>
              </div>
            ) : null}
          </section>

          <KindergartenList
            kindergartens={currentKindergartens}
            tabType={activeTab}
            hasRegion={!!selectedRegionName}
          />
        </>
      )}
      {activeTab === "region" && (
        <RegionSelectSheet
          isOpen={isRegionSheetOpen}
          onClose={() => setIsRegionSheetOpen(false)}
          selectedRegionId={selectedRegionId}
          onSelectRegion={handleSelectRegion}
        />
      )}
    </PageLayout>
  );
}
