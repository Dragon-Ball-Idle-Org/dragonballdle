import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { XLogoIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";

export function MartialArtsWinBanner() {
  return (
    <div className="flex flex-wrap items-center justify-center">
      <div
        className={cn(
          "grid auto-rows-max justify-items-center w-full",
          "max-w-[90xw] min-w-130 p-4 sm:p-3 border-martial-arts",
          "bg-primary shadow-[0_8px_20px_#00000042] text-shadow-[1px_1px_3px_rgba(0,0,0,.85)]",
        )}
      >
        <h3 className="text-center text-xl font-black m-0 mb-2 pb-2 border-b-2 border-black/16">
          Today&apos;s result
        </h3>

        <Row title="Tries" value="1" />
        <Row title="Next character" value="01:00:00" />

        <div className="w-full flex flex-col items-center justify-center gap-3 border-t border-black/12 pt-3 pb-2">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="font-bold">Today&apos;s character</span>
            <strong
              className={cn(
                "inline-block rounded-xl py-2 px-3 shadow-[inset_0_1px_8px_#00000038,0_2px_8px_#0000001f]",
                "bg-linear-135 from-green-500 to-green-700",
                "font-ui font-black text-xl text-shadow-[1px_1px_2px_rgba(0,0,0,.6)] whitespace-nowrap",
              )}
            >
              Android 15
            </strong>
          </div>
          <Image
            src="https://cdn.dragonballdle.site/characters/thumbs/android_15.png"
            alt="Android 15 thumbnail"
            width={80}
            height={80}
            className="w-20 h-20 rounded-xl object-cover shadow-[0_0_0_1px_#ffffffa6,0_4px_14px_#00000047]"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link
            href=""
            className={cn(
              "inline-flex items-center justify-center gap-2 w-full sm:w-auto! max-h-11 rounded-xl p-4",
              "bg-black shadow-[inset_0_0_0_1px_#fff3,0_6px_14px_#00000040]",
              "transition-transform ease-linear hover:scale-105",
            )}
          >
            <XLogoIcon size={18} />
            <span className="leading-none">Share on X</span>
          </Link>
          <Link
            href=""
            className={cn(
              "inline-flex items-center justify-center gap-2 w-full sm:w-auto! max-h-11 rounded-xl p-3",
              "bg-buy-me-a-coffe shadow-[inset_0_0_0_1px_#fff3,0_6px_14px_#00000040]",
              "transition-transform ease-linear hover:scale-105",
            )}
          >
            <Image
              src="/assets/buy-me-a-coffe.svg"
              alt="Buy me a coffe"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <span className="leading-none">Support us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between w-full p-2 border-t border-black/12">
      <span className="font-bold">{title}</span>
      <span className="font-ui font-black py-0.5 px-2 rounded-xl outline outline-white/45 bg-black/15">
        {value}
      </span>
    </div>
  );
}
