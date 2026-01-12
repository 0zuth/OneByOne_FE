import { useSuspenseQuery } from "@tanstack/react-query";

import { getPopularPostsByPeriod } from "@/entities/community/api";
import { DYNAMIC_CACHE_CONFIG } from "@/shared/config/query";

import { PopularPostsByPeriodResponse } from "../DTO.d";

export const usePopularPostsByPeriod = () => {
  return useSuspenseQuery<PopularPostsByPeriodResponse>({
    queryKey: ["popularPostsByPeriod"],
    queryFn: getPopularPostsByPeriod,
    ...DYNAMIC_CACHE_CONFIG,
  });
};
