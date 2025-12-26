import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getUserInfo } from "@/entities/user/api";
import { useToast } from "@/shared/hooks/useToast";
import { useRewardAd } from "@/shared/hooks/useFlutterCommunication";

import { deleteWorkReview } from "../api";
import { LikeResponse } from "../DTO.d";

export const useDeleteWorkReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showRewardAd] = useRewardAd();

  return useMutation<
    LikeResponse,
    Error,
    {
      workReviewId: number;
      kindergartenId?: number;
      skipAd?: boolean; // 광고 스킵 옵션 (테스트용)
    }
  >({
    mutationFn: async ({ workReviewId, skipAd = false }) => {
      // 광고를 스킵하지 않는 경우 보상형 광고 표시
      if (!skipAd) {
        const adResult = await showRewardAd();

        // 사용자가 광고를 중간에 닫은 경우에만 삭제 중단
        if (adResult.status === "cancelled") {
          throw new Error("광고를 끝까지 시청해야 리뷰를 삭제할 수 있습니다.");
        }

        // status가 success이지만 rewarded가 false인 경우 (광고 없음, 로드 실패 등)
        // -> 사용자 책임이 아니므로 그냥 진행
        // rewarded가 true인 경우 -> 광고 시청 완료, 진행
      }

      // 광고 시청 완료 또는 광고 없음 -> 리뷰 삭제
      return deleteWorkReview(workReviewId);
    },
    onSuccess: async (_, variables) => {
      // 해당 유치원의 근무 리뷰 목록을 다시 불러오기
      if (variables.kindergartenId) {
        queryClient.invalidateQueries({
          queryKey: ["workReviews", variables.kindergartenId.toString()],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["myPosts"],
      });

      await getUserInfo();

      toast({
        title: "근무 리뷰 삭제 완료",
        description: "리뷰가 삭제되었습니다.",
        variant: "default",
      });
    },
    onError: (error) => {
      let errorMessage = "잠시 후 다시 시도해주세요.";

      if (error instanceof Error && error.message) {
        if (error.message !== "Failed to fetch") {
          errorMessage = error.message;
        }
      }

      toast({
        title: "근무 리뷰 삭제 실패",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
};
