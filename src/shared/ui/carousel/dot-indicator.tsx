import { cn } from "@/shared/utils/cn";

interface DotIndicatorProps {
  total: number;
  current: number;
  className?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  onPageClick?: (page: number) => void;
}

export default function DotIndicator({
  total,
  current,
  className,
  dotClassName,
  activeDotClassName,
  onPageClick,
}: DotIndicatorProps) {
  return (
    <div className={cn("flex gap-1", className)}>
      {Array.from({ length: total }).map((_, index) => {
        const page = index + 1;
        const isActive = current === page;
        const Component = onPageClick ? "button" : "span";

        return (
          <Component
            key={index}
            type={onPageClick ? "button" : undefined}
            onClick={onPageClick ? () => onPageClick(page) : undefined}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              isActive ? "w-4" : "opacity-70",
              isActive
                ? activeDotClassName || "bg-white"
                : dotClassName || "bg-white/40",
              onPageClick && "cursor-pointer hover:opacity-100"
            )}
            aria-label={`페이지 ${page}${isActive ? " (현재)" : ""}`}
          />
        );
      })}
    </div>
  );
}
