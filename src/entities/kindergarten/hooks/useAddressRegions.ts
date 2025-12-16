import { useQuery } from "@tanstack/react-query";

import { getAddressRegions } from "@/entities/kindergarten/api";
import type { Region } from "@/entities/kindergarten/DTO.d";

export const useAddressRegions = () => {
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["address", "regions"],
    queryFn: getAddressRegions,
  });

  return {
    regions: (data || []) as Region[],
    isLoading,
    error: isError ? error?.message || "지역 목록을 불러올 수 없습니다." : null,
  };
};
