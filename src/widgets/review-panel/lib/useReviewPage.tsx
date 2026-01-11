import { useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";

import { userAtom } from "@/entities/auth/model";
import {
  InternshipReview,
  SortType,
  WorkReview,
} from "@/entities/review/DTO.d";
import {
  useInfiniteInternshipReviews,
  useInfiniteWorkReviews,
} from "@/entities/review/hooks";
import { REVIEW_TYPES, REVIEW_TYPE_LABELS } from "@/shared/constants/review";
import { useSchoolNavigation } from "@/shared/hooks/useSchoolNavigation";
import { setReviewState } from "@/shared/utils/lastVisitedPathUtils";
import { getFieldConfigsByType } from "@/widgets/review-panel/lib/getFieldConfigsByType";

type ReviewData = InternshipReview | WorkReview;

export function useReviewPage(
  kindergartenId: string,
  type: string,
  sortType: SortType
) {
  const { schoolOptions } = useSchoolNavigation(kindergartenId);
  const fieldConfigs = getFieldConfigsByType(type);
  const user = useAtomValue(userAtom);

  const workReviews = useInfiniteWorkReviews(kindergartenId, sortType, 10);
  const internshipReviews = useInfiniteInternshipReviews(
    kindergartenId,
    sortType,
    10
  );

  const infiniteQuery =
    type === REVIEW_TYPES.WORK ? workReviews : internshipReviews;

  // 모든 페이지의 리뷰를 단일 배열로 변환
  const reviews: ReviewData[] = useMemo(() => {
    const allPages = infiniteQuery.data?.pages || [];
    const allReviews: ReviewData[] = [];
    allPages.forEach((page) => {
      if (page.content) {
        allReviews.push(...(page.content as ReviewData[]));
      }
    });
    return allReviews;
  }, [infiniteQuery.data]);

  // 평균 점수 계산
  const reviewData = useMemo(() => {
    const totalRating =
      (reviews as ReviewData[]).reduce((acc: number, review: ReviewData) => {
        if (type === REVIEW_TYPES.WORK && "workReviewId" in review) {
          return (
            acc +
            (review.benefitAndSalaryScore +
              review.workLifeBalanceScore +
              review.workEnvironmentScore +
              review.managerScore +
              review.customerScore) /
              5
          );
        } else if ("internshipReviewId" in review) {
          return (
            acc +
            (review.workEnvironmentScore +
              review.learningSupportScore +
              review.instructionTeacherScore) /
              3
          );
        }
        return acc;
      }, 0) / reviews.length || 0;

    const scores = (reviews as ReviewData[]).reduce(
      (acc: Record<string, number>, review: ReviewData) => {
        if (type === REVIEW_TYPES.WORK && "workReviewId" in review) {
          acc.welfare = (acc.welfare || 0) + review.benefitAndSalaryScore;
          acc.workLabel = (acc.workLabel || 0) + review.workLifeBalanceScore;
          acc.atmosphere = (acc.atmosphere || 0) + review.workEnvironmentScore;
          acc.manager = (acc.manager || 0) + review.managerScore;
          acc.customer = (acc.customer || 0) + review.customerScore;
        } else if ("internshipReviewId" in review) {
          acc.atmosphere = (acc.atmosphere || 0) + review.workEnvironmentScore;
          acc.studyHelp = (acc.studyHelp || 0) + review.learningSupportScore;
          acc.teacherGuide =
            (acc.teacherGuide || 0) + review.instructionTeacherScore;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    Object.keys(scores).forEach((key) => {
      scores[key] = scores[key] / reviews.length || 0;
    });

    return {
      reviews,
      rating: { total: totalRating },
      scores,
    };
  }, [reviews, type]);

  // 페이지 접근 시 최근 방문 경로 저장
  useEffect(() => {
    setReviewState({
      path: `/kindergarten/${kindergartenId}/review?type=${type}`,
      type: type as "work" | "learning",
    });
  }, [kindergartenId, type]);

  const isDisabled = () => {
    if (!user) return true;

    if (type === REVIEW_TYPES.LEARNING) {
      return !(
        user.role === "TEACHER" ||
        user.role === "PROSPECTIVE_TEACHER" ||
        user.role === "ADMIN"
      );
    } else if (type === REVIEW_TYPES.WORK) {
      return !(user.role === "TEACHER" || user.role === "ADMIN");
    }

    return true;
  };

  return {
    schoolOptions,
    fieldConfigs,
    reviewData,
    pageTitle: `원바원 | ${kindergartenId} ${REVIEW_TYPE_LABELS[type as "work" | "learning"]}`,
    currentPath: `/kindergarten/${kindergartenId}/review?type=${type}`,
    isDisabled: isDisabled(),
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
  };
}
