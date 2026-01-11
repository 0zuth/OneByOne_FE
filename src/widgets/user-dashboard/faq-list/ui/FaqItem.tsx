import clsx from "clsx";

import { SVG_PATHS } from "@/shared/constants/assets-path";

interface FaqItemProps {
  faq: {
    id: number;
    question: string;
    answer: string;
  };
  expanded: boolean;
  onToggle: () => void;
}

export default function FaqItem({ faq, expanded, onToggle }: FaqItemProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <button
        onClick={onToggle}
        className="relative flex items-start gap-3 rounded-lg border border-primary-light02 bg-white p-4 text-left duration-200 active:brightness-95"
      >
        <span className="text-sm font-semibold text-tertiary-3">
          Q{faq.id}.
        </span>
        <span className="flex-1 text-sm font-medium text-primary-dark01">
          {faq.question}
        </span>
        <img
          src={SVG_PATHS.ARROW.LIGHT}
          width={20}
          height={20}
          alt="펼치기"
          className={clsx(
            "transform-gpu transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none",
            expanded ? "rotate-180" : "rotate-0"
          )}
        />
      </button>

      <div
        className={clsx(
          "grid transition-all duration-200 ease-out",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1.5 rounded-lg border-2 border-primary-light02 bg-primary-foreground p-5">
            <div className="flex items-start gap-2">
              <span className="text-sm font-semibold text-primary-normal01">
                A.
              </span>
              <p className="flex-1 text-sm leading-relaxed text-primary-dark01">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
