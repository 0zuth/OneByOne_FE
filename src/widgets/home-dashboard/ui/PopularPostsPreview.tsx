import { useState } from "react";
import { Link } from "react-router-dom";

import { usePopularPostsByPeriod } from "@/entities/community/hooks/usePopularPostsByPeriod";
import { URL_PATHS } from "@/shared/constants/url-path";
import Button from "@/shared/ui/buttons/base-button";
import Empty from "@/shared/ui/layout/empty";
import { getCategoryLabel } from "@/shared/utils/categoryUtils";
import PostCard from "@/widgets/community-feed/post-list/ui/PostCard";

type PeriodType = "weekly" | "monthly" | "all";

const PERIOD_OPTIONS = [
  { value: "weekly" as const, label: "주간" },
  { value: "monthly" as const, label: "월간" },
  { value: "all" as const, label: "전체" },
];

const PERIOD_LABELS = {
  weekly: "주간",
  monthly: "월간",
  all: "전체",
} as const;

export default function PopularPostsPreview() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("weekly");
  const { data: postsData } = usePopularPostsByPeriod();

  const currentPosts = postsData?.data[selectedPeriod] || [];

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-primary-light02 px-5 py-4">
      {/* 기간 선택 탭 */}
      <section className="scrollbar-x-hidden flex w-full gap-2 overflow-x-auto whitespace-nowrap">
        {PERIOD_OPTIONS.map((option) => (
          <Button
            key={option.value}
            shape="full"
            font="md"
            size="lg"
            variant={selectedPeriod === option.value ? "secondary" : "default"}
            onClick={() => setSelectedPeriod(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </section>

      {/* 게시글 목록 */}
      {currentPosts.length === 0 ? (
        <Empty
          title={`${PERIOD_LABELS[selectedPeriod]} 인기 게시글이 없어요`}
          subTitle="첫 번째로 게시글을 작성해보세요!"
          type="element"
        />
      ) : (
        [0, 1, 2].map((i) =>
          currentPosts[i] ? (
            <PostCard
              key={currentPosts[i].id}
              post={currentPosts[i]}
              index={i}
              currentCategory="top10"
              getCategoryLabel={getCategoryLabel}
            />
          ) : null
        )
      )}
      
      <Link to={URL_PATHS.COMMUNITY}>
        <Button variant="secondary" type="button" size="lg" className="w-full">
          인기글 전체보기
        </Button>
      </Link>
    </div>
  );
}
