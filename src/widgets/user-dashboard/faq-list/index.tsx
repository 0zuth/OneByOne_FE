import { useState } from "react";

import { FAQ_LIST } from "@/shared/constants/inquiry";

import FaqItem from "./ui/FaqItem";

export default function FaqList() {
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  const handleToggleExpand = (faqId: number) => {
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  };

  return (
    <section className="flex flex-col gap-2">
      {FAQ_LIST.map((faq) => (
        <FaqItem
          key={faq.id}
          faq={faq}
          expanded={expandedFaqId === faq.id}
          onToggle={() => handleToggleExpand(faq.id)}
        />
      ))}
    </section>
  );
}
