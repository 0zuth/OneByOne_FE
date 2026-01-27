import { SVG_PATHS } from "@/shared/constants/assets-path";

interface ReviewWriterBadgeProps {
  hasWrittenReview?: boolean;
}

export default function ReviewWriterBadge({
  hasWrittenReview = false,
}: ReviewWriterBadgeProps) {
  if (!hasWrittenReview) return null;

  return (
    <img
      src={SVG_PATHS.KINDERGARTEN_INFO.CERTIFICATION}
      alt="리뷰 작성자"
      width={16}
      height={16}
      className="inline-block"
      title="리뷰 작성자"
    />
  );
}
