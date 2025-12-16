import { Fragment } from "react";

import type { Kindergarten } from "@/entities/kindergarten/DTO.d";
import Empty from "@/shared/ui/layout/empty";
import SchoolCard from "@/widgets/kindergarten-list/ui/SchoolCard";

const TAB_MESSAGES = {
  nearby: {
    title: "주변 유치원",
    emptyTitle: () => "주변 유치원을 찾지 못했어요.",
    emptySubTitle: () => "권한 설정을 확인해보세요.",
  },
  region: {
    title: "유치원 찾기",
    emptyTitle: (hasRegion: boolean) =>
      hasRegion
        ? "해당 지역의 유치원을 찾지 못했어요."
        : "선택된 지역이 없어요.",
    emptySubTitle: (hasRegion: boolean) =>
      hasRegion ? "다른 지역을 검색해보세요." : "",
  },
} as const;

// ------------------------------------------------------------------------------

export default function KindergartenList({
  kindergartens,
  tabType,
  hasRegion = false,
}: KindergartenListProps) {
  const messages = TAB_MESSAGES[tabType];
  const title = messages.title;
  const emptyTitle =
    tabType === "nearby"
      ? (messages.emptyTitle as () => string)()
      : (messages.emptyTitle as (hasRegion: boolean) => string)(hasRegion);
  const emptySubTitle =
    tabType === "nearby"
      ? (messages.emptySubTitle as () => string)()
      : (messages.emptySubTitle as (hasRegion: boolean) => string)(hasRegion);

  return (
    <section className="flex min-h-[300px] flex-col gap-3">
      <div className="flex items-center gap-1 px-5 font-bold">
        <h2 className="text-lg">{title}</h2>
        <span className="text-xs">
          {kindergartens.length > 0 && `(${kindergartens.length})`}
        </span>
      </div>

      {kindergartens.length === 0 ? (
        <Empty title={emptyTitle} subTitle={emptySubTitle} />
      ) : (
        <ul className="flex flex-col gap-1">
          {kindergartens.map((kindergarten: Kindergarten, index: number) => (
            <Fragment key={kindergarten.id}>
              <SchoolCard
                id={kindergarten.id.toString()}
                schoolName={kindergarten.name}
                location={kindergarten.address}
                establishment={kindergarten.establishment}
                workReviewAggregate={kindergarten.workReviewAggregate}
              />
              {index < kindergartens.length - 1 && <hr className="mx-5" />}
            </Fragment>
          ))}
        </ul>
      )}
    </section>
  );
}

interface KindergartenListProps {
  kindergartens: Kindergarten[];
  tabType: "nearby" | "region";
  hasRegion?: boolean;
}
