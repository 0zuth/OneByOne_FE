import Button from "@/shared/ui/buttons/base-button";

import Header from "../base-header";

interface SaveHeaderProps {
  title?: string;
  hasBorder?: boolean;
  hasBackButton?: boolean;
  onBackButtonClick?: () => void;
  onSave?: () => void;
  showHamburgerButton?: boolean;
}

export default function SaveHeader({
  title,
  hasBorder,
  hasBackButton,
  onBackButtonClick,
  onSave,
  showHamburgerButton,
}: SaveHeaderProps) {
  return (
    <Header
      title={title}
      hasBorder={hasBorder}
      hasBackButton={hasBackButton}
      onBackButtonClick={onBackButtonClick}
      showHamburgerButton={showHamburgerButton}
    >
      <Button
        type="button"
        variant="tertiary"
        border="blue"
        size="sm"
        font="sm"
        aria-label="저장"
        onClick={onSave}
      >
        저장하기
      </Button>
    </Header>
  );
}
