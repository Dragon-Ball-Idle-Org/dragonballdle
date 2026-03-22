import { ArrowFatLeftIcon } from "@phosphor-icons/react/ssr";
import { Link } from "@/i18n/navigation";

export function BackButton() {
  return (
    <Link
      href="/"
      className="w-10 h-10 rounded-full shadow-game flex items-center justify-center cursor-pointer bg-black transition-transform hover:scale-110"
    >
      <ArrowFatLeftIcon weight="fill" className="w-8 h-8 text-primary" />
    </Link>
  );
}
