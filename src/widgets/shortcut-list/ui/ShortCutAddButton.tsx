export default function ShortCutAddButton({
  navigateToEdit,
}: {
  navigateToEdit: () => void;
}) {
  return (
    <li className="flex flex-col items-center justify-between duration-100 ease-out hover:opacity-80 active:scale-95">
      <button
        onClick={navigateToEdit}
        className="flex h-14 w-14 items-center justify-center"
      >
        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-primary-foreground">
          <span className="text-3xl font-light text-primary-normal02">+</span>
        </div>
      </button>
      <p className="text-xs text-primary-dark02">바로가기</p>
    </li>
  );
}
