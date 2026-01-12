import { Suspense, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import NavBar from "@/features/nav/ui/NavBar";
import PostButton from "@/shared/ui/buttons/post-button";
import PageLayout from "@/shared/ui/layout/page-layout";
import LoadingSpinner from "@/shared/ui/loading/loading-spinner";
import { setCommunityState } from "@/shared/utils/lastVisitedPathUtils";
import {
  CATEGORY_ICONS,
  PROSPECTIVE_TEACHER_CATEGORIES,
  TEACHER_CATEGORIES,
} from "@/widgets/community-feed/lib/category";
import PostList from "@/widgets/community-feed/post-list";
import PopularPostList from "@/widgets/community-feed/post-list/ui/PopularPostList";
import CategorySelector from "@/widgets/community-feed/ui/CategorySelector";
import PeriodSelector, {
  type PeriodType,
} from "@/widgets/community-feed/ui/PeriodSelector";

export default function CommunityPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const typeParam = searchParams.get("type") || "popular"; // 기본값: 인기글
  const period = (searchParams.get("period") || "weekly") as PeriodType;
  const categoryName = searchParams.get("category") || "all";

  // type에 따라 모드 결정
  const isPopularMode = typeParam === "popular";
  const communityType = isPopularMode
    ? "teacher"
    : typeParam === "pre-teacher"
      ? "pre-teacher"
      : "teacher";

  const categoryOptions =
    communityType === "pre-teacher"
      ? PROSPECTIVE_TEACHER_CATEGORIES
      : TEACHER_CATEGORIES;

  // 세션 스토리지에 위치 정보 저장
  useEffect(() => {
    const path = isPopularMode
      ? `/community?type=popular&period=${period}`
      : `/community?type=${communityType}&category=${categoryName}`;

    const newState = {
      path,
      category: communityType as "teacher" | "pre-teacher",
      communityCategoryName: isPopularMode ? period : categoryName,
    };

    setCommunityState(newState);
  }, [communityType, period, categoryName, isPopularMode]);

  const currentPath = isPopularMode
    ? `/community?type=popular&period=${period}`
    : `/community?type=${communityType}&category=${categoryName}`;

  const pageTitle = isPopularMode
    ? "원바원 | 인기 게시글"
    : `원바원 | ${communityType === "teacher" ? "교사" : "예비교사"} 커뮤니티`;

  return (
    <PageLayout
      title={pageTitle}
      headerLogo={true}
      headerType="community"
      description="유치원 교사와 예비교사를 위한 커뮤니티"
      currentPath={currentPath}
      mainClassName="flex flex-col gap-6 pb-0 mt-14"
      hasBackButton={false}
    >
      <NavBar options={CATEGORY_ICONS} currentPath={currentPath} />

      <div className="flex w-full flex-col gap-4 px-5">
        {/* 인기글 모드: 주간/월간/전체 탭만 표시 */}
        {isPopularMode ? (
          <>
            <PeriodSelector type="popular" />
            <Suspense fallback={<LoadingSpinner type="element" />}>
              <PopularPostList period={period} />
            </Suspense>
          </>
        ) : (
          <>
            {/* 일반 모드: 카테고리 선택만 표시 */}
            <CategorySelector
              type={communityType as "teacher" | "pre-teacher"}
              categoryOptions={categoryOptions}
            />
            <Suspense fallback={<LoadingSpinner type="element" />}>
              <PostList
                type={communityType as "teacher" | "pre-teacher"}
                categoryName={categoryName}
              />
            </Suspense>
          </>
        )}
      </div>

      <PostButton onClick={() => navigate("/community/new")} label="글쓰기" />
    </PageLayout>
  );
}
