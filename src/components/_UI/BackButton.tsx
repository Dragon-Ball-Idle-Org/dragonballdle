import { ArrowFatLeftIcon } from "@phosphor-icons/react/ssr";

export function BackButton() {
  return (
    <button className="w-10 h-10 rounded-full shadow-game flex items-center justify-center cursor-pointer bg-primary transition-transform hover:scale-110">
      <ArrowFatLeftIcon className="w-8 h-8 text-white" />
    </button>
  );
}
