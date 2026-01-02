import { useAtom } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { userAtom } from "@/entities/auth/model";
import { useReviewLike } from "@/entities/review/hooks";
import { useOptimisticUpdate } from "@/shared/hooks/useOptimisticUpdate";
import Button from "@/shared/ui/buttons/base-button";
import ReviewReportDropDown from "@/shared/ui/drop-down/review-report-drop-down";
import { ShareType } from "@/shared/utils/webViewCommunication";
import {
  getTotalRating,
  ReviewData,
} from "@/widgets/review-list/lib/getTotalRating";
import { getWorkYear } from "@/widgets/review-list/lib/getWorkYear";
import ReviewActions from "@/widgets/review-list/ui/ReviewActions";
import ReviewContent from "@/widgets/review-list/ui/ReviewContent";
import ReviewResource from "@/widgets/review-list/ui/ReviewResource";
import ReviewSummary from "@/widgets/review-list/ui/ReviewSummary";
import { ReviewFieldConfig } from "@/widgets/review-panel/lib/config";

export interface ReviewCardListProps {
  review: ReviewData | ReviewData[];
  fieldConfigs: ReviewFieldConfig[];
  type: string;
  showResource?: boolean; // 유치원 정보 링크 표시 여부
  limitItems?: number; // ReviewContent의 아이템 수 제한 (기본값: undefined = 전체 표시)
}

export function ReviewCardList({
  review,
  fieldConfigs,
  type,
  showResource = false,
  limitItems,
}: ReviewCardListProps) {
  const reviews = Array.isArray(review) ? review : [review];

  return (
    <div className="flex flex-col gap-8">
      {reviews.map((item, index) => {
        const key =
          "workReviewId" in item ? item.workReviewId : item.internshipReviewId;
        return (
          <ReviewCard
            key={key}
            review={item}
            fieldConfigs={fieldConfigs}
            type={type}
            showResource={showResource}
            limitItems={limitItems}
            isLastItem={index === reviews.length - 1}
          />
        );
      })}
    </div>
  );
}

// ------------------------------------------------------------------------------

interface ReviewCardProps {
  review: ReviewData;
  fieldConfigs: ReviewFieldConfig[];
  type: string;
  showResource?: boolean;
  limitItems?: number;
  isLastItem?: boolean;
}

export function ReviewCard({
  review,
  fieldConfigs,
  type,
  showResource = false,
  limitItems,
  isLastItem = false,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate();

  // 리뷰 기본 정보
  const reviewId =
    "workReviewId" in review ? review.workReviewId : review.internshipReviewId;
  const isContentBlocked = !user?.hasWrittenReview;

  // 좋아요 기능
  const { handleLike, isPending, isLiked } = useReviewLike(type, reviewId);
  const [likeCount, setLikeCount, rollbackLikeCount] = useOptimisticUpdate(
    review.likeCount || 0
  );
  const [localIsLiked, setLocalIsLiked, rollbackIsLiked] = useOptimisticUpdate(
    false,
    isLiked
  );

  const isWriteButtonDisabled =
    !review.kindergartenId ||
    !user?.role ||
    (user.role === "PROSPECTIVE_TEACHER" && type === "work");

  // ReviewContent 공통 props
  const reviewContentProps = {
    review,
    type,
    fieldConfigs,
    isExpanded,
    onToggleExpand: () => setIsExpanded(!isExpanded),
    limitItems,
  };

  const handleOptimisticLike = async () => {
    setLocalIsLiked((prev: boolean) => !prev);
    setLikeCount((prev: number) => prev + (localIsLiked ? -1 : 1));

    try {
      await handleLike();
    } catch {
      rollbackIsLiked();
      rollbackLikeCount();
    }
  };

  const handleWriteReview = () => {
    if (!review.kindergartenId || !user?.role) return;
    const reviewType = user.role === "PROSPECTIVE_TEACHER" ? "learning" : type;
    navigate(
      `/kindergarten/${review.kindergartenId}/review/new?type=${reviewType}`
    );
  };

  return (
    <div
      className={!isLastItem ? "border-b border-b-primary-light02 pb-7" : ""}
    >
      <div className="flex flex-col gap-7 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <ReviewSummary
              rating={getTotalRating(review, type)}
              title={review.oneLineComment}
              workType={review.workType}
              createdAt={review.createdAt || ""}
              workYear={getWorkYear(review, type)}
              isExpanded={isExpanded}
            />
          </div>
          <div className="flex-shrink-0">
            <ReviewReportDropDown
              targetId={reviewId}
              targetType={type === "work" ? "WORK_REVIEW" : "INTERNSHIP_REVIEW"}
            />
          </div>
        </div>

        {showResource && (
          <ReviewResource
            kindergartenId={review.kindergartenId.toString()}
            kindergartenName={review.kindergartenName}
            className="-mt-4"
          />
        )}

        {isContentBlocked ? (
          <div className="relative">
            <div className="pointer-events-none opacity-70 blur-sm">
              <ReviewContent {...reviewContentProps} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <p className="text-center text-sm font-medium text-primary">
                리뷰를 작성하고 <br /> 전체 리뷰를 확인해보세요!
              </p>
              <Button
                variant="primary"
                size="md"
                font="sm_sb"
                onClick={handleWriteReview}
                disabled={isWriteButtonDisabled}
                className="px-4 text-primary-normal02"
              >
                리뷰쓰기
              </Button>
            </div>
          </div>
        ) : (
          <ReviewContent {...reviewContentProps} />
        )}

        <div className="flex justify-end">
          <ReviewActions
            likeCount={likeCount}
            onLike={handleOptimisticLike}
            isPending={isPending}
            isLiked={localIsLiked}
            shareData={{
              title: `${review.kindergartenName} ${type === "work" ? "근무" : "실습"} 리뷰`,
              id: review.kindergartenId.toString(),
              isWork: type === "work",
              shareType: ShareType.REVIEW,
            }}
          />
        </div>
      </div>
    </div>
  );
}
