import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/buttons/base-button";
import { cn } from "@/shared/utils/cn";

const closeButtonVariants = cva("h-auto p-0.5 hover:opacity-70", {
  variants: {
    variant: {
      primary: "text-primary-dark01",
      secondary: "text-secondary-main",
      tertiary: "text-tertiary-2",
      tertiary_dark: "text-tertiary-4",
    },
  },
  defaultVariants: {
    variant: "tertiary",
  },
});

interface BadgeButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "tertiary" | "tertiary_dark";
  size?: "md" | "lg";
  onClose?: () => void;
  closeButtonAriaLabel?: string;
  children: React.ReactNode;
}

export default function BadgeButton({
  variant = "tertiary_dark",
  size = "lg",
  onClose,
  closeButtonAriaLabel,
  className,
  children,
  ...props
}: BadgeButtonProps) {
  return (
    <Badge
      variant={variant}
      size={size}
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {children}
      {onClose && (
        <Button
          type="button"
          variant="transparent"
          size="xs"
          onClick={onClose}
          className={cn(closeButtonVariants({ variant }))}
          aria-label={closeButtonAriaLabel || "삭제 버튼"}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  );
}
