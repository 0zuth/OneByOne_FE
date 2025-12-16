import { Link } from "react-router-dom";

import { IMAGE_PATHS, SVG_PATHS } from "@/shared/constants/assets-path";
import { URL_PATHS } from "@/shared/constants/url-path";
import NoticeCard from "@/widgets/home-dashboard/ui/NoticeCard";
import ShortCutList from "@/widgets/shortcut-list";

import { clearReturnUrl } from "./lib/sidebarStorage";

// ------------------------------------------------------------------------------

const MENU_SECTIONS = [
  {
    title: "추천",
    items: [
      { label: "즐겨찾기", path: URL_PATHS.USER_FAVORITES },
      { label: "작성한 리뷰 관리", path: URL_PATHS.USER_POST },
      { label: "주변 유치원 찾기", path: URL_PATHS.KINDERGARTEN },
      { label: "유치원 검색", path: URL_PATHS.SEARCH_KINDERGARTEN },
    ],
  },
  {
    title: "커뮤니티",
    items: [
      { label: "예비교사 커뮤니티", path: URL_PATHS.COMMUNITY_STUDENT },
      { label: "교사 커뮤니티", path: URL_PATHS.COMMUNITY_TEACHER },
    ],
  },
  {
    title: "기타",
    items: [
      { label: "교사 게시글 작성", path: URL_PATHS.COMMUNITY_POST_EDITOR },
      { label: "1:1 문의", path: URL_PATHS.INQUIRY_EDITOR },
      { label: "문의내역", path: URL_PATHS.INQUIRY_MY },
    ],
  },
];

// ------------------------------------------------------------------------------

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  if (!isOpen) return null;

  const handleClose = () => {
    clearReturnUrl();
    onClose();
  };

  return (
    <aside
      className="fixed inset-0 z-[60] mx-auto flex w-full min-w-80 max-w-3xl flex-col bg-primary-foreground"
      role="dialog"
      aria-modal="true"
      aria-label="원바원 메뉴 목록"
    >
      <header
        aria-label="원바원 바로가기"
        className="flex h-14 flex-shrink-0 items-center justify-between px-5"
      >
        <img
          src={IMAGE_PATHS.TYPO.SHORTCUT}
          alt="원바원 바로가기 타이포그래피"
          width={120}
          height={36}
          loading="lazy"
          decoding="async"
        />
        <div className="flex items-center gap-4">
          <Link
            to={URL_PATHS.HOME}
            className="flex h-6 w-6 items-center justify-end transition-colors hover:brightness-75 active:brightness-75"
            aria-label="홈 이동 버튼"
          >
            <img
              src={SVG_PATHS.HOME}
              alt="홈 아이콘"
              aria-hidden="true"
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-6 w-6 items-center justify-end transition-colors hover:brightness-75 active:brightness-75"
            aria-label="메뉴 닫기"
          >
            <img
              src={SVG_PATHS.CANCEL}
              alt="X 아이콘"
              aria-hidden="true"
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-5">
        {/* 공지사항 & 바로가기 */}
        <section className="mx-5 flex flex-col gap-3">
          <NoticeCard />
          <ShortCutList onNavigate={handleClose} />
        </section>

        {/* 메뉴 */}
        <nav aria-label="원바원 메뉴" className="bg-white">
          {MENU_SECTIONS.map(({ title, items }) => (
            <section key={title} className="flex flex-col gap-3.5 p-5">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-medium text-primary-normal03">
                  {title}
                </h3>
                <hr className="border-primary-normal01" />
              </div>
              <ul className="flex flex-col gap-6 font-semibold text-primary-dark01">
                {items.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={handleClose}
                      className="block transition-colors hover:text-primary active:text-primary"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// ------------------------------------------------------------------------------

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}
