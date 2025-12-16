import { Check, RefreshCw, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAddressRegions } from "@/entities/kindergarten/hooks";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/buttons/base-button";
import DotIndicator from "@/shared/ui/carousel/dot-indicator";
import BottomSheet from "@/shared/ui/modal/bottom-sheet";
import { cn } from "@/shared/utils/cn";

interface RegionSelectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegionId: number | null;
  onSelectRegion: (
    regionId: number | null,
    regionName: string | null,
    subRegionIds?: number[]
  ) => void;
}

const ITEMS_PER_PAGE = 10;

export default function RegionSelectSheet({
  isOpen,
  onClose,
  selectedRegionId,
  onSelectRegion,
}: RegionSelectSheetProps) {
  const { regions } = useAddressRegions();
  const [selectedRegionIdState, setSelectedRegionIdState] = useState<
    number | null
  >(selectedRegionId);
  const [selectedSubRegionIds, setSelectedSubRegionIds] = useState<number[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);

  // 선택된 시/도에 해당하는 시/군/구 목록
  const currentSubRegions = useMemo(() => {
    if (!selectedRegionIdState) return [];
    const region = regions.find((r) => r.regionId === selectedRegionIdState);
    return region?.subRegions || [];
  }, [regions, selectedRegionIdState]);

  // 선택된 시/도 정보
  const selectedRegion = useMemo(() => {
    return regions.find((r) => r.regionId === selectedRegionIdState);
  }, [regions, selectedRegionIdState]);

  // 선택된 시/군/구 정보
  const selectedSubRegions = useMemo(() => {
    return currentSubRegions.filter((sub) =>
      selectedSubRegionIds.includes(sub.subRegionId)
    );
  }, [currentSubRegions, selectedSubRegionIds]);

  // 시/군/구 페이지 수 계산
  const totalPages = useMemo(() => {
    return Math.ceil(currentSubRegions.length / ITEMS_PER_PAGE);
  }, [currentSubRegions.length]);

  // 현재 페이지의 시/군/구 목록
  const currentPageSubRegions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return currentSubRegions.slice(startIndex, endIndex);
  }, [currentSubRegions, currentPage]);

  // 시/도 선택 시 시/군/구 선택 초기화
  useEffect(() => {
    setSelectedSubRegionIds([]);
    setCurrentPage(1);
  }, [selectedRegionIdState]);

  // 외부에서 selectedRegionId가 변경되면 내부 상태 동기화
  useEffect(() => {
    setSelectedRegionIdState(selectedRegionId);
    setSelectedSubRegionIds([]);
    setCurrentPage(1);
  }, [selectedRegionId, isOpen]);

  const handleRegionClick = (regionId: number) => {
    setSelectedRegionIdState(regionId);
  };

  const handleRemoveRegion = () => {
    setSelectedRegionIdState(null);
  };

  const handleSubRegionClick = (subRegionId: number) => {
    setSelectedSubRegionIds((prev) => {
      if (prev.includes(subRegionId)) {
        return prev.filter((id) => id !== subRegionId);
      }
      // 최대 4개까지 선택 가능
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, subRegionId];
    });
  };

  const handleRemoveSubRegion = (subRegionId: number) => {
    setSelectedSubRegionIds((prev) => prev.filter((id) => id !== subRegionId));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleConfirm = () => {
    const selectedRegion = regions.find(
      (r) => r.regionId === selectedRegionIdState
    );
    onSelectRegion(
      selectedRegionIdState,
      selectedRegion ? selectedRegion.regionName : null,
      selectedSubRegionIds.length > 0 ? selectedSubRegionIds : undefined
    );
    onClose();
  };

  const handleReset = () => {
    setSelectedRegionIdState(null);
    setSelectedSubRegionIds([]);
    setCurrentPage(1);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="유치원 찾기"
      closeOnOverlayClick
      footer={
        <>
          <Button
            variant="transparent"
            border="gray"
            className="h-10 w-10 p-0"
            onClick={handleReset}
          >
            <RefreshCw aria-hidden="true" className="my-auto" />
          </Button>
          <Button
            variant="primary"
            className="h-10 flex-1"
            onClick={handleConfirm}
            disabled={!selectedRegionIdState}
          >
            적용하기
          </Button>
        </>
      }
      footerClassName="px-5 pb-9 pt-0"
    >
      <div className="flex flex-col">
        <section>
          <h2 className="mb-3 text-sm font-semibold text-primary-dark02">
            시/도 선택
          </h2>
          <ul className="mb-5 flex flex-wrap gap-2">
            {regions.map((region) => {
              const isSelected = selectedRegionIdState === region.regionId;
              return (
                <li key={region.regionId}>
                  <Button
                    type="button"
                    variant="transparent"
                    border="gray"
                    font="md"
                    onClick={() => handleRegionClick(region.regionId)}
                    aria-pressed={isSelected}
                    className={cn(
                      "py-1.5 text-primary-dark02",
                      isSelected && "border-tertiary-4 text-tertiary-4"
                    )}
                  >
                    {region.regionName[0]}
                    {region.regionName[1]}
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 시/군/구 선택 */}
        {currentSubRegions.length > 0 && (
          <>
            <hr className="border-primary-normal01" />
            <section className="my-5">
              <h2 className="mb-3 text-sm font-semibold text-primary-dark02">
                시/군/구 선택
              </h2>
              <ul className="grid grid-cols-2 gap-2">
                {currentPageSubRegions.map((subRegion) => {
                  const isSelected = selectedSubRegionIds.includes(
                    subRegion.subRegionId
                  );
                  return (
                    <li key={subRegion.subRegionId}>
                      <button
                        type="button"
                        onClick={() =>
                          handleSubRegionClick(subRegion.subRegionId)
                        }
                        className={cn(
                          "flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                          isSelected
                            ? "border-tertiary-4 text-tertiary-4"
                            : "border-primary-normal01 text-primary-dark02 hover:border-primary hover:text-primary"
                        )}
                        aria-pressed={isSelected}
                      >
                        <span>{subRegion.name}</span>
                        {isSelected && (
                          <Check
                            className="h-4 w-4 flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {totalPages > 1 && (
                <div className="mt-3 flex justify-center">
                  <DotIndicator
                    total={totalPages}
                    current={currentPage}
                    onPageClick={handlePageClick}
                    dotClassName="bg-primary-normal03"
                    activeDotClassName="bg-tertiary-2"
                  />
                </div>
              )}
            </section>
          </>
        )}

        {/* 선택된 시/도 및 시/군/구 표시 */}
        {(selectedRegion || selectedSubRegions.length > 0) && (
          <>
            <hr className="border-primary-normal01" />
            <h2 className="sr-only">선택된 시/도 및 시/군/구</h2>
            <section className="my-3">
              <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {selectedRegion && (
                  <Badge
                    variant="tertiary"
                    size="lg"
                    className="flex flex-shrink-0 items-center gap-1"
                  >
                    {selectedRegion.regionName}
                    <Button
                      type="button"
                      variant="transparent"
                      size="xs"
                      onClick={handleRemoveRegion}
                      className="h-auto p-0.5 hover:opacity-70"
                      aria-label={`${selectedRegion.regionName} 선택 해제`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {selectedSubRegions.map((subRegion) => (
                  <Badge
                    key={subRegion.subRegionId}
                    variant="tertiary"
                    size="lg"
                    className="flex flex-shrink-0 items-center gap-1"
                  >
                    {subRegion.name}
                    <Button
                      type="button"
                      variant="transparent"
                      size="xs"
                      onClick={() =>
                        handleRemoveSubRegion(subRegion.subRegionId)
                      }
                      className="h-auto p-0.5 hover:opacity-70"
                      aria-label={`${subRegion.name} 선택 해제`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
