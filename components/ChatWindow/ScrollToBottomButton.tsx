import { MdArrowDownward } from "react-icons/md";

interface ScrollToBottomButtonProps {
  onClick: () => void;
}

export default function ScrollToBottomButton({ onClick }: ScrollToBottomButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary text-background-dark shadow-lg hover:bg-primary/90 transition-transform hover:scale-105"
      aria-label="Scroll to bottom"
    >
      <MdArrowDownward className="text-2xl text-background-dark" />
    </button>
  );
}

