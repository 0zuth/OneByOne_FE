import type { Shortcut } from "@/entities/shortcuts/DTO.d";
import { useShortcuts } from "@/entities/shortcuts/hooks/useShortcuts";
import { IMAGE_PATHS } from "@/shared/constants/assets-path";
import Toggle from "@/shared/ui/buttons/base-toggle";
import ShortCutAddButton from "@/widgets/shortcut-list/ui/ShortCutAddButton";
import ShortCutButton from "@/widgets/shortcut-list/ui/ShortCutButton";

export default function ShortCutList({ onNavigate }: ShortCutListProps) {
  const { shortcuts, navigateToEdit } = useShortcuts();

  const handleEditClick = () => {
    onNavigate?.();
    navigateToEdit();
  };

  const handleShortcutNavigate = () => {
    onNavigate?.();
  };

  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <img
          src={IMAGE_PATHS.TYPO.MENU_BOOKMARK}
          alt="메뉴 즐겨찾기 타이포그래피"
          width={80}
          height={20}
          loading="lazy"
          decoding="async"
        />
        <Toggle
          onClick={handleEditClick}
          font="xs"
          className="px-2 py-1 text-tertiary-3"
        >
          편집하기
        </Toggle>
      </div>
      <menu className="flex justify-between">
        {shortcuts?.map((shortcut: Shortcut) => (
          <ShortCutButton
            key={shortcut.name}
            shortcut={shortcut}
            onNavigate={handleShortcutNavigate}
          />
        ))}
        {(!shortcuts || shortcuts.length < 4) && (
          <ShortCutAddButton navigateToEdit={handleEditClick} />
        )}
      </menu>
    </section>
  );
}

// ------------------------------------------------------------------------------

interface ShortCutListProps {
  onNavigate?: () => void;
}
