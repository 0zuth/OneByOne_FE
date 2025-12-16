import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import SideBar from "@/features/side-bar";
import {
  consumeShouldOpenSidebar,
  saveReturnUrl,
} from "@/features/side-bar/lib/sidebarStorage";
import { IMAGE_PATHS, SVG_PATHS } from "@/shared/constants/assets-path";
import { URL_PATHS } from "@/shared/constants/url-path";
import AlarmButton from "@/shared/ui/buttons/alarm-button";
import HamburgerButton from "@/shared/ui/buttons/hamburger-button";
import { cn } from "@/shared/utils/cn";

import useHeaderNavigation from "../useHeaderNavigation";

interface HeaderProps extends VariantProps<typeof headerVariants> {
  children?: React.ReactNode;
  title?: string;
  titleElement?: React.ReactNode;
  headerLogo?: boolean;
  hasBackButton?: boolean;
  onBackButtonClick?: () => void;
  showAlarmButton?: boolean;
  showHamburgerButton?: boolean;
}

const headerVariants = cva(
  "fixed top-0 z-50 gap-3 w-full min-w-80 max-w-3xl flex h-14 items-center px-5 font-bold text-lg",
  {
    variants: {
      bgColor: {
        white: "bg-white",
        ghost: "bg-transparent",
      },
      hasBorder: {
        true: "border-b border-opacity-5",
        false: "",
      },
    },
    defaultVariants: {
      bgColor: "white",
      hasBorder: true,
    },
  }
);

export default function Header({
  children,
  title,
  titleElement,
  headerLogo,
  bgColor = "white",
  hasBorder = true,
  hasBackButton,
  onBackButtonClick,
  showAlarmButton = false,
  showHamburgerButton = true,
}: HeaderProps) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const location = useLocation();

  const { shouldShowBackButton, handleBackNavigation } = useHeaderNavigation({
    hasBackButton,
    onBackButtonClick,
  });

  // 페이지 진입 시 사이드바 자동 열기 체크
  useEffect(() => {
    if (consumeShouldOpenSidebar()) {
      setIsSideBarOpen(true);
    }
  }, []);

  const handleOpenSidebar = () => {
    // 현재 URL 저장 후 사이드바 열기
    saveReturnUrl(location.pathname + location.search);
    setIsSideBarOpen(true);
  };

  return (
    <>
      <header className={cn(headerVariants({ bgColor, hasBorder }))}>
        {shouldShowBackButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleBackNavigation();
            }}
            aria-label="뒤로 가기"
          >
            <img
              src={SVG_PATHS.ARROW.LEFT}
              alt="뒤로 가기"
              className="h-6 w-6 duration-200 hover:opacity-80 active:opacity-60"
            />
          </button>
        )}
        <div className="flex w-full items-center justify-between">
          {titleElement ? (
            <div className="min-w-0 flex-1">{titleElement}</div>
          ) : title ? (
            <h1 className="min-w-0 flex-1 truncate pr-2">{title}</h1>
          ) : headerLogo ? (
            <Link to={URL_PATHS.HOME} className="flex-shrink-0">
              <img
                src={IMAGE_PATHS.LOGO.MAIN}
                alt="원바원 로고"
                width={51}
                height={18}
              />
            </Link>
          ) : null}
          {/* 우측 버튼 영역 */}
          <div className="flex items-center">
            {showAlarmButton && <AlarmButton />}
            {children}
            {showHamburgerButton && (
              <HamburgerButton
                onClick={handleOpenSidebar}
                isOpen={isSideBarOpen}
              />
            )}
          </div>
        </div>
      </header>

      {/* 사이드바 */}
      {showHamburgerButton && (
        <SideBar
          isOpen={isSideBarOpen}
          onClose={() => setIsSideBarOpen(false)}
        />
      )}
    </>
  );
}
