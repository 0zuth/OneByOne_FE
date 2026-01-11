import { InquiryStatus } from "@/entities/inquiry/DTO.d";

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  [InquiryStatus.PENDING]: "미답변",
  [InquiryStatus.CLOSED]: "마감",
  [InquiryStatus.ANSWERED]: "답변완료",
};

export const INQUIRY_TITLE_LABEL: Record<string, string> = {
  GENERAL: "이용문의",
  REPORT: "오류문의",
  SERVICE: "서비스 제안",
  ETC: "기타",
};

export const INQUIRY_TAB_OPTIONS = [
  { type: "ALL" as const, label: "전체" },
  {
    type: InquiryStatus.ANSWERED,
    label: INQUIRY_STATUS_LABEL[InquiryStatus.ANSWERED],
  },
  {
    type: InquiryStatus.PENDING,
    label: INQUIRY_STATUS_LABEL[InquiryStatus.PENDING],
  },
] as const;

export type InquiryTab = (typeof INQUIRY_TAB_OPTIONS)[number]["type"];

export const FAQ_LIST = [
  {
    id: 1,
    question: "리뷰 삭제 어떻게 하나요?",
    answer:
      "작성하신 리뷰는 [앱 상단 ☰ 버튼 클릭 → '작성한 리뷰 관리' 메뉴 클릭 → ⋮ 버튼 클릭]에서 직접 수정 및 삭제가 가능합니다. ☺️ 리뷰 삭제 시 해당 내용은 복구되지 않으니 신중하게 결정해 주세요!",
  },
  {
    id: 2,
    question: "유치원 관리자가 알게되어 신고하면 어떻게 되나요?",
    answer:
      "작성된 리뷰는 익명으로 처리됩니다. 다만, 리뷰에 대해 공식적인 신고가 접수될 경우 서비스 이용 가이드에 명시된 바와 같이 관련 법령 및 절차에 따라 필요한 범위 내에서 정보 제공이 이루어질 수 있음을 안내드립니다. 또한 리뷰는 공지 및 이용 가이드라인에 안내된 작성 기준에 맞게 작성해 주시기를 요청드리며, 해당 기준에 부합하지 않는 표현이나 오해의 소지가 있는 내용은 수정 요청 또는 조치가 이루어질 수 있습니다. 현재로서는 리뷰를 지속적으로 관리·모니터링하며, 특정 인원 언급이나 오해의 소지가 있는 내용에 대해서는 선제적으로 대응하고 있습니다.",
  },
  {
    id: 3,
    question: "어린이집은 볼 수 없나요?",
    answer:
      "어린이집 정보는 향후 서비스 확장 시 추가될 예정이오니 많은 관심 부탁드립니다! ☺️",
  },
  {
    id: 4,
    question: "문의 답변은 언제 오나요?",
    answer:
      "문의는 접수 순서대로 1주 이내에 안내드리고 있으며, 운영 상황에 따라 답변까지 시간이 소요될 수 있는 점 양해 부탁드립니다. 동일 문의에 대한 재문의는 오히려 답변이 지연될 수 있어, 기다려주시면 순차적으로 안내드리겠습니다. ☺️",
  },
] as const;
