import { Link } from "react-router-dom";

import type { Shortcut } from "@/entities/shortcuts/DTO.d";

export default function ShortCutButton({
  shortcut,
  onNavigate,
}: ShortCutButtonProps) {
  return (
    <li
      key={shortcut.name}
      className="flex flex-col items-center duration-200 ease-out hover:opacity-80 active:scale-95"
    >
      <Link
        to={shortcut.link}
        onClick={onNavigate}
        className="relative flex h-14 w-14 items-center justify-center"
      >
        <img
          src={shortcut.iconName}
          alt={`${shortcut.name} 바로가기`}
          width={40}
          height={40}
          loading="lazy"
          decoding="async"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </Link>
      <p className="line-clamp-1 max-w-14 text-pretty text-center text-xs text-primary-dark02">
        {shortcut.name}
      </p>
    </li>
  );
}

// ------------------------------------------------------------------------------

interface ShortCutButtonProps {
  shortcut: Shortcut;
  onNavigate?: () => void;
}
