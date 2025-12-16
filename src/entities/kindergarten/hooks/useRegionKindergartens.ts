import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import { getRegionKindergartens } from "@/entities/kindergarten/api";

interface UseRegionKindergartensParams {
  regionId: number | null;
  subRegionIds?: number[];
}

export const useRegionKindergartens = ({
  regionId,
  subRegionIds = [],
}: UseRegionKindergartensParams) => {
  const regionQueries = useQueries({
    queries: useMemo(() => {
      if (!regionId) return [];

      if (subRegionIds.length === 0) {
        return [
          {
            queryKey: ["kindergartens", "region", regionId, null],
            queryFn: () => getRegionKindergartens({ regionId }),
            enabled: !!regionId,
          },
        ];
      }

      return subRegionIds.map((subRegionId) => ({
        queryKey: ["kindergartens", "region", regionId, subRegionId],
        queryFn: () => getRegionKindergartens({ regionId, subRegionId }),
        enabled: !!regionId,
      }));
    }, [regionId, subRegionIds]),
  });

  const kindergartens = useMemo(() => {
    if (regionQueries.length === 0) return [];

    const allKindergartens = regionQueries
      .map((query) => query.data ?? [])
      .flat();

    return Array.from(new Map(allKindergartens.map((k) => [k.id, k])).values());
  }, [regionQueries]);

  const isLoading = regionQueries.some((query) => query.isLoading);
  const error = regionQueries.some((query) => query.error)
    ? "검색 중 오류가 발생했습니다."
    : null;

  return {
    kindergartens,
    isLoading,
    error,
  };
};
