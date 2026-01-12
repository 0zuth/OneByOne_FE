import { useSearchParams } from "react-router-dom";

import Button from "@/shared/ui/buttons/base-button";

export type PeriodType = "weekly" | "monthly" | "all";

const PERIOD_OPTIONS = [
  { value: "weekly" as const, label: "주간" },
  { value: "monthly" as const, label: "월간" },
  { value: "all" as const, label: "전체" },
];

interface PeriodSelectorProps {
  type: "popular";
}

export default function PeriodSelector({ type }: PeriodSelectorProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPeriod = (searchParams.get("period") || "weekly") as PeriodType;

  const handlePeriodChange = (period: PeriodType) => {
    if (period === currentPeriod) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("period", period);
    newSearchParams.set("type", type);
    setSearchParams(newSearchParams);
  };

  return (
    <section className="scrollbar-x-hidden flex w-full gap-2 overflow-x-auto whitespace-nowrap">
      {PERIOD_OPTIONS.map((option) => (
        <Button
          key={option.value}
          shape="full"
          font="md"
          size="lg"
          variant={currentPeriod === option.value ? "secondary" : "default"}
          onClick={() => handlePeriodChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </section>
  );
}
