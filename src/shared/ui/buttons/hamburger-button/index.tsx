import { SVG_PATHS } from "@/shared/constants/assets-path";
import { cn } from "@/shared/utils/cn";

export default function HamburgerButton({
  onClick,
  isOpen,
  className,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-10 w-10 items-center justify-end rounded-full transition-colors hover:brightness-75 active:brightness-75",
        className
      )}
      aria-label={isOpen ? "메뉴 닫기" : "메뉴 열기"}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    >
      <img
        src={SVG_PATHS.USER_MENU.HAMBURGER}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
      />
    </button>
  );
}

// ------------------------------------------------------------------------------

interface HamburgerButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  className?: string;
}
